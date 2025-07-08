package com.hms.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.notification.dto.NotificationRequest;
import com.hms.notification.dto.NotificationResponse;
import com.hms.notification.entity.NotificationType;
import com.hms.notification.entity.NotificationPriority;
import com.hms.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class NotificationServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private NotificationRequest notificationRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        notificationRequest = new NotificationRequest();
        notificationRequest.setUserId(1L);
        notificationRequest.setTitle("Appointment Reminder");
        notificationRequest.setMessage("Your appointment is scheduled for tomorrow at 10:00 AM");
        notificationRequest.setType(NotificationType.APPOINTMENT_REMINDER);
        notificationRequest.setPriority(NotificationPriority.MEDIUM);
        notificationRequest.setRelatedEntityType("APPOINTMENT");
        notificationRequest.setRelatedEntityId(123L);
    }

    @Test
    void createNotification_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.userId").value(1))
            .andExpect(jsonPath("$.title").value("Appointment Reminder"))
            .andExpect(jsonPath("$.type").value("APPOINTMENT_REMINDER"))
            .andExpect(jsonPath("$.status").value("UNREAD"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        NotificationResponse responseObj = objectMapper.readValue(response, NotificationResponse.class);
        assertTrue(notificationRepository.existsById(responseObj.getId()));
    }

    @Test
    void getNotificationById_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        String createResponse = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        NotificationResponse createdNotification = objectMapper.readValue(createResponse, NotificationResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/" + createdNotification.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdNotification.getId()))
            .andExpect(jsonPath("$.userId").value(1))
            .andExpect(jsonPath("$.title").value("Appointment Reminder"));
    }

    @Test
    void getNotificationsByUserId_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/notifications/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content[0].userId").value(1));
    }

    @Test
    void markAsRead_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        String createResponse = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        NotificationResponse createdNotification = objectMapper.readValue(createResponse, NotificationResponse.class);

        // Act & Assert
        mockMvc.perform(put("/api/notifications/" + createdNotification.getId() + "/read"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("READ"));
    }

    @Test
    void markAsArchived_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        String createResponse = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        NotificationResponse createdNotification = objectMapper.readValue(createResponse, NotificationResponse.class);

        // Act & Assert
        mockMvc.perform(put("/api/notifications/" + createdNotification.getId() + "/archive"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ARCHIVED"));
    }

    @Test
    void deleteNotification_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        String createResponse = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        NotificationResponse createdNotification = objectMapper.readValue(createResponse, NotificationResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/notifications/" + createdNotification.getId()))
            .andExpect(status().isNoContent());

        // Verify notification is deleted
        assertFalse(notificationRepository.existsById(createdNotification.getId()));
    }

    @Test
    void getNotificationById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/notifications/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createNotification_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        notificationRequest.setUserId(null);

        // Act & Assert
        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getUnreadCountByUserId_IntegrationTest() throws Exception {
        // Arrange - Create notification first
        mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/notifications/user/1/unread-count"))
            .andExpect(status().isOk())
            .andExpect(content().string("1"));
    }
} 