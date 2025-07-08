package com.hms.medicalrecordsservice.service;

import com.hms.medicalrecordsservice.dto.MedicalRecordRequest;
import com.hms.medicalrecordsservice.dto.MedicalRecordResponse;
import com.hms.medicalrecordsservice.entity.MedicalRecord;
import com.hms.medicalrecordsservice.entity.RecordType;
import com.hms.medicalrecordsservice.exception.MedicalRecordNotFoundException;
import com.hms.medicalrecordsservice.repository.MedicalRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicalRecordServiceTest {

    @Mock
    private MedicalRecordRepository medicalRecordRepository;

    @InjectMocks
    private MedicalRecordService medicalRecordService;

    private MedicalRecordRequest recordRequest;
    private MedicalRecord medicalRecord;
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

        // Setup MedicalRecord entity
        medicalRecord = new MedicalRecord();
        medicalRecord.setId(1L);
        medicalRecord.setPatientId(1L);
        medicalRecord.setDoctorId(2L);
        medicalRecord.setRecordType(RecordType.CONSULTATION);
        medicalRecord.setDiagnosis("Hypertension");
        medicalRecord.setSymptoms("High blood pressure, headache");
        medicalRecord.setTreatment("Prescribed medication");
        medicalRecord.setNotes("Patient needs regular monitoring");
        medicalRecord.setVitalSigns("BP: 140/90, HR: 80");
        medicalRecord.setCreatedAt(LocalDateTime.now());

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
    void createMedicalRecord_Success() {
        // Arrange
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenReturn(medicalRecord);

        // Act
        MedicalRecordResponse response = medicalRecordService.createMedicalRecord(recordRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());
        assertEquals(RecordType.CONSULTATION, response.getRecordType());
        assertEquals("Hypertension", response.getDiagnosis());

        verify(medicalRecordRepository).save(any(MedicalRecord.class));
    }

    @Test
    void getMedicalRecordById_Success() {
        // Arrange
        when(medicalRecordRepository.findById(1L)).thenReturn(Optional.of(medicalRecord));

        // Act
        MedicalRecordResponse response = medicalRecordService.getMedicalRecordById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());

        verify(medicalRecordRepository).findById(1L);
    }

    @Test
    void getMedicalRecordById_NotFound() {
        // Arrange
        when(medicalRecordRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MedicalRecordNotFoundException.class, () -> {
            medicalRecordService.getMedicalRecordById(999L);
        });

        verify(medicalRecordRepository).findById(999L);
    }

    @Test
    void getMedicalRecordsByPatientId_Success() {
        // Arrange
        List<MedicalRecord> records = Arrays.asList(medicalRecord);
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(records);

        // Act
        List<MedicalRecordResponse> responses = medicalRecordService.getMedicalRecordsByPatientId(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(medicalRecordRepository).findByPatientId(1L);
    }

    @Test
    void getMedicalRecordsByDoctorId_Success() {
        // Arrange
        List<MedicalRecord> records = Arrays.asList(medicalRecord);
        when(medicalRecordRepository.findByDoctorId(2L)).thenReturn(records);

        // Act
        List<MedicalRecordResponse> responses = medicalRecordService.getMedicalRecordsByDoctorId(2L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(medicalRecordRepository).findByDoctorId(2L);
    }

    @Test
    void getMedicalRecordsByType_Success() {
        // Arrange
        List<MedicalRecord> records = Arrays.asList(medicalRecord);
        when(medicalRecordRepository.findByRecordType(RecordType.CONSULTATION)).thenReturn(records);

        // Act
        List<MedicalRecordResponse> responses = medicalRecordService.getMedicalRecordsByType(RecordType.CONSULTATION);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(medicalRecordRepository).findByRecordType(RecordType.CONSULTATION);
    }

    @Test
    void updateMedicalRecord_Success() {
        // Arrange
        when(medicalRecordRepository.findById(1L)).thenReturn(Optional.of(medicalRecord));
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenReturn(medicalRecord);

        // Act
        MedicalRecordResponse response = medicalRecordService.updateMedicalRecord(1L, recordRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());

        verify(medicalRecordRepository).findById(1L);
        verify(medicalRecordRepository).save(any(MedicalRecord.class));
    }

    @Test
    void updateMedicalRecord_NotFound() {
        // Arrange
        when(medicalRecordRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MedicalRecordNotFoundException.class, () -> {
            medicalRecordService.updateMedicalRecord(999L, recordRequest);
        });

        verify(medicalRecordRepository).findById(999L);
        verify(medicalRecordRepository, never()).save(any());
    }

    @Test
    void deleteMedicalRecord_Success() {
        // Arrange
        when(medicalRecordRepository.existsById(1L)).thenReturn(true);

        // Act
        medicalRecordService.deleteMedicalRecord(1L);

        // Assert
        verify(medicalRecordRepository).existsById(1L);
        verify(medicalRecordRepository).deleteById(1L);
    }

    @Test
    void deleteMedicalRecord_NotFound() {
        // Arrange
        when(medicalRecordRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(MedicalRecordNotFoundException.class, () -> {
            medicalRecordService.deleteMedicalRecord(999L);
        });

        verify(medicalRecordRepository).existsById(999L);
        verify(medicalRecordRepository, never()).deleteById(any());
    }

    @Test
    void searchMedicalRecords_Success() {
        // Arrange
        List<MedicalRecord> records = Arrays.asList(medicalRecord);
        when(medicalRecordRepository.findByPatientIdAndDiagnosisContainingIgnoreCase(1L, "Hypertension"))
            .thenReturn(records);

        // Act
        List<MedicalRecordResponse> responses = medicalRecordService.searchMedicalRecords(1L, "Hypertension");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(medicalRecordRepository).findByPatientIdAndDiagnosisContainingIgnoreCase(1L, "Hypertension");
    }

    @Test
    void getMedicalRecordsByDateRange_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();
        List<MedicalRecord> records = Arrays.asList(medicalRecord);
        when(medicalRecordRepository.findByCreatedAtBetween(startDate, endDate))
            .thenReturn(records);

        // Act
        List<MedicalRecordResponse> responses = medicalRecordService.getMedicalRecordsByDateRange(startDate, endDate);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(medicalRecordRepository).findByCreatedAtBetween(startDate, endDate);
    }
} 