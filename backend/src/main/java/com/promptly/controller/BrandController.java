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
    public ResponseEntity<Map<String, BrandDto>> getMyBrand(Authentication authentication) {
        Integer brandId = getBrandId(authentication);
        BrandDto brand = brandService.getBrand(brandId);
        
        Map<String, BrandDto> response = new HashMap<>();
        response.put("brand", brand);
        
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

