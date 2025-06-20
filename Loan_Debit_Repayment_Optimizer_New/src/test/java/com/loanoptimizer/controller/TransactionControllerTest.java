package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.domain.Debt;
import com.loanoptimizer.dto.TransactionRequest;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.TransactionRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class TransactionControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentScheduleRepository paymentScheduleRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private RepaymentPlanRepository planRepository;

    private String jwtToken;
    private Long debtId;

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
        req.setName("Tx User");
        req.setEmail("txuser@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"txuser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("token").asText();
        // Fetch the registered user
        com.loanoptimizer.domain.User user = userRepository.findByEmail("txuser@example.com").orElseThrow();
        // Create a debt
        Debt debt = new Debt();
        debt.setUser(user);
        debt.setType("credit card");
        debt.setBalance(1000.0);
        debt.setApr(12.5);
        debt.setMinPayment(50.0);
        debt.setDueDate(LocalDate.now().plusDays(30));
        debt.setStatus("active");
        debt = debtRepository.save(debt);
        debtId = debt.getId();
    }

    TransactionRequest sampleTx() {
        TransactionRequest req = new TransactionRequest();
        req.setDebtId(debtId);
        req.setTransactionDate(LocalDate.now());
        req.setAmount(100.0);
        req.setTransactionType("payment");
        req.setDescription("Test payment");
        return req;
    }

    @Test
    void createTransaction_Success() throws Exception {
        TransactionRequest req = sampleTx();
        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.amount").value(100.0));
    }

    @Test
    void createTransaction_ValidationError() throws Exception {
        TransactionRequest req = sampleTx();
        req.setTransactionType(""); // NotBlank
        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listTransactions_Success() throws Exception {
        TransactionRequest req = sampleTx();
        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/transactions")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].amount").value(100.0));
    }

    @Test
    void listTransactions_FilterByDebt() throws Exception {
        TransactionRequest req = sampleTx();
        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/transactions?debt_id=" + debtId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].debtId").value(debtId));
    }

    @Test
    void createTransaction_Forbidden() throws Exception {
        // Register/login as another user
        UserRegistrationRequest req2 = new UserRegistrationRequest();
        req2.setName("Other User");
        req2.setEmail("otheruser3@example.com");
        req2.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isCreated());
        MvcResult login2 = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"otheruser3@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String token2 = objectMapper.readTree(login2.getResponse().getContentAsString()).get("token").asText();
        TransactionRequest req = sampleTx();
        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + token2)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
} 