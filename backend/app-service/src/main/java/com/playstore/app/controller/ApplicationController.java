package com.playstore.app.controller;

import com.playstore.app.dto.AppDTOs.*;
import com.playstore.app.entity.Application;
import com.playstore.app.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // ─── Public ───────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Application>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(applicationService.getAll(search, categoryId, minRating, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(id));
    }

    // ─── Authenticated ────────────────────────────────────────────────────────

    @GetMapping("/owner/my")
    public ResponseEntity<List<Application>> myApps(Authentication auth) {
        Long ownerId = extractUserId(auth);
        return ResponseEntity.ok(applicationService.getByOwner(ownerId));
    }

    @PostMapping
    public ResponseEntity<Application> create(@Valid @RequestBody AppRequest body, Authentication auth) {
        return ResponseEntity.ok(applicationService.create(body, extractUserId(auth)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> update(@PathVariable Long id,
                                               @RequestBody AppUpdateRequest body,
                                               Authentication auth) {
        return ResponseEntity.ok(applicationService.update(id, body, extractUserId(auth)));
    }

    @PatchMapping("/{id}/toggle-visibility")
    public ResponseEntity<Void> toggleVisibility(@PathVariable Long id, Authentication auth) {
        applicationService.toggleVisibility(id, extractUserId(auth));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        applicationService.delete(id, extractUserId(auth));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<Void> incrementDownload(@PathVariable Long id) {
        applicationService.incrementDownload(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<Void> updateRating(@PathVariable Long id, @RequestBody RatingUpdateRequest req) {
        applicationService.updateRating(id, req.getAverageRating());
        return ResponseEntity.ok().build();
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private Long extractUserId(Authentication auth) {
        Object credentials = auth.getCredentials();
        if (credentials instanceof Long) return (Long) credentials;
        return (long) auth.getName().hashCode();
    }
}
