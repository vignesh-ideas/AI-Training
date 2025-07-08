package com.hms.notification.service;

import com.hms.notification.dto.NotificationRequest;
import com.hms.notification.dto.NotificationResponse;
import com.hms.notification.entity.Notification;
import com.hms.notification.entity.NotificationType;
import com.hms.notification.entity.NotificationPriority;
import com.hms.notification.entity.NotificationStatus;
import com.hms.notification.exception.NotificationNotFoundException;
import com.hms.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private NotificationRequest notificationRequest;
    private Notification notification;
    private NotificationResponse notificationResponse;

    @BeforeEach
    void setUp() {
        // Setup NotificationRequest
        notificationRequest = new NotificationRequest();
        notificationRequest.setUserId(1L);
        notificationRequest.setTitle("Appointment Reminder");
        notificationRequest.setMessage("Your appointment is scheduled for tomorrow at 10:00 AM");
        notificationRequest.setType(NotificationType.APPOINTMENT_REMINDER);
        notificationRequest.setPriority(NotificationPriority.MEDIUM);
        notificationRequest.setRelatedEntityType("APPOINTMENT");
        notificationRequest.setRelatedEntityId(123L);

        // Setup Notification entity
        notification = new Notification();
        notification.setId(1L);
        notification.setUserId(1L);
        notification.setTitle("Appointment Reminder");
        notification.setMessage("Your appointment is scheduled for tomorrow at 10:00 AM");
        notification.setType(NotificationType.APPOINTMENT_REMINDER);
        notification.setPriority(NotificationPriority.MEDIUM);
        notification.setStatus(NotificationStatus.UNREAD);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRelatedEntityType("APPOINTMENT");
        notification.setRelatedEntityId(123L);

        // Setup NotificationResponse
        notificationResponse = new NotificationResponse();
        notificationResponse.setId(1L);
        notificationResponse.setUserId(1L);
        notificationResponse.setTitle("Appointment Reminder");
        notificationResponse.setMessage("Your appointment is scheduled for tomorrow at 10:00 AM");
        notificationResponse.setType(NotificationType.APPOINTMENT_REMINDER);
        notificationResponse.setPriority(NotificationPriority.MEDIUM);
        notificationResponse.setStatus(NotificationStatus.UNREAD);
        notificationResponse.setCreatedAt(LocalDateTime.now());
        notificationResponse.setRelatedEntityType("APPOINTMENT");
        notificationResponse.setRelatedEntityId(123L);
    }

    @Test
    void createNotification_Success() {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        NotificationResponse response = notificationService.createNotification(notificationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals("Appointment Reminder", response.getTitle());
        assertEquals(NotificationType.APPOINTMENT_REMINDER, response.getType());
        assertEquals(NotificationStatus.UNREAD, response.getStatus());

        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void getNotificationById_Success() {
        // Arrange
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        // Act
        NotificationResponse response = notificationService.getNotificationById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals("Appointment Reminder", response.getTitle());

        verify(notificationRepository).findById(1L);
    }

    @Test
    void getNotificationById_NotFound() {
        // Arrange
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotificationNotFoundException.class, () -> {
            notificationService.getNotificationById(999L);
        });

        verify(notificationRepository).findById(999L);
    }

    @Test
    void getNotificationsByUserId_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Notification> notificationPage = new PageImpl<>(Arrays.asList(notification));
        when(notificationRepository.findByUserId(1L, pageable)).thenReturn(notificationPage);

        // Act
        Page<NotificationResponse> response = notificationService.getNotificationsByUserId(1L, pageable);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1L, response.getContent().get(0).getId());

        verify(notificationRepository).findByUserId(1L, pageable);
    }

    @Test
    void getUnreadNotificationsByUserId_Success() {
        // Arrange
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findByUserIdAndStatus(1L, NotificationStatus.UNREAD))
            .thenReturn(notifications);

        // Act
        List<NotificationResponse> responses = notificationService.getUnreadNotificationsByUserId(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());
        assertEquals(NotificationStatus.UNREAD, responses.get(0).getStatus());

        verify(notificationRepository).findByUserIdAndStatus(1L, NotificationStatus.UNREAD);
    }

    @Test
    void markAsRead_Success() {
        // Arrange
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        NotificationResponse response = notificationService.markAsRead(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(NotificationStatus.READ, response.getStatus());
        assertNotNull(response.getReadAt());

        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void markAsRead_NotFound() {
        // Arrange
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotificationNotFoundException.class, () -> {
            notificationService.markAsRead(999L);
        });

        verify(notificationRepository).findById(999L);
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void markAsArchived_Success() {
        // Arrange
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        NotificationResponse response = notificationService.markAsArchived(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(NotificationStatus.ARCHIVED, response.getStatus());

        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void deleteNotification_Success() {
        // Arrange
        when(notificationRepository.existsById(1L)).thenReturn(true);

        // Act
        notificationService.deleteNotification(1L);

        // Assert
        verify(notificationRepository).existsById(1L);
        verify(notificationRepository).deleteById(1L);
    }

    @Test
    void deleteNotification_NotFound() {
        // Arrange
        when(notificationRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(NotificationNotFoundException.class, () -> {
            notificationService.deleteNotification(999L);
        });

        verify(notificationRepository).existsById(999L);
        verify(notificationRepository, never()).deleteById(any());
    }

    @Test
    void getUnreadCountByUserId_Success() {
        // Arrange
        when(notificationRepository.countByUserIdAndStatus(1L, NotificationStatus.UNREAD))
            .thenReturn(5L);

        // Act
        Long count = notificationService.getUnreadCountByUserId(1L);

        // Assert
        assertEquals(5L, count);

        verify(notificationRepository).countByUserIdAndStatus(1L, NotificationStatus.UNREAD);
    }

    @Test
    void getNotificationsByRelatedEntity_Success() {
        // Arrange
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findByRelatedEntity("APPOINTMENT", 123L))
            .thenReturn(notifications);

        // Act
        List<NotificationResponse> responses = notificationService.getNotificationsByRelatedEntity("APPOINTMENT", 123L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(notificationRepository).findByRelatedEntity("APPOINTMENT", 123L);
    }

    @Test
    void cleanupOldNotifications_Success() {
        // Arrange
        List<Notification> oldNotifications = Arrays.asList(notification);
        when(notificationRepository.findOldNotifications(NotificationStatus.READ, any(LocalDateTime.class)))
            .thenReturn(oldNotifications);

        // Act
        notificationService.cleanupOldNotifications(30);

        // Assert
        verify(notificationRepository).findOldNotifications(NotificationStatus.READ, any(LocalDateTime.class));
        verify(notificationRepository).deleteAll(oldNotifications);
    }
} 