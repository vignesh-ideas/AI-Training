package com.loanoptimizer.service;

import com.loanoptimizer.domain.ProgressMetric;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.ProgressMetricResponse;
import com.loanoptimizer.repository.ProgressMetricRepository;
import com.loanoptimizer.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProgressMetricServiceTest {
    @Mock
    private ProgressMetricRepository progressMetricRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private ProgressMetricService progressMetricService;

    private User user;
    private ProgressMetric metric1, metric2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setNotificationSettings("{}");
        metric1 = new ProgressMetric();
        metric1.setId(100L);
        metric1.setUser(user);
        metric1.setMetricType("score");
        metric1.setValue(new BigDecimal("50"));
        metric1.setRecordedAt(LocalDateTime.now().minusDays(1));
        metric2 = new ProgressMetric();
        metric2.setId(101L);
        metric2.setUser(user);
        metric2.setMetricType("score");
        metric2.setValue(new BigDecimal("60"));
        metric2.setRecordedAt(LocalDateTime.now());
        // Mock SecurityContextHolder
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn("user@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void testGetMetrics_FilterByUserAndType() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(progressMetricRepository.findAll()).thenReturn(Arrays.asList(metric1, metric2));
        List<ProgressMetricResponse> result = progressMetricService.getMetrics("score", null, null);
        assertEquals(2, result.size());
        assertEquals("score", result.get(0).getMetricType());
    }

    @Test
    void testGetMetrics_FilterByDateRange() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(progressMetricRepository.findAll()).thenReturn(Arrays.asList(metric1, metric2));
        LocalDateTime from = LocalDateTime.now().minusHours(12);
        List<ProgressMetricResponse> result = progressMetricService.getMetrics(null, from, null);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getRecordedAt().isAfter(from));
    }

    @Test
    void testGetMetrics_UserNotFound() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            progressMetricService.getMetrics(null, null, null)
        );
        assertTrue(ex.getMessage().contains("User not found"));
    }
} 