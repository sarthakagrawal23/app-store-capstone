package com.playstore.review.service;

import com.playstore.review.entity.Download;
import com.playstore.review.repository.DownloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DownloadService {

    @Autowired
    private DownloadRepository downloadRepository;

    public Download recordDownload(Long appId, Long userId, String appName) {
        if (downloadRepository.existsByAppIdAndUserId(appId, userId)) {
            return downloadRepository.findByUserIdOrderByDownloadedAtDesc(userId)
                    .stream().filter(d -> d.getAppId().equals(appId))
                    .findFirst().orElseThrow();
        }
        Download download = new Download();
        download.setAppId(appId);
        download.setUserId(userId);
        download.setAppName(appName);
        return downloadRepository.save(download);
    }

    public List<Download> getUserDownloads(Long userId) {
        return downloadRepository.findByUserIdOrderByDownloadedAtDesc(userId);
    }

    public boolean hasDownloaded(Long appId, Long userId) {
        return downloadRepository.existsByAppIdAndUserId(appId, userId);
    }

    public long getDownloadCount(Long appId) {
        return downloadRepository.countByAppId(appId);
    }
}
