package com.promptly.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptly.dto.BrandDto;
import com.promptly.entity.AdminActivityLog;
import com.promptly.entity.Brand;
import com.promptly.entity.Comment;
import com.promptly.entity.InstagramAccount;
import com.promptly.entity.User;
import com.promptly.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private InstagramAccountRepository instagramAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AdminActivityLogRepository activityLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<BrandDto> getBrands(String category, Boolean isActive, int limit, int offset) {
        List<Brand> brands;

        if (category != null && isActive != null) {
            brands = brandRepository.findByCategoryAndIsActive(category, isActive);
        } else if (category != null) {
            brands = brandRepository.findByCategory(category);
        } else if (isActive != null) {
            brands = brandRepository.findByIsActive(isActive);
        } else {
            brands = brandRepository.findAll();
        }

        // Apply pagination
        if (offset >= brands.size()) {
            return List.of();
        }
        
        int start = offset;
        int end = Math.min(start + limit, brands.size());
        brands = brands.subList(start, end);

        return brands.stream().map(this::toDto).collect(Collectors.toList());
    }
    
    public long getBrandsCount(String category, Boolean isActive) {
        if (category != null && isActive != null) {
            return brandRepository.countByCategoryAndIsActive(category, isActive);
        } else if (category != null) {
            return brandRepository.countByCategory(category);
        } else if (isActive != null) {
            return brandRepository.countByIsActive(isActive);
        } else {
            return brandRepository.count();
        }
    }

    public Map<String, Object> getBrandDetails(Integer brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        List<InstagramAccount> accounts = instagramAccountRepository.findByBrandId(brandId);
        List<User> users = userRepository.findAll().stream()
                .filter(u -> brandId.equals(u.getBrandId()))
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("total_comments", commentRepository.countByBrandId(brandId));
        stats.put("open_comments", commentRepository.countByBrandIdAndStatus(brandId, Comment.CommentStatus.OPEN));
        stats.put("replied_comments", commentRepository.countByBrandIdAndStatus(brandId, Comment.CommentStatus.REPLIED));

        Map<String, Object> result = new HashMap<>();
        result.put("brand", toDto(brand));
        result.put("instagram_accounts", accounts);
        result.put("users", users.stream().map(this::toUserDto).collect(Collectors.toList()));
        result.put("stats", stats);

        return result;
    }

    @Transactional
    public BrandDto createBrand(String name, String category, Integer adminUserId) {
        Brand brand = new Brand();
        brand.setName(name);
        brand.setCategory(category);
        brand.setIsActive(true);
        brand = brandRepository.save(brand);

        logActivity(adminUserId, "CREATE", "BRAND", brand.getId(), Map.of("name", name, "category", category));

        return toDto(brand);
    }

    @Transactional
    public BrandDto updateBrand(Integer brandId, String name, String category, Boolean isActive, Integer adminUserId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        if (name != null) brand.setName(name);
        if (category != null) brand.setCategory(category);
        if (isActive != null) brand.setIsActive(isActive);

        brand = brandRepository.save(brand);

        Map<String, Object> details = new HashMap<>();
        if (name != null) details.put("name", name);
        if (category != null) details.put("category", category);
        if (isActive != null) details.put("is_active", isActive);

        logActivity(adminUserId, "UPDATE", "BRAND", brandId, details);

        return toDto(brand);
    }

    @Transactional
    public void toggleBrandStatus(Integer brandId, Boolean isActive, Integer adminUserId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setIsActive(isActive);
        brandRepository.save(brand);

        logActivity(adminUserId, isActive ? "ENABLE" : "DISABLE", "BRAND", brandId, Map.of("is_active", isActive));
    }

    public List<AdminActivityLog> getActivityLogs(int limit, int offset) {
        return activityLogRepository.findAll();
    }

    private void logActivity(Integer adminUserId, String actionType, String targetType, Integer targetId, Map<String, Object> details) {
        AdminActivityLog log = new AdminActivityLog();
        log.setAdminUserId(adminUserId);
        log.setActionType(actionType);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        
        try {
            // Convert details map to JSON string
            log.setDetails(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            // Fallback to toString if JSON serialization fails
            log.setDetails(details.toString());
        }
        
        activityLogRepository.save(log);
    }

    private BrandDto toDto(Brand brand) {
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setCategory(brand.getCategory());
        dto.setIsActive(brand.getIsActive());
        dto.setCreatedAt(brand.getCreatedAt());
        dto.setUpdatedAt(brand.getUpdatedAt());
        return dto;
    }

    private Map<String, Object> toUserDto(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole().name());
        dto.put("full_name", user.getFullName());
        dto.put("created_at", user.getCreatedAt());
        return dto;
    }
}

