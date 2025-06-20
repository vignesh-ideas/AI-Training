package com.loanoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.dto.SimulationRequest;
import com.loanoptimizer.dto.SimulationResult;
import com.loanoptimizer.dto.SimulationStrategy;
import com.loanoptimizer.service.SimulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(SimulationController.class)
public class SimulationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private SimulationService simulationService;
    @Autowired
    private ObjectMapper objectMapper;

    private SimulationRequest sampleRequest;
    private SimulationResult sampleResult;

    @BeforeEach
    void setUp() {
        sampleRequest = new SimulationRequest();
        sampleRequest.setUserId(1L);
        SimulationRequest.DebtInput debt = new SimulationRequest.DebtInput();
        debt.setDebtId(10L);
        debt.setName("Test Debt");
        debt.setPrincipal(new BigDecimal("1000"));
        debt.setInterestRate(new BigDecimal("0.10"));
        debt.setMinPayment(new BigDecimal("50"));
        sampleRequest.setDebts(Collections.singletonList(debt));
        sampleRequest.setMonthlyIncome(new BigDecimal("500"));
        sampleRequest.setStrategy(SimulationStrategy.AVALANCHE);
        sampleResult = new SimulationResult();
    }

    @Test
    @WithMockUser
    void testRunSimulationEndpoint() throws Exception {
        Mockito.when(simulationService.runSimulation(Mockito.any())).thenReturn(sampleResult);
        mockMvc.perform(post("/api/simulations/run")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());
    }
} 