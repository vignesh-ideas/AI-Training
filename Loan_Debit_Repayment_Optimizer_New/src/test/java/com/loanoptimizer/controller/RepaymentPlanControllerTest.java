package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.dto.RepaymentPlanRequest;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.NotificationRepository;
import com.loanoptimizer.repository.DebtRepository;
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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class RepaymentPlanControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RepaymentPlanRepository planRepository;
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

    private String jwtToken;

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
        req.setName("Plan User");
        req.setEmail("planuser@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"planuser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("token").asText();
    }

    RepaymentPlanRequest samplePlan() {
        RepaymentPlanRequest req = new RepaymentPlanRequest();
        req.setStrategyType("avalanche");
        req.setStartDate(LocalDate.now());
        req.setTargetCompletion(LocalDate.now().plusMonths(12));
        req.setMonthlyBudget(1000.0);
        req.setStatus("active");
        return req;
    }

    @Test
    void createPlan_Success() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.strategyType").value("avalanche"));
    }

    @Test
    void createPlan_ValidationError() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        req.setStrategyType(""); // NotBlank
        mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listPlans_Success() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].strategyType").value("avalanche"));
    }

    @Test
    void getPlan_Success() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        MvcResult result = mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        mockMvc.perform(get("/api/repayment-plans/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void updatePlan_Success() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        MvcResult result = mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        req.setStrategyType("snowball");
        mockMvc.perform(put("/api/repayment-plans/" + id)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.strategyType").value("snowball"));
    }

    @Test
    void deletePlan_Success() throws Exception {
        RepaymentPlanRequest req = samplePlan();
        MvcResult result = mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        mockMvc.perform(delete("/api/repayment-plans/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void getPlan_NotFound() throws Exception {
        mockMvc.perform(get("/api/repayment-plans/9999")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updatePlan_Forbidden() throws Exception {
        // Create plan as user1
        RepaymentPlanRequest req = samplePlan();
        MvcResult result = mockMvc.perform(post("/api/repayment-plans")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        // Register/login as user2
        UserRegistrationRequest req2 = new UserRegistrationRequest();
        req2.setName("Other User");
        req2.setEmail("otheruser2@example.com");
        req2.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isCreated());
        MvcResult login2 = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"otheruser2@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String token2 = objectMapper.readTree(login2.getResponse().getContentAsString()).get("token").asText();
        // Try to update plan as user2
        req.setStrategyType("forbidden");
        mockMvc.perform(put("/api/repayment-plans/" + id)
                .header("Authorization", "Bearer " + token2)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
} 