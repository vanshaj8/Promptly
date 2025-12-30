package com.promptly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Integer id;
    private String commentId;
    private String mediaId;
    private String parentId;
    private String text;
    private String username;
    private String userId;
    private LocalDateTime timestamp;
    private Integer likeCount;
    private String status;
    private String accountUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

