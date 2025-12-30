package com.promptly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstagramAccountDto {
    private Integer id;
    private String username;
    private String profilePictureUrl;
    private Boolean isConnected;
    private LocalDateTime lastSyncAt;
    private LocalDateTime createdAt;
}

