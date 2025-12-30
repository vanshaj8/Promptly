package com.promptly.controller;

import com.promptly.dto.BrandDto;
import com.promptly.entity.AdminActivityLog;
import com.promptly.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${frontend.url}")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/brands")
    public ResponseEntity<Map<String, Object>> getBrands(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean is_active,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        
        List<BrandDto> brands = adminService.getBrands(category, is_active, limit, offset);
        long total = adminService.getBrandsCount(category, is_active);
        
        Map<String, Object> response = new HashMap<>();
        response.put("brands", brands);
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("total", total);
        pagination.put("limit", limit);
        pagination.put("offset", offset);
        response.put("pagination", pagination);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/brands/{brandId}")
    public ResponseEntity<Map<String, Object>> getBrandDetails(@PathVariable Integer brandId) {
        Map<String, Object> details = adminService.getBrandDetails(brandId);
        return ResponseEntity.ok(details);
    }

    @PostMapping("/brands")
    public ResponseEntity<Map<String, Object>> createBrand(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        
        Integer adminUserId = Integer.parseInt(authentication.getName());
        BrandDto brand = adminService.createBrand(
                request.get("name"),
                request.get("category"),
                adminUserId
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Brand created successfully");
        response.put("brand_id", brand.getId());
        
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/brands/{brandId}")
    public ResponseEntity<Map<String, String>> updateBrand(
            @PathVariable Integer brandId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        Integer adminUserId = Integer.parseInt(authentication.getName());
        adminService.updateBrand(
                brandId,
                (String) request.get("name"),
                (String) request.get("category"),
                request.get("is_active") != null ? (Boolean) request.get("is_active") : null,
                adminUserId
        );
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Brand updated successfully");
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/brands/{brandId}/status")
    public ResponseEntity<Map<String, String>> toggleBrandStatus(
            @PathVariable Integer brandId,
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {
        
        Integer adminUserId = Integer.parseInt(authentication.getName());
        adminService.toggleBrandStatus(brandId, request.get("is_active"), adminUserId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Brand status updated successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        
        List<AdminActivityLog> logs = adminService.getActivityLogs(limit, offset);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs);
        response.put("pagination", Map.of("total", logs.size(), "limit", limit, "offset", offset));
        
        return ResponseEntity.ok(response);
    }
}

