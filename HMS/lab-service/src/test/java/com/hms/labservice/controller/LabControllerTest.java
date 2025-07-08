package com.hms.labservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.labservice.dto.LabTestRequest;
import com.hms.labservice.dto.LabTestResponse;
import com.hms.labservice.entity.LabTestStatus;
import com.hms.labservice.entity.LabTestType;
import com.hms.labservice.exception.LabTestNotFoundException;
import com.hms.labservice.service.LabService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LabController.class)
class LabControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LabService labService;

    @Autowired
    private ObjectMapper objectMapper;

    private LabTestResponse labTestResponse;
    private LabTestRequest labTestRequest;

    @BeforeEach
    void setUp() {
        labTestResponse = new LabTestResponse();
        labTestResponse.setId(1L);
        labTestResponse.setPatientId(1L);
        labTestResponse.setTestType(LabTestType.BLOOD_TEST);
        labTestResponse.setTestName("Complete Blood Count");
        labTestResponse.setDescription("Routine blood test");
        labTestResponse.setStatus(LabTestStatus.PENDING);
        labTestResponse.setOrderedAt(LocalDateTime.now());

        labTestRequest = new LabTestRequest();
        labTestRequest.setPatientId(1L);
        labTestRequest.setTestType(LabTestType.BLOOD_TEST);
        labTestRequest.setTestName("Complete Blood Count");
        labTestRequest.setDescription("Routine blood test");
    }

    @Test
    void testCreateLabTest_Success() throws Exception {
        when(labService.createLabTest(any(LabTestRequest.class))).thenReturn(labTestResponse);

        mockMvc.perform(post("/api/lab-tests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labTestRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.testName").value("Complete Blood Count"));

        verify(labService, times(1)).createLabTest(any(LabTestRequest.class));
    }

    @Test
    void testCreateLabTest_ValidationError() throws Exception {
        labTestRequest.setTestName(""); // Invalid data

        mockMvc.perform(post("/api/lab-tests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labTestRequest)))
                .andExpect(status().isBadRequest());

        verify(labService, never()).createLabTest(any(LabTestRequest.class));
    }

    @Test
    void testGetLabTestById_Success() throws Exception {
        when(labService.getLabTestById(1L)).thenReturn(labTestResponse);

        mockMvc.perform(get("/api/lab-tests/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientId").value(1));

        verify(labService, times(1)).getLabTestById(1L);
    }

    @Test
    void testGetLabTestById_NotFound() throws Exception {
        when(labService.getLabTestById(1L)).thenThrow(new LabTestNotFoundException("Lab test not found"));

        mockMvc.perform(get("/api/lab-tests/1"))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).getLabTestById(1L);
    }

    @Test
    void testGetLabTestsByPatientId_Success() throws Exception {
        List<LabTestResponse> responses = Arrays.asList(labTestResponse);
        when(labService.getLabTestsByPatientId(1L)).thenReturn(responses);

        mockMvc.perform(get("/api/lab-tests/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].patientId").value(1));

        verify(labService, times(1)).getLabTestsByPatientId(1L);
    }

    @Test
    void testUpdateLabTest_Success() throws Exception {
        when(labService.updateLabTest(eq(1L), any(LabTestRequest.class))).thenReturn(labTestResponse);

        mockMvc.perform(put("/api/lab-tests/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labTestRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(labService, times(1)).updateLabTest(eq(1L), any(LabTestRequest.class));
    }

    @Test
    void testUpdateLabTest_NotFound() throws Exception {
        when(labService.updateLabTest(eq(1L), any(LabTestRequest.class)))
                .thenThrow(new LabTestNotFoundException("Lab test not found"));

        mockMvc.perform(put("/api/lab-tests/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labTestRequest)))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).updateLabTest(eq(1L), any(LabTestRequest.class));
    }

    @Test
    void testDeleteLabTest_Success() throws Exception {
        doNothing().when(labService).deleteLabTest(1L);

        mockMvc.perform(delete("/api/lab-tests/1"))
                .andExpect(status().isNoContent());

        verify(labService, times(1)).deleteLabTest(1L);
    }

    @Test
    void testDeleteLabTest_NotFound() throws Exception {
        doThrow(new LabTestNotFoundException("Lab test not found")).when(labService).deleteLabTest(1L);

        mockMvc.perform(delete("/api/lab-tests/1"))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).deleteLabTest(1L);
    }

    @Test
    void testGetAllLabTests_Success() throws Exception {
        List<LabTestResponse> responses = Arrays.asList(labTestResponse);
        when(labService.getAllLabTests()).thenReturn(responses);

        mockMvc.perform(get("/api/lab-tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(labService, times(1)).getAllLabTests();
    }

    @Test
    void testGetLabTestsByStatus_Success() throws Exception {
        List<LabTestResponse> responses = Arrays.asList(labTestResponse);
        when(labService.getLabTestsByStatus(LabTestStatus.PENDING)).thenReturn(responses);

        mockMvc.perform(get("/api/lab-tests/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(labService, times(1)).getLabTestsByStatus(LabTestStatus.PENDING);
    }
} 