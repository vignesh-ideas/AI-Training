package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.dto.UserLoginRequest;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.NotificationRepository;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.annotation.Rollback;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentScheduleRepository paymentScheduleRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private RepaymentPlanRepository planRepository;

    @BeforeEach
    void setUp() {
        paymentScheduleRepository.deleteAll();
        transactionRepository.deleteAll();
        notificationRepository.deleteAll();
        debtRepository.deleteAll();
        planRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void registerUser_Success() throws Exception {
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");
        req.setPassword("Password123");
        req.setPhone("1234567890");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void registerUser_DuplicateEmail() throws Exception {
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");
        req.setPassword("Password123");
        com.loanoptimizer.domain.User user = new com.loanoptimizer.domain.User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashed");
        userRepository.save(user);
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    void registerUser_InvalidEmail() throws Exception {
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Test User");
        req.setEmail("not-an-email");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_Success() throws Exception {
        // Register first
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        // Login
        UserLoginRequest loginReq = new UserLoginRequest();
        loginReq.setEmail("test@example.com");
        loginReq.setPassword("Password123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void login_InvalidCredentials() throws Exception {
        UserLoginRequest loginReq = new UserLoginRequest();
        loginReq.setEmail("notfound@example.com");
        loginReq.setPassword("wrongpass");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());
    }
} 