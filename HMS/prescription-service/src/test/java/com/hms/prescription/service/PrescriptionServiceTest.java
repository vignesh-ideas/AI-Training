package com.hms.prescription.service;

import com.hms.prescription.dto.PrescriptionRequest;
import com.hms.prescription.dto.PrescriptionItemRequest;
import com.hms.prescription.dto.PrescriptionResponse;
import com.hms.prescription.entity.Prescription;
import com.hms.prescription.entity.PrescriptionItem;
import com.hms.prescription.entity.PrescriptionStatus;
import com.hms.prescription.entity.MedicationRoute;
import com.hms.prescription.exception.PrescriptionNotFoundException;
import com.hms.prescription.repository.PrescriptionRepository;
import com.hms.prescription.repository.PrescriptionItemRepository;
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
class PrescriptionServiceTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;

    @Mock
    private PrescriptionItemRepository prescriptionItemRepository;

    @InjectMocks
    private PrescriptionService prescriptionService;

    private PrescriptionRequest prescriptionRequest;
    private Prescription prescription;
    private PrescriptionItem prescriptionItem;

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

        PrescriptionItemRequest itemRequest = new PrescriptionItemRequest();
        itemRequest.setMedicationName("Lisinopril");
        itemRequest.setDosage("10mg");
        itemRequest.setFrequency("Once daily");
        itemRequest.setDuration("30 days");
        itemRequest.setInstructions("Take in the morning");
        itemRequest.setQuantity(30);
        itemRequest.setRoute(MedicationRoute.ORAL);
        itemRequest.setRefills(2);
        itemRequest.setIsGeneric(true);

        prescriptionRequest.setPrescriptionItems(Arrays.asList(itemRequest));

        // Setup Prescription entity
        prescription = new Prescription();
        prescription.setId(1L);
        prescription.setPatientId(1L);
        prescription.setDoctorId(2L);
        prescription.setAppointmentId(3L);
        prescription.setDiagnosis("Hypertension");
        prescription.setNotes("Take medication as prescribed");
        prescription.setStatus(PrescriptionStatus.ACTIVE);
        prescription.setPrescribedDate(LocalDateTime.now());
        prescription.setValidUntil(LocalDateTime.now().plusDays(30));
        prescription.setCreatedAt(LocalDateTime.now());

        // Setup PrescriptionItem entity
        prescriptionItem = new PrescriptionItem();
        prescriptionItem.setId(1L);
        prescriptionItem.setPrescription(prescription);
        prescriptionItem.setMedicationName("Lisinopril");
        prescriptionItem.setDosage("10mg");
        prescriptionItem.setFrequency("Once daily");
        prescriptionItem.setDuration("30 days");
        prescriptionItem.setInstructions("Take in the morning");
        prescriptionItem.setQuantity(30);
        prescriptionItem.setRoute(MedicationRoute.ORAL);
        prescriptionItem.setRefills(2);
        prescriptionItem.setIsGeneric(true);
    }

    @Test
    void createPrescription_Success() {
        // Arrange
        when(prescriptionRepository.save(any(Prescription.class))).thenReturn(prescription);
        when(prescriptionItemRepository.saveAll(any())).thenReturn(Arrays.asList(prescriptionItem));

        // Act
        PrescriptionResponse response = prescriptionService.createPrescription(prescriptionRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());
        assertEquals("Hypertension", response.getDiagnosis());
        assertEquals(PrescriptionStatus.ACTIVE, response.getStatus());
        assertNotNull(response.getPrescriptionItems());
        assertEquals(1, response.getPrescriptionItems().size());

        verify(prescriptionRepository).save(any(Prescription.class));
        verify(prescriptionItemRepository).saveAll(any());
    }

    @Test
    void getPrescriptionById_Success() {
        // Arrange
        when(prescriptionRepository.findById(1L)).thenReturn(Optional.of(prescription));

        // Act
        PrescriptionResponse response = prescriptionService.getPrescriptionById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());

        verify(prescriptionRepository).findById(1L);
    }

    @Test
    void getPrescriptionById_NotFound() {
        // Arrange
        when(prescriptionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PrescriptionNotFoundException.class, () -> {
            prescriptionService.getPrescriptionById(999L);
        });

        verify(prescriptionRepository).findById(999L);
    }

    @Test
    void getPrescriptionsByPatientId_Success() {
        // Arrange
        List<Prescription> prescriptions = Arrays.asList(prescription);
        when(prescriptionRepository.findByPatientId(1L)).thenReturn(prescriptions);

        // Act
        List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByPatientId(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(prescriptionRepository).findByPatientId(1L);
    }

    @Test
    void getPrescriptionsByDoctorId_Success() {
        // Arrange
        List<Prescription> prescriptions = Arrays.asList(prescription);
        when(prescriptionRepository.findByDoctorId(2L)).thenReturn(prescriptions);

        // Act
        List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByDoctorId(2L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(prescriptionRepository).findByDoctorId(2L);
    }

    @Test
    void updatePrescriptionStatus_Success() {
        // Arrange
        when(prescriptionRepository.findById(1L)).thenReturn(Optional.of(prescription));
        when(prescriptionRepository.save(any(Prescription.class))).thenReturn(prescription);

        // Act
        PrescriptionResponse response = prescriptionService.updatePrescriptionStatus(1L, PrescriptionStatus.DISPENSED);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());

        verify(prescriptionRepository).findById(1L);
        verify(prescriptionRepository).save(any(Prescription.class));
    }

    @Test
    void updatePrescriptionStatus_NotFound() {
        // Arrange
        when(prescriptionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PrescriptionNotFoundException.class, () -> {
            prescriptionService.updatePrescriptionStatus(999L, PrescriptionStatus.DISPENSED);
        });

        verify(prescriptionRepository).findById(999L);
        verify(prescriptionRepository, never()).save(any());
    }

    @Test
    void deletePrescription_Success() {
        // Arrange
        when(prescriptionRepository.existsById(1L)).thenReturn(true);

        // Act
        prescriptionService.deletePrescription(1L);

        // Assert
        verify(prescriptionRepository).existsById(1L);
        verify(prescriptionRepository).deleteById(1L);
    }

    @Test
    void deletePrescription_NotFound() {
        // Arrange
        when(prescriptionRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(PrescriptionNotFoundException.class, () -> {
            prescriptionService.deletePrescription(999L);
        });

        verify(prescriptionRepository).existsById(999L);
        verify(prescriptionRepository, never()).deleteById(any());
    }

    @Test
    void getExpiredPrescriptions_Success() {
        // Arrange
        List<Prescription> expiredPrescriptions = Arrays.asList(prescription);
        when(prescriptionRepository.findExpiredPrescriptions(PrescriptionStatus.ACTIVE, any(LocalDateTime.class)))
            .thenReturn(expiredPrescriptions);

        // Act
        List<PrescriptionResponse> responses = prescriptionService.getExpiredPrescriptions();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());

        verify(prescriptionRepository).findExpiredPrescriptions(PrescriptionStatus.ACTIVE, any(LocalDateTime.class));
    }
} 