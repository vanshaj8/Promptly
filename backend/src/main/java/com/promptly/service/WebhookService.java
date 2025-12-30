package com.promptly.service;

import com.promptly.entity.Comment;
import com.promptly.entity.InstagramAccount;
import com.promptly.repository.CommentRepository;
import com.promptly.repository.InstagramAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class WebhookService {

    @Autowired
    private InstagramAccountRepository instagramAccountRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Transactional
    @SuppressWarnings("unchecked")
    public void processWebhook(Map<String, Object> payload) {
        List<Map<String, Object>> entries = (List<Map<String, Object>>) payload.get("entry");
        
        if (entries == null) return;

        for (Map<String, Object> entry : entries) {
            String instagramAccountId = (String) entry.get("id");
            
            InstagramAccount account = instagramAccountRepository
                    .findByInstagramBusinessAccountId(instagramAccountId)
                    .orElse(null);

            if (account == null || !account.getIsConnected()) {
                continue;
            }

            // Process comments
            @SuppressWarnings("unchecked")
            Map<String, Object> comments = (Map<String, Object>) entry.get("comments");
            if (comments != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> commentData = (List<Map<String, Object>>) comments.get("data");
                if (commentData != null) {
                    for (Map<String, Object> commentDataItem : commentData) {
                        processComment(commentDataItem, account);
                    }
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void processComment(Map<String, Object> commentData, InstagramAccount account) {
        String commentId = (String) commentData.get("id");
        
        // Check if comment already exists
        if (commentRepository.findByCommentId(commentId).isPresent()) {
            return;
        }

        Comment comment = new Comment();
        comment.setBrandId(account.getBrandId());
        comment.setInstagramAccountId(account.getId());
        comment.setCommentId(commentId);
        comment.setMediaId((String) commentData.get("media_id"));
        comment.setParentId((String) commentData.get("parent_id"));
        comment.setText((String) commentData.get("text"));
        
        Map<String, Object> from = (Map<String, Object>) commentData.get("from");
        if (from != null) {
            comment.setUsername((String) from.get("username"));
            comment.setUserId((String) from.get("id"));
        }
        
        comment.setTimestamp(LocalDateTime.now()); // Parse from timestamp if available
        comment.setLikeCount(((Number) commentData.getOrDefault("like_count", 0)).intValue());
        comment.setStatus(Comment.CommentStatus.OPEN);

        commentRepository.save(comment);
    }
}

