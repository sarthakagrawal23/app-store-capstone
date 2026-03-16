package com.playstore.review.controller;

import com.playstore.review.dto.ReviewDTOs.ReviewRequest;
import com.playstore.review.entity.Review;
import com.playstore.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/app/{appId}")
    public ResponseEntity<List<Review>> getByApp(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.getReviewsByApp(appId));
    }

    @GetMapping("/app/{appId}/avg")
    public ResponseEntity<Double> getAvg(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.getAverageRating(appId));
    }

    @GetMapping("/app/{appId}/count")
    public ResponseEntity<Long> getCount(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.countByApp(appId));
    }

    @PostMapping("/app/{appId}")
    public ResponseEntity<Review> addReview(@PathVariable Long appId,
                                             @Valid @RequestBody ReviewRequest req,
                                             Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(reviewService.addReview(appId, userId, req));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId, Authentication auth) {
        reviewService.deleteReview(reviewId, extractUserId(auth));
        return ResponseEntity.noContent().build();
    }

    private Long extractUserId(Authentication auth) {
        Object cred = auth.getCredentials();
        if (cred instanceof Long) return (Long) cred;
        return (long) Math.abs(auth.getName().hashCode());
    }
}
