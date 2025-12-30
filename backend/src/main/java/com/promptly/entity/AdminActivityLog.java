package com.promptly.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "admin_user_id", nullable = false)
    private Integer adminUserId;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;

    @Column(name = "target_id")
    private Integer targetId;

    @Column(columnDefinition = "JSON")
    private String details;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id", insertable = false, updatable = false)
    private User adminUser;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

