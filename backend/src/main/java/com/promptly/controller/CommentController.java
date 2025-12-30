package com.promptly.controller;

import com.promptly.dto.CommentDto;
import com.promptly.dto.ReplyDto;
import com.promptly.dto.ReplyRequest;
import com.promptly.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "${frontend.url}")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getComments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset,
            Authentication authentication) {
        
        Integer brandId = getBrandId(authentication);
        List<CommentDto> comments = commentService.getComments(brandId, status, limit, offset);
        long total = commentService.getCommentsCount(brandId, status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("total", total);
        pagination.put("limit", limit);
        pagination.put("offset", offset);
        response.put("pagination", pagination);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> getComment(
            @PathVariable Integer commentId,
            Authentication authentication) {
        
        Integer brandId = getBrandId(authentication);
        CommentDto comment = commentService.getComment(commentId, brandId);
        List<ReplyDto> replies = commentService.getReplies(commentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("comment", comment);
        response.put("replies", replies);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<Map<String, Object>> replyToComment(
            @PathVariable Integer commentId,
            @Valid @RequestBody ReplyRequest request,
            Authentication authentication) {
        
        Integer brandId = getBrandId(authentication);
        Integer userId = Integer.parseInt(authentication.getName());
        
        String replyId = commentService.replyToComment(commentId, brandId, userId, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Reply sent successfully");
        response.put("reply_id", replyId);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncComments(Authentication authentication) {
        Integer brandId = getBrandId(authentication);
        int commentsAdded = commentService.syncComments(brandId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sync completed");
        response.put("comments_added", commentsAdded);
        
        return ResponseEntity.ok(response);
    }

    private Integer getBrandId(Authentication authentication) {
        if (authentication != null && authentication.getDetails() != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (Integer) details.get("brandId");
        }
        throw new RuntimeException("Brand ID not found in authentication");
    }
}

