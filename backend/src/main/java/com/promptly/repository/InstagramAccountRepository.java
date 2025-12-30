package com.promptly.repository;

import com.promptly.entity.InstagramAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InstagramAccountRepository extends JpaRepository<InstagramAccount, Integer> {
    Optional<InstagramAccount> findByBrandIdAndIsConnected(Integer brandId, Boolean isConnected);
    Optional<InstagramAccount> findByInstagramBusinessAccountId(String instagramBusinessAccountId);
    List<InstagramAccount> findByBrandId(Integer brandId);
}

