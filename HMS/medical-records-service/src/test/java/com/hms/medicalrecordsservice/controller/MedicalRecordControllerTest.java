package com.hms.medicalrecordsservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.medicalrecordsservice.dto.MedicalRecordRequest;
import com.hms.medicalrecordsservice.dto.MedicalRecordResponse;
import com.hms.medicalrecordsservice.entity.RecordType;
import com.hms.medicalrecordsservice.service.MedicalRecordService;
import com.hms.medicalrecordsservice.exception.MedicalRecordNotFoundException;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MedicalRecordController.class)
class MedicalRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MedicalRecordService medicalRecordService;

    @Autowired
    private ObjectMapper objectMapper;

    private MedicalRecordRequest recordRequest;
    private MedicalRecordResponse recordResponse;

    @BeforeEach
    void setUp() {
        // Setup MedicalRecordRequest
        recordRequest = new MedicalRecordRequest();
        recordRequest.setPatientId(1L);
        recordRequest.setDoctorId(2L);
        recordRequest.setRecordType(RecordType.CONSULTATION);
        recordRequest.setDiagnosis("Hypertension");
        recordRequest.setSymptoms("High blood pressure, headache");
        recordRequest.setTreatment("Prescribed medication");
        recordRequest.setNotes("Patient needs regular monitoring");
        recordRequest.setVitalSigns("BP: 140/90, HR: 80");

        // Setup MedicalRecordResponse
        recordResponse = new MedicalRecordResponse();
        recordResponse.setId(1L);
        recordResponse.setPatientId(1L);
        recordResponse.setDoctorId(2L);
        recordResponse.setRecordType(RecordType.CONSULTATION);
        recordResponse.setDiagnosis("Hypertension");
        recordResponse.setSymptoms("High blood pressure, headache");
        recordResponse.setTreatment("Prescribed medication");
        recordResponse.setNotes("Patient needs regular monitoring");
        recordResponse.setVitalSigns("BP: 140/90, HR: 80");
        recordResponse.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createMedicalRecord_Success() throws Exception {
        // Arrange
        when(medicalRecordService.createMedicalRecord(any(MedicalRecordRequest.class)))
            .thenReturn(recordResponse);

        // Act & Assert
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.recordType").value("CONSULTATION"))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"));

        verify(medicalRecordService).createMedicalRecord(any(MedicalRecordRequest.class));
    }

    @Test
    void createMedicalRecord_ValidationError() throws Exception {
        // Arrange
        recordRequest.setPatientId(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isBadRequest());

        verify(medicalRecordService, never()).createMedicalRecord(any());
    }

    @Test
    void getMedicalRecordById_Success() throws Exception {
        // Arrange
        when(medicalRecordService.getMedicalRecordById(1L)).thenReturn(recordResponse);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"));

        verify(medicalRecordService).getMedicalRecordById(1L);
    }

    @Test
    void getMedicalRecordById_NotFound() throws Exception {
        // Arrange
        when(medicalRecordService.getMedicalRecordById(999L))
            .thenThrow(new MedicalRecordNotFoundException("Medical record not found"));

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/999"))
            .andExpect(status().isNotFound());

        verify(medicalRecordService).getMedicalRecordById(999L);
    }

    @Test
    void getMedicalRecordsByPatientId_Success() throws Exception {
        // Arrange
        List<MedicalRecordResponse> records = Arrays.asList(recordResponse);
        when(medicalRecordService.getMedicalRecordsByPatientId(1L)).thenReturn(records);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].patientId").value(1));

        verify(medicalRecordService).getMedicalRecordsByPatientId(1L);
    }

    @Test
    void getMedicalRecordsByDoctorId_Success() throws Exception {
        // Arrange
        List<MedicalRecordResponse> records = Arrays.asList(recordResponse);
        when(medicalRecordService.getMedicalRecordsByDoctorId(2L)).thenReturn(records);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/doctor/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].doctorId").value(2));

        verify(medicalRecordService).getMedicalRecordsByDoctorId(2L);
    }

    @Test
    void getMedicalRecordsByType_Success() throws Exception {
        // Arrange
        List<MedicalRecordResponse> records = Arrays.asList(recordResponse);
        when(medicalRecordService.getMedicalRecordsByType(RecordType.CONSULTATION)).thenReturn(records);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/type/CONSULTATION"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].recordType").value("CONSULTATION"));

        verify(medicalRecordService).getMedicalRecordsByType(RecordType.CONSULTATION);
    }

    @Test
    void updateMedicalRecord_Success() throws Exception {
        // Arrange
        when(medicalRecordService.updateMedicalRecord(eq(1L), any(MedicalRecordRequest.class)))
            .thenReturn(recordResponse);

        // Act & Assert
        mockMvc.perform(put("/api/medical-records/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(medicalRecordService).updateMedicalRecord(eq(1L), any(MedicalRecordRequest.class));
    }

    @Test
    void updateMedicalRecord_NotFound() throws Exception {
        // Arrange
        when(medicalRecordService.updateMedicalRecord(eq(999L), any(MedicalRecordRequest.class)))
            .thenThrow(new MedicalRecordNotFoundException("Medical record not found"));

        // Act & Assert
        mockMvc.perform(put("/api/medical-records/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isNotFound());

        verify(medicalRecordService).updateMedicalRecord(eq(999L), any(MedicalRecordRequest.class));
    }

    @Test
    void deleteMedicalRecord_Success() throws Exception {
        // Arrange
        doNothing().when(medicalRecordService).deleteMedicalRecord(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/medical-records/1"))
            .andExpect(status().isNoContent());

        verify(medicalRecordService).deleteMedicalRecord(1L);
    }

    @Test
    void deleteMedicalRecord_NotFound() throws Exception {
        // Arrange
        doThrow(new MedicalRecordNotFoundException("Medical record not found"))
            .when(medicalRecordService).deleteMedicalRecord(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/medical-records/999"))
            .andExpect(status().isNotFound());

        verify(medicalRecordService).deleteMedicalRecord(999L);
    }

    @Test
    void searchMedicalRecords_Success() throws Exception {
        // Arrange
        List<MedicalRecordResponse> records = Arrays.asList(recordResponse);
        when(medicalRecordService.searchMedicalRecords(1L, "Hypertension")).thenReturn(records);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/search")
                .param("patientId", "1")
                .param("query", "Hypertension"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].diagnosis").value("Hypertension"));

        verify(medicalRecordService).searchMedicalRecords(1L, "Hypertension");
    }

    @Test
    void getMedicalRecordsByDateRange_Success() throws Exception {
        // Arrange
        List<MedicalRecordResponse> records = Arrays.asList(recordResponse);
        when(medicalRecordService.getMedicalRecordsByDateRange(any(LocalDateTime.class), any(LocalDateTime.class)))
            .thenReturn(records);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/date-range")
                .param("startDate", "2024-01-01T00:00:00")
                .param("endDate", "2024-01-31T23:59:59"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1));

        verify(medicalRecordService).getMedicalRecordsByDateRange(any(LocalDateTime.class), any(LocalDateTime.class));
    }
} 