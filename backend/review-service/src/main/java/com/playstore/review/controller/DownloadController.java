package com.playstore.review.controller;

import com.playstore.review.entity.Download;
import com.playstore.review.service.DownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/downloads")
@CrossOrigin(origins = "*")
public class DownloadController {

    @Autowired
    private DownloadService downloadService;

    @PostMapping("/app/{appId}")
    public ResponseEntity<Download> recordDownload(@PathVariable Long appId,
                                                    @RequestParam String appName,
                                                    Authentication auth) {
        Long userId = extractUserId(auth);
        return ResponseEntity.ok(downloadService.recordDownload(appId, userId, appName));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Download>> myDownloads(Authentication auth) {
        return ResponseEntity.ok(downloadService.getUserDownloads(extractUserId(auth)));
    }

    @GetMapping("/check/{appId}")
    public ResponseEntity<Boolean> checkDownloaded(@PathVariable Long appId, Authentication auth) {
        return ResponseEntity.ok(downloadService.hasDownloaded(appId, extractUserId(auth)));
    }

    @GetMapping("/count/{appId}")
    public ResponseEntity<Long> getCount(@PathVariable Long appId) {
        return ResponseEntity.ok(downloadService.getDownloadCount(appId));
    }

    private Long extractUserId(Authentication auth) {
        Object cred = auth.getCredentials();
        if (cred instanceof Long) return (Long) cred;
        return (long) Math.abs(auth.getName().hashCode());
    }
}
