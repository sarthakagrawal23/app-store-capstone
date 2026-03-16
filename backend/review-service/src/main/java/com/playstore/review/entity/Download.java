package com.playstore.review.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "downloads", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"app_id", "user_id"})
})
@Data
@NoArgsConstructor
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_id", nullable = false)
    private Long appId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "app_name")
    private String appName;

    @Column(name = "downloaded_at", updatable = false)
    private LocalDateTime downloadedAt = LocalDateTime.now();
}
