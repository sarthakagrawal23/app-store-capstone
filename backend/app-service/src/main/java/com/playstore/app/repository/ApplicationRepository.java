package com.playstore.app.repository;

import com.playstore.app.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByVisibleTrue();
    List<Application> findByOwnerId(Long ownerId);
    List<Application> findByCategoryIdAndVisibleTrue(Long categoryId);
    List<Application> findByNameContainingIgnoreCaseAndVisibleTrue(String name);
    List<Application> findByRatingGreaterThanEqualAndVisibleTrue(double minRating);
    List<Application> findByVisibleTrueOrderByDownloadCountDesc();
    List<Application> findByVisibleTrueOrderByRatingDesc();
}
