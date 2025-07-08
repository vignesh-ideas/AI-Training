package com.hms.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.notification.entity.NotificationType;
import com.hms.notification.entity.NotificationPriority;
import com.hms.notification.entity.NotificationStatus;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private NotificationStatus status;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String relatedEntityType;
    private Long relatedEntityId;
} 