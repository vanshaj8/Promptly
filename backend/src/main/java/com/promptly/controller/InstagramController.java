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
    public ResponseEntity<?> getConnectUrl(Authentication authentication) {
        try {
            Integer brandId = getBrandId(authentication);
            if (brandId == null) {
                return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                    put("error", "Admin users cannot connect Instagram accounts");
                }});
            }
            Integer userId = Integer.parseInt(authentication.getName());
            
            String authUrl = instagramService.getConnectUrl(brandId, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("authUrl", authUrl);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
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
    public ResponseEntity<?> getAccount(Authentication authentication) {
        try {
            Integer brandId = getBrandId(authentication);
            if (brandId == null) {
                return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                    put("error", "Admin users do not have an Instagram account");
                }});
            }
            InstagramAccountDto account = instagramService.getAccount(brandId);
            
            Map<String, InstagramAccountDto> response = new HashMap<>();
            response.put("account", account);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
    }

    @PostMapping("/disconnect")
    public ResponseEntity<?> disconnect(Authentication authentication) {
        try {
            Integer brandId = getBrandId(authentication);
            if (brandId == null) {
                return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                    put("error", "Admin users do not have an Instagram account");
                }});
            }
            instagramService.disconnect(brandId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Instagram account disconnected");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
    }

    private Integer getBrandId(Authentication authentication) {
        if (authentication != null && authentication.getDetails() != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            Integer brandId = (Integer) details.get("brandId");
            if (brandId == null) {
                throw new RuntimeException("Brand ID not found - user may be an admin");
            }
            return brandId;
        }
        throw new RuntimeException("Brand ID not found in authentication");
    }
}

