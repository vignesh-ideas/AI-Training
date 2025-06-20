package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.domain.Debt;
import com.loanoptimizer.domain.PaymentSchedule;
import com.loanoptimizer.domain.RepaymentPlan;
import com.loanoptimizer.dto.RepaymentPlanRequest;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.repository.DebtRepository;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import com.loanoptimizer.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PaymentScheduleControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private PaymentScheduleRepository scheduleRepository;
    @Autowired
    private RepaymentPlanRepository planRepository;
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private UserRepository userRepository;

    private String jwtToken;
    private Long planId;
    private Long debtId;

    @BeforeEach
    void setUp() throws Exception {
        scheduleRepository.deleteAll();
        planRepository.deleteAll();
        debtRepository.deleteAll();
        userRepository.deleteAll();
        // Register and login to get JWT
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setName("Schedule User");
        req.setEmail("scheduleuser@example.com");
        req.setPassword("Password123");
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\": \"scheduleuser@example.com\"," +
                        "\"password\": \"Password123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("token").asText();
        // Fetch the registered user
        com.loanoptimizer.domain.User user = userRepository.findByEmail("scheduleuser@example.com").orElseThrow();
        // Create a plan and debt
        RepaymentPlan plan = new RepaymentPlan();
        plan.setUser(user);
        plan.setStrategyType("avalanche");
        plan.setStartDate(LocalDate.now());
        plan.setStatus("active");
        plan = planRepository.save(plan);
        planId = plan.getId();
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
        // Create a payment schedule
        PaymentSchedule schedule = new PaymentSchedule();
        schedule.setPlan(plan);
        schedule.setDebt(debt);
        schedule.setPaymentDate(LocalDate.now().plusDays(10));
        schedule.setPaymentAmount(100.0);
        schedule.setPrincipalAmount(80.0);
        schedule.setInterestAmount(20.0);
        schedule.setStatus("scheduled");
        scheduleRepository.save(schedule);
    }

    @Test
    void getSchedules_Success() throws Exception {
        mockMvc.perform(get("/api/repayment-plans/" + planId + "/payment-schedules")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].paymentAmount").value(100.0));
    }

    @Test
    void getSchedules_NotFound() throws Exception {
        mockMvc.perform(get("/api/repayment-plans/9999/payment-schedules")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }
} 