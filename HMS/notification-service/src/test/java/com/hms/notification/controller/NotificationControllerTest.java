package com.hms.notification.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.notification.dto.NotificationRequest;
import com.hms.notification.dto.NotificationResponse;
import com.hms.notification.entity.NotificationType;
import com.hms.notification.entity.NotificationPriority;
import com.hms.notification.entity.NotificationStatus;
import com.hms.notification.service.NotificationService;
import com.hms.notification.exception.NotificationNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    private NotificationRequest notificationRequest;
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
    void createNotification_Success() throws Exception {
        // Arrange
        when(notificationService.createNotification(any(NotificationRequest.class)))
            .thenReturn(notificationResponse);

        // Act & Assert
        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.userId").value(1))
            .andExpect(jsonPath("$.title").value("Appointment Reminder"))
            .andExpect(jsonPath("$.type").value("APPOINTMENT_REMINDER"));

        verify(notificationService).createNotification(any(NotificationRequest.class));
    }

    @Test
    void createNotification_ValidationError() throws Exception {
        // Arrange
        notificationRequest.setUserId(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isBadRequest());

        verify(notificationService, never()).createNotification(any());
    }

    @Test
    void getNotificationById_Success() throws Exception {
        // Arrange
        when(notificationService.getNotificationById(1L)).thenReturn(notificationResponse);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.userId").value(1))
            .andExpect(jsonPath("$.title").value("Appointment Reminder"));

        verify(notificationService).getNotificationById(1L);
    }

    @Test
    void getNotificationById_NotFound() throws Exception {
        // Arrange
        when(notificationService.getNotificationById(999L))
            .thenThrow(new NotificationNotFoundException("Notification not found"));

        // Act & Assert
        mockMvc.perform(get("/api/notifications/999"))
            .andExpect(status().isNotFound());

        verify(notificationService).getNotificationById(999L);
    }

    @Test
    void getNotificationsByUserId_Success() throws Exception {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<NotificationResponse> notificationPage = new PageImpl<>(Arrays.asList(notificationResponse));
        when(notificationService.getNotificationsByUserId(1L, pageable)).thenReturn(notificationPage);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/user/1")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].id").value(1))
            .andExpect(jsonPath("$.content[0].userId").value(1));

        verify(notificationService).getNotificationsByUserId(1L, pageable);
    }

    @Test
    void getUnreadNotificationsByUserId_Success() throws Exception {
        // Arrange
        List<NotificationResponse> responses = Arrays.asList(notificationResponse);
        when(notificationService.getUnreadNotificationsByUserId(1L)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/user/1/unread"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].status").value("UNREAD"));

        verify(notificationService).getUnreadNotificationsByUserId(1L);
    }

    @Test
    void markAsRead_Success() throws Exception {
        // Arrange
        when(notificationService.markAsRead(1L)).thenReturn(notificationResponse);

        // Act & Assert
        mockMvc.perform(put("/api/notifications/1/read"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(notificationService).markAsRead(1L);
    }

    @Test
    void markAsRead_NotFound() throws Exception {
        // Arrange
        when(notificationService.markAsRead(999L))
            .thenThrow(new NotificationNotFoundException("Notification not found"));

        // Act & Assert
        mockMvc.perform(put("/api/notifications/999/read"))
            .andExpect(status().isNotFound());

        verify(notificationService).markAsRead(999L);
    }

    @Test
    void markAsArchived_Success() throws Exception {
        // Arrange
        when(notificationService.markAsArchived(1L)).thenReturn(notificationResponse);

        // Act & Assert
        mockMvc.perform(put("/api/notifications/1/archive"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(notificationService).markAsArchived(1L);
    }

    @Test
    void deleteNotification_Success() throws Exception {
        // Arrange
        doNothing().when(notificationService).deleteNotification(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/notifications/1"))
            .andExpect(status().isNoContent());

        verify(notificationService).deleteNotification(1L);
    }

    @Test
    void deleteNotification_NotFound() throws Exception {
        // Arrange
        doThrow(new NotificationNotFoundException("Notification not found"))
            .when(notificationService).deleteNotification(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/notifications/999"))
            .andExpect(status().isNotFound());

        verify(notificationService).deleteNotification(999L);
    }

    @Test
    void getUnreadCountByUserId_Success() throws Exception {
        // Arrange
        when(notificationService.getUnreadCountByUserId(1L)).thenReturn(5L);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/user/1/unread-count"))
            .andExpect(status().isOk())
            .andExpect(content().string("5"));

        verify(notificationService).getUnreadCountByUserId(1L);
    }

    @Test
    void getNotificationsByRelatedEntity_Success() throws Exception {
        // Arrange
        List<NotificationResponse> responses = Arrays.asList(notificationResponse);
        when(notificationService.getNotificationsByRelatedEntity("APPOINTMENT", 123L))
            .thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/related/APPOINTMENT/123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].relatedEntityType").value("APPOINTMENT"));

        verify(notificationService).getNotificationsByRelatedEntity("APPOINTMENT", 123L);
    }

    @Test
    void cleanupOldNotifications_Success() throws Exception {
        // Arrange
        doNothing().when(notificationService).cleanupOldNotifications(30);

        // Act & Assert
        mockMvc.perform(post("/api/notifications/cleanup")
                .param("daysToKeep", "30"))
            .andExpect(status().isOk());

        verify(notificationService).cleanupOldNotifications(30);
    }
} 