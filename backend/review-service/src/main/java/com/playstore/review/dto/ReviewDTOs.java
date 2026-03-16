package com.playstore.review.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class ReviewDTOs {

    @Data
    public static class ReviewRequest {
        @NotBlank(message = "Comment is required")
        @Size(min = 5, message = "Comment must be at least 5 characters")
        private String comment;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        private Integer rating;

        private String userName;
        private String userEmail;
    }

    @Data
    public static class DownloadRequest {
        @NotBlank(message = "App name is required")
        private String appName;
    }

    @Data
    public static class ErrorResponse {
        private String message;
        private int status;

        public ErrorResponse(String message, int status) {
            this.message = message;
            this.status = status;
        }
    }
}
