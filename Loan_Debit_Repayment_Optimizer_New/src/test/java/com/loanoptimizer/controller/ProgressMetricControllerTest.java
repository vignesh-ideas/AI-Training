package com.loanoptimizer.controller;

import com.loanoptimizer.dto.ProgressMetricResponse;
import com.loanoptimizer.service.ProgressMetricService;
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
import java.time.LocalDateTime;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ProgressMetricController.class)
public class ProgressMetricControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ProgressMetricService progressMetricService;

    private ProgressMetricResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new ProgressMetricResponse();
        sampleResponse.setId(1L);
        sampleResponse.setMetricType("score");
        sampleResponse.setValue(new BigDecimal("50"));
        sampleResponse.setRecordedAt(LocalDateTime.now());
        sampleResponse.setNotes("Test");
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void testGetMetricsEndpoint() throws Exception {
        Mockito.when(progressMetricService.getMetrics(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(sampleResponse));
        mockMvc.perform(get("/api/progress-metrics")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].metricType").value("score"));
    }
} 