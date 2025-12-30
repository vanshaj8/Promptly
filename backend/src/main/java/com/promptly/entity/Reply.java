package com.promptly.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "replies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "comment_id", nullable = false)
    private Integer commentId;

    @Column(name = "brand_id", nullable = false)
    private Integer brandId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "reply_id", nullable = false, unique = true)
    private String replyId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", insertable = false, updatable = false)
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", insertable = false, updatable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
    }
}

