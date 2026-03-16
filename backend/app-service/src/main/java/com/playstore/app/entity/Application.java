package com.playstore.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String version = "1.0.0";
    private String genre;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "icon_emoji")
    private String iconEmoji = "🚀";

    @Column(name = "release_date")
    private LocalDate releaseDate;

    private double rating = 0.0;

    @Column(name = "download_count")
    private long downloadCount = 0;

    private boolean visible = true;

    @Column(name = "owner_id")
    private Long ownerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
