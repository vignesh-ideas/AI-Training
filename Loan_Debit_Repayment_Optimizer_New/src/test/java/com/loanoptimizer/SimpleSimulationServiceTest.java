package com.loanoptimizer;

import com.loanoptimizer.domain.Simulation;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.SimulationRequest;
import com.loanoptimizer.dto.SimulationStrategy;
import com.loanoptimizer.repository.SimulationRepository;
import com.loanoptimizer.repository.UserRepository;
import com.loanoptimizer.service.SimulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SimpleSimulationServiceTest {
    @Mock
    private SimulationRepository simulationRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private SimulationService simulationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        simulationService = new SimulationService(simulationRepository, userRepository);
    }

    @Test
    void testRunSimulation_AvalancheStrategy_Success() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setNotificationSettings("{}");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        SimulationRequest request = new SimulationRequest();
        request.setUserId(1L);
        SimulationRequest.DebtInput debt = new SimulationRequest.DebtInput();
        debt.setDebtId(10L);
        debt.setName("Test Debt");
        debt.setPrincipal(new BigDecimal("1000"));
        debt.setInterestRate(new BigDecimal("0.10"));
        debt.setMinPayment(new BigDecimal("50"));
        request.setDebts(Collections.singletonList(debt));
        request.setMonthlyIncome(new BigDecimal("500"));
        request.setStrategy(SimulationStrategy.AVALANCHE);
        // Act
        var result = simulationService.runSimulation(request);
        // Assert
        assertNotNull(result);
        verify(simulationRepository, times(1)).save(any(Simulation.class));
    }
} 