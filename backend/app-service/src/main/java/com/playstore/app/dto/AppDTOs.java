package com.playstore.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class AppDTOs {

    @Data
    public static class AppRequest {
        @NotBlank(message = "App name is required")
        private String name;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Version is required")
        private String version;

        @NotBlank(message = "Genre is required")
        private String genre;

        @NotBlank(message = "File size is required")
        private String fileSize;

        private String iconEmoji = "🚀";
        private LocalDate releaseDate;

        @NotNull(message = "Category is required")
        private Long categoryId;
    }

    @Data
    public static class AppUpdateRequest {
        private String name;
        private String description;
        private String version;
        private String genre;
        private String fileSize;
        private String iconEmoji;
        private LocalDate releaseDate;
        private Long categoryId;
    }

    @Data
    public static class RatingUpdateRequest {
        private double averageRating;
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
