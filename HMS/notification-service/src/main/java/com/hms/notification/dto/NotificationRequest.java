package com.hms.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import com.hms.notification.entity.NotificationType;
import com.hms.notification.entity.NotificationPriority;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @NotNull(message = "Notification type is required")
    private NotificationType type;
    
    private NotificationPriority priority = NotificationPriority.MEDIUM;
    
    private String relatedEntityType;
    
    private Long relatedEntityId;
} 