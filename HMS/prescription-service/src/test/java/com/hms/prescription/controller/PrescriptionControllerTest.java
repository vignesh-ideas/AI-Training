package com.hms.prescription.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.prescription.dto.PrescriptionRequest;
import com.hms.prescription.dto.PrescriptionResponse;
import com.hms.prescription.entity.PrescriptionStatus;
import com.hms.prescription.entity.MedicationRoute;
import com.hms.prescription.service.PrescriptionService;
import com.hms.prescription.exception.PrescriptionNotFoundException;
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

@WebMvcTest(PrescriptionController.class)
class PrescriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PrescriptionService prescriptionService;

    @Autowired
    private ObjectMapper objectMapper;

    private PrescriptionRequest prescriptionRequest;
    private PrescriptionResponse prescriptionResponse;

    @BeforeEach
    void setUp() {
        // Setup PrescriptionRequest
        prescriptionRequest = new PrescriptionRequest();
        prescriptionRequest.setPatientId(1L);
        prescriptionRequest.setDoctorId(2L);
        prescriptionRequest.setAppointmentId(3L);
        prescriptionRequest.setDiagnosis("Hypertension");
        prescriptionRequest.setNotes("Take medication as prescribed");
        prescriptionRequest.setValidUntil(LocalDateTime.now().plusDays(30));

        // Setup PrescriptionResponse
        prescriptionResponse = new PrescriptionResponse();
        prescriptionResponse.setId(1L);
        prescriptionResponse.setPatientId(1L);
        prescriptionResponse.setDoctorId(2L);
        prescriptionResponse.setAppointmentId(3L);
        prescriptionResponse.setDiagnosis("Hypertension");
        prescriptionResponse.setNotes("Take medication as prescribed");
        prescriptionResponse.setStatus(PrescriptionStatus.ACTIVE);
        prescriptionResponse.setPrescribedDate(LocalDateTime.now());
        prescriptionResponse.setValidUntil(LocalDateTime.now().plusDays(30));
        prescriptionResponse.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createPrescription_Success() throws Exception {
        // Arrange
        when(prescriptionService.createPrescription(any(PrescriptionRequest.class)))
            .thenReturn(prescriptionResponse);

        // Act & Assert
        mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"));

        verify(prescriptionService).createPrescription(any(PrescriptionRequest.class));
    }

    @Test
    void createPrescription_ValidationError() throws Exception {
        // Arrange
        prescriptionRequest.setPatientId(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andExpect(status().isBadRequest());

        verify(prescriptionService, never()).createPrescription(any());
    }

    @Test
    void getPrescriptionById_Success() throws Exception {
        // Arrange
        when(prescriptionService.getPrescriptionById(1L)).thenReturn(prescriptionResponse);

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2));

        verify(prescriptionService).getPrescriptionById(1L);
    }

    @Test
    void getPrescriptionById_NotFound() throws Exception {
        // Arrange
        when(prescriptionService.getPrescriptionById(999L))
            .thenThrow(new PrescriptionNotFoundException("Prescription not found"));

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/999"))
            .andExpect(status().isNotFound());

        verify(prescriptionService).getPrescriptionById(999L);
    }

    @Test
    void getPrescriptionsByPatientId_Success() throws Exception {
        // Arrange
        List<PrescriptionResponse> responses = Arrays.asList(prescriptionResponse);
        when(prescriptionService.getPrescriptionsByPatientId(1L)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].patientId").value(1));

        verify(prescriptionService).getPrescriptionsByPatientId(1L);
    }

    @Test
    void getPrescriptionsByDoctorId_Success() throws Exception {
        // Arrange
        List<PrescriptionResponse> responses = Arrays.asList(prescriptionResponse);
        when(prescriptionService.getPrescriptionsByDoctorId(2L)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/doctor/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].doctorId").value(2));

        verify(prescriptionService).getPrescriptionsByDoctorId(2L);
    }

    @Test
    void updatePrescriptionStatus_Success() throws Exception {
        // Arrange
        when(prescriptionService.updatePrescriptionStatus(eq(1L), eq(PrescriptionStatus.DISPENSED)))
            .thenReturn(prescriptionResponse);

        // Act & Assert
        mockMvc.perform(put("/api/prescriptions/1/status")
                .param("status", "DISPENSED"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(prescriptionService).updatePrescriptionStatus(1L, PrescriptionStatus.DISPENSED);
    }

    @Test
    void updatePrescriptionStatus_NotFound() throws Exception {
        // Arrange
        when(prescriptionService.updatePrescriptionStatus(eq(999L), eq(PrescriptionStatus.DISPENSED)))
            .thenThrow(new PrescriptionNotFoundException("Prescription not found"));

        // Act & Assert
        mockMvc.perform(put("/api/prescriptions/999/status")
                .param("status", "DISPENSED"))
            .andExpect(status().isNotFound());

        verify(prescriptionService).updatePrescriptionStatus(999L, PrescriptionStatus.DISPENSED);
    }

    @Test
    void deletePrescription_Success() throws Exception {
        // Arrange
        doNothing().when(prescriptionService).deletePrescription(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/prescriptions/1"))
            .andExpect(status().isNoContent());

        verify(prescriptionService).deletePrescription(1L);
    }

    @Test
    void deletePrescription_NotFound() throws Exception {
        // Arrange
        doThrow(new PrescriptionNotFoundException("Prescription not found"))
            .when(prescriptionService).deletePrescription(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/prescriptions/999"))
            .andExpect(status().isNotFound());

        verify(prescriptionService).deletePrescription(999L);
    }

    @Test
    void getExpiredPrescriptions_Success() throws Exception {
        // Arrange
        List<PrescriptionResponse> responses = Arrays.asList(prescriptionResponse);
        when(prescriptionService.getExpiredPrescriptions()).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/expired"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1));

        verify(prescriptionService).getExpiredPrescriptions();
    }
} 