package com.promptly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyDto {
    private Integer id;
    private String replyId;
    private String text;
    private LocalDateTime sentAt;
    private String repliedBy;
}

