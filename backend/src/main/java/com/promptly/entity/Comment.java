package com.promptly.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "brand_id", nullable = false)
    private Integer brandId;

    @Column(name = "instagram_account_id", nullable = false)
    private Integer instagramAccountId;

    @Column(name = "comment_id", nullable = false, unique = true)
    private String commentId;

    @Column(name = "media_id")
    private String mediaId;

    @Column(name = "parent_id")
    private String parentId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(nullable = false)
    private String username;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommentStatus status = CommentStatus.OPEN;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", insertable = false, updatable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instagram_account_id", insertable = false, updatable = false)
    private InstagramAccount instagramAccount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum CommentStatus {
        OPEN, REPLIED, HIDDEN
    }
}

