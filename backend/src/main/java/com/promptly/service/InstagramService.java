package com.promptly.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptly.dto.InstagramAccountDto;
import com.promptly.entity.InstagramAccount;
import com.promptly.repository.InstagramAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InstagramService {

    @Autowired
    private InstagramAccountRepository instagramAccountRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${facebook.app.id}")
    private String appId;

    @Value("${facebook.redirect.uri}")
    private String redirectUri;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${facebook.app.secret}")
    private String appSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getConnectUrl(Integer brandId, Integer userId) {
        Map<String, Integer> stateMap = new HashMap<>();
        stateMap.put("brand_id", brandId);
        stateMap.put("user_id", userId);
        
        String stateJson;
        try {
            stateJson = objectMapper.writeValueAsString(stateMap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create state", e);
        }
        
        String state = Base64.getEncoder().encodeToString(stateJson.getBytes());
        
        // URL encode the redirect URI
        String encodedRedirectUri = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);

        return String.format(
                "https://www.facebook.com/v18.0/dialog/oauth?client_id=%s&redirect_uri=%s&scope=instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement&state=%s&response_type=code",
                appId, encodedRedirectUri, state
        );
    }

    @Transactional
    public void handleOAuthCallback(String code, String state) {
        // Decode and parse state JSON
        String stateData = new String(Base64.getDecoder().decode(state));
        @SuppressWarnings("unchecked")
        Map<String, Integer> stateMap;
        try {
            stateMap = objectMapper.readValue(stateData, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid state parameter", e);
        }
        
        Integer brandId = stateMap.get("brand_id");
        if (brandId == null) {
            throw new RuntimeException("Brand ID not found in state");
        }

        // Exchange code for access token
        String accessToken = exchangeCodeForToken(code);

        // Get pages
        Map<String, Object> pagesResponse = getPages(accessToken);

        // Find page with Instagram account
        Map<String, Object> pageWithInstagram = findPageWithInstagram(pagesResponse);

        if (pageWithInstagram == null) {
            throw new RuntimeException("No Instagram account found");
        }

        String pageId = (String) pageWithInstagram.get("id");
        String pageAccessToken = (String) pageWithInstagram.get("access_token");
        
        @SuppressWarnings("unchecked")
        Map<String, Object> instagramAccount = (Map<String, Object>) pageWithInstagram.get("instagram_business_account");
        if (instagramAccount == null) {
            throw new RuntimeException("Instagram business account not found in page");
        }
        
        String instagramAccountId = (String) instagramAccount.get("id");

        // Get Instagram account details
        Map<String, Object> igDetails = getInstagramAccountDetails(instagramAccountId, pageAccessToken);

        // Save or update Instagram account
        InstagramAccount account = instagramAccountRepository
                .findByInstagramBusinessAccountId(instagramAccountId)
                .orElse(new InstagramAccount());

        account.setBrandId(brandId);
        account.setInstagramBusinessAccountId(instagramAccountId);
        account.setFacebookPageId(pageId);
        account.setPageAccessToken(pageAccessToken);
        account.setUsername((String) igDetails.get("username"));
        account.setProfilePictureUrl((String) igDetails.get("profile_picture_url"));
        account.setIsConnected(true);

        instagramAccountRepository.save(account);
    }

    public InstagramAccountDto getAccount(Integer brandId) {
        InstagramAccount account = instagramAccountRepository
                .findByBrandIdAndIsConnected(brandId, true)
                .orElseThrow(() -> new RuntimeException("No Instagram account connected"));

        return toDto(account);
    }

    @Transactional
    public void disconnect(Integer brandId) {
        InstagramAccount account = instagramAccountRepository
                .findByBrandIdAndIsConnected(brandId, true)
                .orElseThrow(() -> new RuntimeException("No Instagram account found"));

        account.setIsConnected(false);
        instagramAccountRepository.save(account);
    }

    @SuppressWarnings("unchecked")
    private String exchangeCodeForToken(String code) {
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth/access_token")
                        .queryParam("client_id", appId)
                        .queryParam("client_secret", appSecret)
                        .queryParam("redirect_uri", redirectUri)
                        .queryParam("code", code)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response != null && response.containsKey("access_token")) {
            return (String) response.get("access_token");
        }

        throw new RuntimeException("Failed to exchange code for access token: " + response);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getPages(String accessToken) {
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/me/accounts")
                        .queryParam("access_token", accessToken)
                        .queryParam("fields", "id,name,access_token,instagram_business_account")
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> findPageWithInstagram(Map<String, Object> pagesResponse) {
        List<Map<String, Object>> pages = (List<Map<String, Object>>) pagesResponse.get("data");
        
        if (pages == null || pages.isEmpty()) {
            return null;
        }

        // Find the first page with an Instagram business account
        for (Map<String, Object> page : pages) {
            if (page.containsKey("instagram_business_account")) {
                return page;
            }
        }

        return null;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getInstagramAccountDetails(String accountId, String accessToken) {
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        return (Map<String, Object>) webClient.get()
                .uri("/{accountId}?access_token={token}&fields=username,profile_picture_url", accountId, accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }


    private InstagramAccountDto toDto(InstagramAccount account) {
        InstagramAccountDto dto = new InstagramAccountDto();
        dto.setId(account.getId());
        dto.setUsername(account.getUsername());
        dto.setProfilePictureUrl(account.getProfilePictureUrl());
        dto.setIsConnected(account.getIsConnected());
        dto.setLastSyncAt(account.getLastSyncAt());
        dto.setCreatedAt(account.getCreatedAt());
        return dto;
    }
}

