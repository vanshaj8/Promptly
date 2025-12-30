package com.promptly.service;

import com.promptly.dto.CommentDto;
import com.promptly.dto.ReplyDto;
import com.promptly.dto.ReplyRequest;
import com.promptly.entity.Comment;
import com.promptly.entity.InstagramAccount;
import com.promptly.entity.Reply;
import com.promptly.entity.User;
import com.promptly.repository.CommentRepository;
import com.promptly.repository.InstagramAccountRepository;
import com.promptly.repository.ReplyRepository;
import com.promptly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private InstagramAccountRepository instagramAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    public List<CommentDto> getComments(Integer brandId, String status, int limit, int offset) {
        List<Comment> comments;

        if (status != null && (status.equals("OPEN") || status.equals("REPLIED") || status.equals("HIDDEN"))) {
            Comment.CommentStatus commentStatus = Comment.CommentStatus.valueOf(status);
            comments = commentRepository.findByBrandIdAndStatus(brandId, commentStatus);
        } else {
            comments = commentRepository.findByBrandIdOrderByTimestampDesc(brandId);
        }

        // Apply pagination
        if (offset >= comments.size()) {
            return List.of();
        }
        
        int start = offset;
        int end = Math.min(start + limit, comments.size());
        comments = comments.subList(start, end);

        return comments.stream().map(this::toDto).collect(Collectors.toList());
    }
    
    public long getCommentsCount(Integer brandId, String status) {
        if (status != null && (status.equals("OPEN") || status.equals("REPLIED") || status.equals("HIDDEN"))) {
            Comment.CommentStatus commentStatus = Comment.CommentStatus.valueOf(status);
            return commentRepository.countByBrandIdAndStatus(brandId, commentStatus);
        } else {
            return commentRepository.countByBrandId(brandId);
        }
    }

    public CommentDto getComment(Integer commentId, Integer brandId) {
        Comment comment = commentRepository.findByIdAndBrandId(commentId, brandId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return toDto(comment);
    }

    public List<ReplyDto> getReplies(Integer commentId) {
        List<Reply> replies = replyRepository.findByCommentIdOrderBySentAtDesc(commentId);
        return replies.stream().map(this::toReplyDto).collect(Collectors.toList());
    }

    @Transactional
    public String replyToComment(Integer commentId, Integer brandId, Integer userId, ReplyRequest request) {
        Comment comment = commentRepository.findByIdAndBrandId(commentId, brandId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        InstagramAccount account = instagramAccountRepository.findById(comment.getInstagramAccountId())
                .orElseThrow(() -> new RuntimeException("Instagram account not found"));

        // Send reply via Instagram Graph API
        String replyId = sendReplyToInstagram(comment.getCommentId(), request.getText(), account.getPageAccessToken());

        // Save reply to database
        Reply reply = new Reply();
        reply.setCommentId(commentId);
        reply.setBrandId(brandId);
        reply.setUserId(userId);
        reply.setReplyId(replyId);
        reply.setText(request.getText());
        replyRepository.save(reply);

        // Update comment status
        comment.setStatus(Comment.CommentStatus.REPLIED);
        commentRepository.save(comment);

        return replyId;
    }

    private String sendReplyToInstagram(String commentId, String text, String accessToken) {
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        Map<String, String> body = new HashMap<>();
        body.put("message", text);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/{commentId}/replies")
                        .queryParam("access_token", accessToken)
                        .build(commentId))
                .bodyValue(body)
                .header("Content-Type", "application/json")
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response != null && response.containsKey("id")) {
            return (String) response.get("id");
        }
        
        throw new RuntimeException("Failed to send reply to Instagram");
    }

    @Transactional
    public int syncComments(Integer brandId) {
        InstagramAccount account = instagramAccountRepository.findByBrandIdAndIsConnected(brandId, true)
                .orElseThrow(() -> new RuntimeException("No Instagram account connected"));

        int commentsAdded = 0;
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        try {
            // Get media (posts) for the Instagram account
            @SuppressWarnings("unchecked")
            Map<String, Object> mediaResponse = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{accountId}/media")
                            .queryParam("access_token", account.getPageAccessToken())
                            .queryParam("fields", "id")
                            .build(account.getInstagramBusinessAccountId()))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (mediaResponse != null && mediaResponse.containsKey("data")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> mediaList = (List<Map<String, Object>>) mediaResponse.get("data");

                // Fetch comments for each media
                for (Map<String, Object> media : mediaList) {
                    String mediaId = (String) media.get("id");
                    commentsAdded += fetchCommentsForMedia(mediaId, account);
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the entire sync
            System.err.println("Error syncing comments: " + e.getMessage());
        }

        // Update last sync time
        account.setLastSyncAt(LocalDateTime.now());
        instagramAccountRepository.save(account);

        return commentsAdded;
    }

    @SuppressWarnings("unchecked")
    private int fetchCommentsForMedia(String mediaId, InstagramAccount account) {
        int commentsAdded = 0;
        WebClient webClient = webClientBuilder.baseUrl("https://graph.facebook.com/v18.0").build();

        try {
            Map<String, Object> commentsResponse = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{mediaId}/comments")
                            .queryParam("access_token", account.getPageAccessToken())
                            .queryParam("fields", "id,text,username,like_count,timestamp,from")
                            .build(mediaId))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (commentsResponse != null && commentsResponse.containsKey("data")) {
                List<Map<String, Object>> comments = (List<Map<String, Object>>) commentsResponse.get("data");

                for (Map<String, Object> commentData : comments) {
                    String commentId = (String) commentData.get("id");
                    
                    // Check if comment already exists
                    if (commentRepository.findByCommentId(commentId).isPresent()) {
                        continue;
                    }

                    Comment comment = new Comment();
                    comment.setBrandId(account.getBrandId());
                    comment.setInstagramAccountId(account.getId());
                    comment.setCommentId(commentId);
                    comment.setMediaId(mediaId);
                    comment.setText((String) commentData.get("text"));
                    comment.setLikeCount(((Number) commentData.getOrDefault("like_count", 0)).intValue());

                    // Parse from field
                    Map<String, Object> from = (Map<String, Object>) commentData.get("from");
                    if (from != null) {
                        comment.setUsername((String) from.get("username"));
                        comment.setUserId((String) from.get("id"));
                    }

                    // Parse timestamp - Instagram API returns ISO 8601 format
                    String timestampStr = (String) commentData.get("timestamp");
                    if (timestampStr != null) {
                        try {
                            // Remove timezone info and parse as LocalDateTime
                            // Format: "2024-01-15T10:30:00+0000" -> "2024-01-15T10:30:00"
                            String cleanTimestamp = timestampStr.replaceAll("[+-]\\d{4}$", "").replace("Z", "");
                            if (cleanTimestamp.contains("T")) {
                                comment.setTimestamp(LocalDateTime.parse(cleanTimestamp));
                            } else {
                                // Fallback: try parsing as-is
                                comment.setTimestamp(LocalDateTime.parse(cleanTimestamp));
                            }
                        } catch (DateTimeParseException e) {
                            // Fallback to current time if parsing fails
                            comment.setTimestamp(LocalDateTime.now());
                        }
                    } else {
                        comment.setTimestamp(LocalDateTime.now());
                    }

                    comment.setStatus(Comment.CommentStatus.OPEN);
                    commentRepository.save(comment);
                    commentsAdded++;
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching comments for media " + mediaId + ": " + e.getMessage());
        }

        return commentsAdded;
    }

    private CommentDto toDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setCommentId(comment.getCommentId());
        dto.setMediaId(comment.getMediaId());
        dto.setParentId(comment.getParentId());
        dto.setText(comment.getText());
        dto.setUsername(comment.getUsername());
        dto.setUserId(comment.getUserId());
        dto.setTimestamp(comment.getTimestamp());
        dto.setLikeCount(comment.getLikeCount());
        dto.setStatus(comment.getStatus().name());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());

        // Load account username if needed
        InstagramAccount account = instagramAccountRepository.findById(comment.getInstagramAccountId()).orElse(null);
        if (account != null) {
            dto.setAccountUsername(account.getUsername());
        }

        return dto;
    }

    private ReplyDto toReplyDto(Reply reply) {
        ReplyDto dto = new ReplyDto();
        dto.setId(reply.getId());
        dto.setReplyId(reply.getReplyId());
        dto.setText(reply.getText());
        dto.setSentAt(reply.getSentAt());

        User user = userRepository.findById(reply.getUserId()).orElse(null);
        if (user != null) {
            dto.setRepliedBy(user.getFullName());
        }

        return dto;
    }
}

