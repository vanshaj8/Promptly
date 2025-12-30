package com.promptly.repository;

import com.promptly.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    List<Brand> findByCategory(String category);
    List<Brand> findByIsActive(Boolean isActive);
    List<Brand> findByCategoryAndIsActive(String category, Boolean isActive);
    Optional<Brand> findByIdAndIsActive(Integer id, Boolean isActive);
    
    long countByCategory(String category);
    long countByIsActive(Boolean isActive);
    long countByCategoryAndIsActive(String category, Boolean isActive);
}

