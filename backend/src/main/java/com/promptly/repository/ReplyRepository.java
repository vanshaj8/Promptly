package com.promptly.repository;

import com.promptly.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    List<Reply> findByCommentIdOrderBySentAtDesc(Integer commentId);
    Optional<Reply> findByReplyId(String replyId);
    List<Reply> findByBrandId(Integer brandId);
}

