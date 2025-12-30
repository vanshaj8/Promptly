package com.promptly.controller;

import com.promptly.dto.InstagramAccountDto;
import com.promptly.service.InstagramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/instagram")
@CrossOrigin(origins = "${frontend.url}")
public class InstagramController {

    @Autowired
    private InstagramService instagramService;

    @GetMapping("/connect-url")
    public ResponseEntity<Map<String, String>> getConnectUrl(Authentication authentication) {
        Integer brandId = getBrandId(authentication);
        Integer userId = Integer.parseInt(authentication.getName());
        
        String authUrl = instagramService.getConnectUrl(brandId, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("authUrl", authUrl);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> handleCallback(
            @RequestParam String code,
            @RequestParam String state,
            @Value("${frontend.url}") String frontendUrl) {
        try {
            instagramService.handleOAuthCallback(code, state);
            return ResponseEntity.status(302)
                    .header("Location", frontendUrl + "/dashboard/instagram?success=true")
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(302)
                    .header("Location", frontendUrl + "/dashboard/instagram?error=connection_failed")
                    .build();
        }
    }

    @GetMapping("/account")
    public ResponseEntity<Map<String, InstagramAccountDto>> getAccount(Authentication authentication) {
        Integer brandId = getBrandId(authentication);
        InstagramAccountDto account = instagramService.getAccount(brandId);
        
        Map<String, InstagramAccountDto> response = new HashMap<>();
        response.put("account", account);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Map<String, String>> disconnect(Authentication authentication) {
        Integer brandId = getBrandId(authentication);
        instagramService.disconnect(brandId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Instagram account disconnected");
        
        return ResponseEntity.ok(response);
    }

    private Integer getBrandId(Authentication authentication) {
        if (authentication != null && authentication.getDetails() != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (Integer) details.get("brandId");
        }
        throw new RuntimeException("Brand ID not found in authentication");
    }
}

