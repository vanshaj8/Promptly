package com.promptly.controller;

import com.promptly.dto.BrandDto;
import com.promptly.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "${frontend.url}")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyBrand(Authentication authentication) {
        try {
            Integer brandId = getBrandId(authentication);
            if (brandId == null) {
                return ResponseEntity.status(403).body(new HashMap<String, String>() {{
                    put("error", "Admin users do not have a brand");
                }});
            }
            BrandDto brand = brandService.getBrand(brandId);
            
            Map<String, BrandDto> response = new HashMap<>();
            response.put("brand", brand);
            
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

