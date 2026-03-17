package com.playstore.review.repository;

import com.playstore.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAppIdOrderByCreatedAtDesc(Long appId);
    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.appId = :appId")
    Double findAvgRatingByAppId(@Param("appId") Long appId);

    long countByAppId(Long appId);
    boolean existsByAppIdAndUserId(Long appId, Long userId);
}
