package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.dto.DebtRequest;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.NotificationRepository;
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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class DebtControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentScheduleRepository paymentScheduleRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private RepaymentPlanRepository planRepository;

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
        req.setName("Debt User");
        req.setEmail("debtuser@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"debtuser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("token").asText();
    }

    DebtRequest sampleDebt() {
        DebtRequest req = new DebtRequest();
        req.setType("credit card");
        req.setLenderName("Bank");
        req.setLenderContact("1234567890");
        req.setBalance(1000.0);
        req.setApr(12.5);
        req.setMinPayment(50.0);
        req.setDueDate(LocalDate.now().plusDays(30));
        req.setLoanTermMonths(12);
        req.setSecured(false);
        req.setStatus("active");
        return req;
    }

    @Test
    void createDebt_Success() throws Exception {
        DebtRequest req = sampleDebt();
        mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.type").value("credit card"));
    }

    @Test
    void createDebt_ValidationError() throws Exception {
        DebtRequest req = sampleDebt();
        req.setType(""); // NotBlank
        mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listDebts_Success() throws Exception {
        DebtRequest req = sampleDebt();
        mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/debts")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("credit card"));
    }

    @Test
    void getDebt_Success() throws Exception {
        DebtRequest req = sampleDebt();
        MvcResult result = mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        mockMvc.perform(get("/api/debts/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void updateDebt_Success() throws Exception {
        DebtRequest req = sampleDebt();
        MvcResult result = mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        req.setType("personal loan");
        mockMvc.perform(put("/api/debts/" + id)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("personal loan"));
    }

    @Test
    void deleteDebt_Success() throws Exception {
        DebtRequest req = sampleDebt();
        MvcResult result = mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        mockMvc.perform(delete("/api/debts/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void getDebt_NotFound() throws Exception {
        mockMvc.perform(get("/api/debts/9999")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateDebt_Forbidden() throws Exception {
        // Create debt as user1
        DebtRequest req = sampleDebt();
        MvcResult result = mockMvc.perform(post("/api/debts")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        // Register/login as user2
        UserRegistrationRequest req2 = new UserRegistrationRequest();
        req2.setName("Other User");
        req2.setEmail("otheruser@example.com");
        req2.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isCreated());
        MvcResult login2 = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"otheruser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String token2 = objectMapper.readTree(login2.getResponse().getContentAsString()).get("token").asText();
        // Try to update debt as user2
        req.setType("forbidden");
        mockMvc.perform(put("/api/debts/" + id)
                .header("Authorization", "Bearer " + token2)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
} 