package com.hms.patientservice.service;

import com.hms.patientservice.dto.PatientRegistrationRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.PatientStatus;
import com.hms.patientservice.exception.PatientNotFoundException;
import com.hms.patientservice.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private PatientRegistrationRequest registrationRequest;
    private Patient patient;
    private PatientResponse patientResponse;

    @BeforeEach
    void setUp() {
        // Setup PatientRegistrationRequest
        registrationRequest = new PatientRegistrationRequest();
        registrationRequest.setFirstName("John");
        registrationRequest.setLastName("Doe");
        registrationRequest.setEmail("john.doe@example.com");
        registrationRequest.setPhoneNumber("1234567890");
        registrationRequest.setDateOfBirth(LocalDate.of(1990, 1, 1));
        registrationRequest.setGender(Gender.MALE);
        registrationRequest.setAddress("123 Main St, City, State");
        registrationRequest.setEmergencyContact("Jane Doe");
        registrationRequest.setEmergencyPhone("0987654321");
        registrationRequest.setBloodGroup("O+");
        registrationRequest.setAllergies("None");
        registrationRequest.setMedicalHistory("No significant history");

        // Setup Patient entity
        patient = new Patient();
        patient.setId(1L);
        patient.setFirstName("John");
        patient.setLastName("Doe");
        patient.setEmail("john.doe@example.com");
        patient.setPhoneNumber("1234567890");
        patient.setDateOfBirth(LocalDate.of(1990, 1, 1));
        patient.setGender(Gender.MALE);
        patient.setAddress("123 Main St, City, State");
        patient.setEmergencyContact("Jane Doe");
        patient.setEmergencyPhone("0987654321");
        patient.setBloodGroup("O+");
        patient.setAllergies("None");
        patient.setMedicalHistory("No significant history");
        patient.setStatus(PatientStatus.ACTIVE);

        // Setup PatientResponse
        patientResponse = new PatientResponse();
        patientResponse.setId(1L);
        patientResponse.setFirstName("John");
        patientResponse.setLastName("Doe");
        patientResponse.setEmail("john.doe@example.com");
        patientResponse.setPhoneNumber("1234567890");
        patientResponse.setDateOfBirth(LocalDate.of(1990, 1, 1));
        patientResponse.setGender(Gender.MALE);
        patientResponse.setAddress("123 Main St, City, State");
        patientResponse.setEmergencyContact("Jane Doe");
        patientResponse.setEmergencyPhone("0987654321");
        patientResponse.setBloodGroup("O+");
        patientResponse.setAllergies("None");
        patientResponse.setMedicalHistory("No significant history");
        patientResponse.setStatus(PatientStatus.ACTIVE);
    }

    @Test
    void registerPatient_Success() {
        // Arrange
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        // Act
        PatientResponse response = patientService.registerPatient(registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals(Gender.MALE, response.getGender());
        assertEquals(PatientStatus.ACTIVE, response.getStatus());

        verify(patientRepository).save(any(Patient.class));
    }

    @Test
    void getPatientById_Success() {
        // Arrange
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

        // Act
        PatientResponse response = patientService.getPatientById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());

        verify(patientRepository).findById(1L);
    }

    @Test
    void getPatientById_NotFound() {
        // Arrange
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.getPatientById(999L);
        });

        verify(patientRepository).findById(999L);
    }

    @Test
    void getPatientByEmail_Success() {
        // Arrange
        when(patientRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(patient));

        // Act
        PatientResponse response = patientService.getPatientByEmail("john.doe@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("john.doe@example.com", response.getEmail());

        verify(patientRepository).findByEmail("john.doe@example.com");
    }

    @Test
    void getPatientByEmail_NotFound() {
        // Arrange
        when(patientRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.getPatientByEmail("nonexistent@example.com");
        });

        verify(patientRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void getAllPatients_Success() {
        // Arrange
        List<Patient> patients = Arrays.asList(patient);
        when(patientRepository.findAll()).thenReturn(patients);

        // Act
        List<PatientResponse> responses = patientService.getAllPatients();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(patientRepository).findAll();
    }

    @Test
    void updatePatient_Success() {
        // Arrange
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        // Act
        PatientResponse response = patientService.updatePatient(1L, registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());

        verify(patientRepository).findById(1L);
        verify(patientRepository).save(any(Patient.class));
    }

    @Test
    void updatePatient_NotFound() {
        // Arrange
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.updatePatient(999L, registrationRequest);
        });

        verify(patientRepository).findById(999L);
        verify(patientRepository, never()).save(any());
    }

    @Test
    void deletePatient_Success() {
        // Arrange
        when(patientRepository.existsById(1L)).thenReturn(true);

        // Act
        patientService.deletePatient(1L);

        // Assert
        verify(patientRepository).existsById(1L);
        verify(patientRepository).deleteById(1L);
    }

    @Test
    void deletePatient_NotFound() {
        // Arrange
        when(patientRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.deletePatient(999L);
        });

        verify(patientRepository).existsById(999L);
        verify(patientRepository, never()).deleteById(any());
    }

    @Test
    void getPatientsByStatus_Success() {
        // Arrange
        List<Patient> patients = Arrays.asList(patient);
        when(patientRepository.findByStatus(PatientStatus.ACTIVE)).thenReturn(patients);

        // Act
        List<PatientResponse> responses = patientService.getPatientsByStatus(PatientStatus.ACTIVE);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(patientRepository).findByStatus(PatientStatus.ACTIVE);
    }

    @Test
    void searchPatientsByName_Success() {
        // Arrange
        List<Patient> patients = Arrays.asList(patient);
        when(patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase("John", "John"))
            .thenReturn(patients);

        // Act
        List<PatientResponse> responses = patientService.searchPatientsByName("John");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(patientRepository).findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase("John", "John");
    }
} 