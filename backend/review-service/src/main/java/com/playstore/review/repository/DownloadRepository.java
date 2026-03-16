package com.playstore.review.repository;

import com.playstore.review.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUserIdOrderByDownloadedAtDesc(Long userId);
    List<Download> findByAppId(Long appId);
    boolean existsByAppIdAndUserId(Long appId, Long userId);
    long countByAppId(Long appId);
}
