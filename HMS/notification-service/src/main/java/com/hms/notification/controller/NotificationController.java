package com.hms.notification.controller;

import com.hms.notification.dto.NotificationRequest;
import com.hms.notification.dto.NotificationResponse;
import com.hms.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable Long id) {
        NotificationResponse response = notificationService.getNotificationById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByUserId(
            @PathVariable Long userId, Pageable pageable) {
        Page<NotificationResponse> notifications = notificationService.getNotificationsByUserId(userId, pageable);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<NotificationResponse> notifications = notificationService.getUnreadNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        NotificationResponse response = notificationService.markAsRead(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/archive")
    public ResponseEntity<NotificationResponse> markAsArchived(@PathVariable Long id) {
        NotificationResponse response = notificationService.markAsArchived(id);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCountByUserId(@PathVariable Long userId) {
        Long count = notificationService.getUnreadCountByUserId(userId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/related/{entityType}/{entityId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByRelatedEntity(
            @PathVariable String entityType, @PathVariable Long entityId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByRelatedEntity(entityType, entityId);
        return ResponseEntity.ok(notifications);
    }
    
    @PostMapping("/cleanup")
    public ResponseEntity<Void> cleanupOldNotifications(@RequestParam(defaultValue = "30") int daysToKeep) {
        notificationService.cleanupOldNotifications(daysToKeep);
        return ResponseEntity.ok().build();
    }
} 