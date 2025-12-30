package com.promptly.controller;

import com.promptly.service.WebhookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Autowired
    private WebhookService webhookService;

    @Value("${webhook.verify.token}")
    private String verifyToken;

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {
        
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        
        return ResponseEntity.status(403).build();
    }

    @PostMapping
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
        try {
            webhookService.processWebhook(payload);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

