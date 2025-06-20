package com.loanoptimizer.controller;

import com.loanoptimizer.dto.NotificationResponse;
import com.loanoptimizer.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@Validated
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> listNotifications(@RequestParam(value = "status", required = false) String status) {
        List<NotificationResponse> notifications = notificationService.listNotifications(Optional.ofNullable(status));
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        NotificationResponse resp = notificationService.markAsRead(id);
        return ResponseEntity.ok(resp);
    }
} 