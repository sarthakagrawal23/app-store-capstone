package com.playstore.review.service;

import com.playstore.review.dto.ReviewDTOs.ReviewRequest;
import com.playstore.review.entity.Review;
import com.playstore.review.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

//    public Review addReview(Long appId, Long userId, ReviewRequest req) {
//        Review review = new Review();
//        review.setAppId(appId);
//        review.setUserId(userId);
//        review.setUserName(req.getUserName());
//        review.setUserEmail(req.getUserEmail());
//        review.setComment(req.getComment());
//        review.setRating(req.getRating());
//        return reviewRepository.save(review);
//    }
public Review addReview(Long appId, Long userId, ReviewRequest req) {
    // Check if user already reviewed this app
    boolean alreadyReviewed = reviewRepository
            .existsByAppIdAndUserId(appId, userId);

    if (alreadyReviewed) {
        throw new RuntimeException("You have already reviewed this app");
    }

    Review review = new Review();
    review.setAppId(appId);
    review.setUserId(userId);
    review.setUserName(req.getUserName());
    review.setUserEmail(req.getUserEmail());
    review.setComment(req.getComment());
    review.setRating(req.getRating());
    return reviewRepository.save(review);
}

    public List<Review> getReviewsByApp(Long appId) {
        return reviewRepository.findByAppIdOrderByCreatedAtDesc(appId);
    }

    public double getAverageRating(Long appId) {
        Double avg = reviewRepository.findAvgRatingByAppId(appId);
        if (avg == null) return 0.0;
        return Math.round(avg * 10.0) / 10.0;
    }

    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUserId().equals(userId))
            throw new RuntimeException("Not authorized to delete this review");
        reviewRepository.delete(review);
    }

    public long countByApp(Long appId) {
        return reviewRepository.countByAppId(appId);
    }
}
