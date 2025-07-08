package com.hms.vitalsservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.vitalsservice.dto.VitalsRequest;
import com.hms.vitalsservice.dto.VitalsResponse;
import com.hms.vitalsservice.entity.Vitals;
import com.hms.vitalsservice.entity.VitalsStatus;
import com.hms.vitalsservice.exception.VitalsNotFoundException;
import com.hms.vitalsservice.service.VitalsService;
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

@WebMvcTest(VitalsController.class)
class VitalsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VitalsService vitalsService;

    @Autowired
    private ObjectMapper objectMapper;

    private VitalsResponse vitalsResponse;
    private VitalsRequest vitalsRequest;

    @BeforeEach
    void setUp() {
        vitalsResponse = new VitalsResponse();
        vitalsResponse.setId(1L);
        vitalsResponse.setPatientId(1L);
        vitalsResponse.setBloodPressure("120/80");
        vitalsResponse.setHeartRate(75);
        vitalsResponse.setTemperature(98.6);
        vitalsResponse.setWeight(70.5);
        vitalsResponse.setHeight(175.0);
        vitalsResponse.setStatus(VitalsStatus.NORMAL);
        vitalsResponse.setRecordedAt(LocalDateTime.now());

        vitalsRequest = new VitalsRequest();
        vitalsRequest.setPatientId(1L);
        vitalsRequest.setBloodPressure("120/80");
        vitalsRequest.setHeartRate(75);
        vitalsRequest.setTemperature(98.6);
        vitalsRequest.setWeight(70.5);
        vitalsRequest.setHeight(175.0);
    }

    @Test
    void testCreateVitals_Success() throws Exception {
        when(vitalsService.createVitals(any(VitalsRequest.class))).thenReturn(vitalsResponse);

        mockMvc.perform(post("/api/vitals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vitalsRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.bloodPressure").value("120/80"));

        verify(vitalsService, times(1)).createVitals(any(VitalsRequest.class));
    }

    @Test
    void testCreateVitals_ValidationError() throws Exception {
        vitalsRequest.setBloodPressure(""); // Invalid data

        mockMvc.perform(post("/api/vitals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vitalsRequest)))
                .andExpect(status().isBadRequest());

        verify(vitalsService, never()).createVitals(any(VitalsRequest.class));
    }

    @Test
    void testGetVitalsById_Success() throws Exception {
        when(vitalsService.getVitalsById(1L)).thenReturn(vitalsResponse);

        mockMvc.perform(get("/api/vitals/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientId").value(1));

        verify(vitalsService, times(1)).getVitalsById(1L);
    }

    @Test
    void testGetVitalsById_NotFound() throws Exception {
        when(vitalsService.getVitalsById(1L)).thenThrow(new VitalsNotFoundException("Vitals not found"));

        mockMvc.perform(get("/api/vitals/1"))
                .andExpect(status().isNotFound());

        verify(vitalsService, times(1)).getVitalsById(1L);
    }

    @Test
    void testGetVitalsByPatientId_Success() throws Exception {
        List<VitalsResponse> responses = Arrays.asList(vitalsResponse);
        when(vitalsService.getVitalsByPatientId(1L)).thenReturn(responses);

        mockMvc.perform(get("/api/vitals/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].patientId").value(1));

        verify(vitalsService, times(1)).getVitalsByPatientId(1L);
    }

    @Test
    void testUpdateVitals_Success() throws Exception {
        when(vitalsService.updateVitals(eq(1L), any(VitalsRequest.class))).thenReturn(vitalsResponse);

        mockMvc.perform(put("/api/vitals/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vitalsRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(vitalsService, times(1)).updateVitals(eq(1L), any(VitalsRequest.class));
    }

    @Test
    void testUpdateVitals_NotFound() throws Exception {
        when(vitalsService.updateVitals(eq(1L), any(VitalsRequest.class)))
                .thenThrow(new VitalsNotFoundException("Vitals not found"));

        mockMvc.perform(put("/api/vitals/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vitalsRequest)))
                .andExpect(status().isNotFound());

        verify(vitalsService, times(1)).updateVitals(eq(1L), any(VitalsRequest.class));
    }

    @Test
    void testDeleteVitals_Success() throws Exception {
        doNothing().when(vitalsService).deleteVitals(1L);

        mockMvc.perform(delete("/api/vitals/1"))
                .andExpect(status().isNoContent());

        verify(vitalsService, times(1)).deleteVitals(1L);
    }

    @Test
    void testDeleteVitals_NotFound() throws Exception {
        doThrow(new VitalsNotFoundException("Vitals not found")).when(vitalsService).deleteVitals(1L);

        mockMvc.perform(delete("/api/vitals/1"))
                .andExpect(status().isNotFound());

        verify(vitalsService, times(1)).deleteVitals(1L);
    }

    @Test
    void testGetAllVitals_Success() throws Exception {
        List<VitalsResponse> responses = Arrays.asList(vitalsResponse);
        when(vitalsService.getAllVitals()).thenReturn(responses);

        mockMvc.perform(get("/api/vitals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(vitalsService, times(1)).getAllVitals();
    }
} 