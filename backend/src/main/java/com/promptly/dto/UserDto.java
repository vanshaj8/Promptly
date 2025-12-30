package com.promptly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Integer id;
    private String email;
    private String role;
    private Integer brandId;
    private String fullName;
    private LocalDateTime createdAt;
}

