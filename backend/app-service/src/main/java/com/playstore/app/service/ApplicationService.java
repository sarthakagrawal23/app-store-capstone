package com.playstore.app.service;

import com.playstore.app.dto.AppDTOs.*;
import com.playstore.app.entity.Application;
import com.playstore.app.entity.Category;
import com.playstore.app.repository.ApplicationRepository;
import com.playstore.app.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired private ApplicationRepository appRepo;
    @Autowired private CategoryRepository catRepo;

    public List<Application> getAll(String search, Long categoryId, Double minRating, String sort) {
        if (search != null && !search.isBlank())
            return appRepo.findByNameContainingIgnoreCaseAndVisibleTrue(search);
        if (categoryId != null)
            return appRepo.findByCategoryIdAndVisibleTrue(categoryId);
        if (minRating != null)
            return appRepo.findByRatingGreaterThanEqualAndVisibleTrue(minRating);
        if ("rating".equalsIgnoreCase(sort))
            return appRepo.findByVisibleTrueOrderByRatingDesc();
        if ("downloads".equalsIgnoreCase(sort))
            return appRepo.findByVisibleTrueOrderByDownloadCountDesc();
        return appRepo.findByVisibleTrue();
    }

    public Application getById(Long id) {
        return appRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }

    public List<Application> getByOwner(Long ownerId) {
        return appRepo.findByOwnerId(ownerId);
    }

    public Application create(AppRequest req, Long ownerId) {
        Category category = catRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Application app = new Application();
        app.setName(req.getName());
        app.setDescription(req.getDescription());
        app.setVersion(req.getVersion());
        app.setGenre(req.getGenre());
        app.setFileSize(req.getFileSize());
        app.setIconEmoji(req.getIconEmoji() != null ? req.getIconEmoji() : "🚀");
        app.setReleaseDate(req.getReleaseDate() != null ? req.getReleaseDate() : LocalDate.now());
        app.setOwnerId(ownerId);
        app.setCategory(category);

        return appRepo.save(app);
    }

    public Application update(Long id, AppUpdateRequest req, Long ownerId) {
        Application app = getById(id);
        if (!app.getOwnerId().equals(ownerId))
            throw new RuntimeException("You are not authorized to update this app");

        if (req.getName() != null) app.setName(req.getName());
        if (req.getDescription() != null) app.setDescription(req.getDescription());
        if (req.getVersion() != null) app.setVersion(req.getVersion());
        if (req.getGenre() != null) app.setGenre(req.getGenre());
        if (req.getFileSize() != null) app.setFileSize(req.getFileSize());
        if (req.getIconEmoji() != null) app.setIconEmoji(req.getIconEmoji());
        if (req.getReleaseDate() != null) app.setReleaseDate(req.getReleaseDate());
        if (req.getCategoryId() != null) {
            catRepo.findById(req.getCategoryId()).ifPresent(app::setCategory);
        }

        return appRepo.save(app);
    }

    public void toggleVisibility(Long id, Long ownerId) {
        Application app = getById(id);
        if (!app.getOwnerId().equals(ownerId))
            throw new RuntimeException("Not authorized");
        app.setVisible(!app.isVisible());
        appRepo.save(app);
    }

    public void delete(Long id, Long ownerId) {
        Application app = getById(id);
        if (!app.getOwnerId().equals(ownerId))
            throw new RuntimeException("Not authorized");
        appRepo.delete(app);
    }

    public void incrementDownload(Long id) {
        Application app = getById(id);
        app.setDownloadCount(app.getDownloadCount() + 1);
        appRepo.save(app);
    }

    public void updateRating(Long id, double avg) {
        Application app = getById(id);
        app.setRating(Math.round(avg * 10.0) / 10.0);
        appRepo.save(app);
    }
}
