package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.domain.Notification;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.repository.NotificationRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class NotificationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentScheduleRepository paymentScheduleRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private RepaymentPlanRepository planRepository;

    private String jwtToken;
    private Long notificationId;

    @BeforeEach
    void setUp() throws Exception {
        paymentScheduleRepository.deleteAll();
        transactionRepository.deleteAll();
        notificationRepository.deleteAll();
        debtRepository.deleteAll();
        planRepository.deleteAll();
        userRepository.deleteAll();
        // Register and login to get JWT
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Notif User");
        req.setEmail("notifuser@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"notifuser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("token").asText();
        // Fetch the registered user
        com.loanoptimizer.domain.User user = userRepository.findByEmail("notifuser@example.com").orElseThrow();
        // Create a notification
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setType("reminder");
        notif.setMessage("Test notification");
        notif.setDeliveryMethod("email");
        notif.setStatus("sent");
        notif.setSentAt(LocalDateTime.now());
        notif.setCreatedAt(LocalDateTime.now());
        notif = notificationRepository.save(notif);
        notificationId = notif.getId();
    }

    @Test
    void listNotifications_Success() throws Exception {
        mockMvc.perform(get("/api/notifications")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("reminder"));
    }

    @Test
    void markAsRead_Success() throws Exception {
        mockMvc.perform(put("/api/notifications/" + notificationId + "/read")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("read"));
    }

    @Test
    void markAsRead_NotFound() throws Exception {
        mockMvc.perform(put("/api/notifications/9999/read")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }
} 