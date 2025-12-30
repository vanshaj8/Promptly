package com.promptly.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "instagram_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstagramAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "brand_id", nullable = false)
    private Integer brandId;

    @Column(name = "instagram_business_account_id", nullable = false, unique = true)
    private String instagramBusinessAccountId;

    @Column(name = "facebook_page_id", nullable = false)
    private String facebookPageId;

    @Column(name = "page_access_token", nullable = false, columnDefinition = "TEXT")
    private String pageAccessToken;

    private String username;

    @Column(name = "profile_picture_url", columnDefinition = "TEXT")
    private String profilePictureUrl;

    @Column(name = "is_connected", nullable = false)
    private Boolean isConnected = true;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", insertable = false, updatable = false)
    private Brand brand;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

