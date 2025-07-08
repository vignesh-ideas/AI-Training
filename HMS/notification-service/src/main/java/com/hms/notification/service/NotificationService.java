package com.hms.notification.service;

import com.hms.notification.dto.NotificationRequest;
import com.hms.notification.dto.NotificationResponse;
import com.hms.notification.entity.Notification;
import com.hms.notification.entity.NotificationStatus;
import com.hms.notification.exception.NotificationNotFoundException;
import com.hms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setPriority(request.getPriority());
        notification.setRelatedEntityType(request.getRelatedEntityType());
        notification.setRelatedEntityId(request.getRelatedEntityId());
        
        Notification savedNotification = notificationRepository.save(notification);
        return mapToResponse(savedNotification);
    }
    
    public NotificationResponse getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        return mapToResponse(notification);
    }
    
    public Page<NotificationResponse> getNotificationsByUserId(Long userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserId(userId, pageable);
        return notifications.map(this::mapToResponse);
    }
    
    public List<NotificationResponse> getUnreadNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndStatus(userId, NotificationStatus.UNREAD);
        return notifications.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        
        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        
        Notification updatedNotification = notificationRepository.save(notification);
        return mapToResponse(updatedNotification);
    }
    
    @Transactional
    public NotificationResponse markAsArchived(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        
        notification.setStatus(NotificationStatus.ARCHIVED);
        
        Notification updatedNotification = notificationRepository.save(notification);
        return mapToResponse(updatedNotification);
    }
    
    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new NotificationNotFoundException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
    }
    
    public Long getUnreadCountByUserId(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }
    
    public List<NotificationResponse> getNotificationsByRelatedEntity(String entityType, Long entityId) {
        List<Notification> notifications = notificationRepository.findByRelatedEntity(entityType, entityId);
        return notifications.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void cleanupOldNotifications(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        List<Notification> oldNotifications = notificationRepository.findOldNotifications(
            NotificationStatus.READ, cutoffDate);
        notificationRepository.deleteAll(oldNotifications);
    }
    
    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setUserId(notification.getUserId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setPriority(notification.getPriority());
        response.setStatus(notification.getStatus());
        response.setReadAt(notification.getReadAt());
        response.setCreatedAt(notification.getCreatedAt());
        response.setUpdatedAt(notification.getUpdatedAt());
        response.setRelatedEntityType(notification.getRelatedEntityType());
        response.setRelatedEntityId(notification.getRelatedEntityId());
        return response;
    }
} 