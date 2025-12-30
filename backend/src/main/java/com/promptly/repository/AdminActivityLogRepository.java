package com.promptly.repository;

import com.promptly.entity.AdminActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Integer> {
    List<AdminActivityLog> findByAdminUserIdOrderByCreatedAtDesc(Integer adminUserId);
}

