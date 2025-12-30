package com.promptly.repository;

import com.promptly.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("SELECT c FROM Comment c WHERE c.brandId = :brandId ORDER BY c.timestamp DESC")
    List<Comment> findByBrandIdOrderByTimestampDesc(@Param("brandId") Integer brandId);
    
    @Query("SELECT c FROM Comment c WHERE c.brandId = :brandId AND c.status = :status ORDER BY c.timestamp DESC")
    List<Comment> findByBrandIdAndStatus(@Param("brandId") Integer brandId, @Param("status") Comment.CommentStatus status);
    
    Optional<Comment> findByCommentId(String commentId);
    Optional<Comment> findByIdAndBrandId(Integer id, Integer brandId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.brandId = :brandId")
    Long countByBrandId(@Param("brandId") Integer brandId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.brandId = :brandId AND c.status = :status")
    Long countByBrandIdAndStatus(@Param("brandId") Integer brandId, @Param("status") Comment.CommentStatus status);
}

