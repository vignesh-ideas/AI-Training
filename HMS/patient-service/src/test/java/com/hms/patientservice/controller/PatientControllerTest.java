package com.hms.patientservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.patientservice.dto.PatientRegistrationRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.PatientStatus;
import com.hms.patientservice.service.PatientService;
import com.hms.patientservice.exception.PatientNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PatientController.class)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PatientService patientService;

    @Autowired
    private ObjectMapper objectMapper;

    private PatientRegistrationRequest registrationRequest;
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
    void registerPatient_Success() throws Exception {
        // Arrange
        when(patientService.registerPatient(any(PatientRegistrationRequest.class)))
            .thenReturn(patientResponse);

        // Act & Assert
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"))
            .andExpect(jsonPath("$.gender").value("MALE"))
            .andExpect(jsonPath("$.status").value("ACTIVE"));

        verify(patientService).registerPatient(any(PatientRegistrationRequest.class));
    }

    @Test
    void registerPatient_ValidationError() throws Exception {
        // Arrange
        registrationRequest.setFirstName(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());

        verify(patientService, never()).registerPatient(any());
    }

    @Test
    void getPatientById_Success() throws Exception {
        // Arrange
        when(patientService.getPatientById(1L)).thenReturn(patientResponse);

        // Act & Assert
        mockMvc.perform(get("/api/patients/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(patientService).getPatientById(1L);
    }

    @Test
    void getPatientById_NotFound() throws Exception {
        // Arrange
        when(patientService.getPatientById(999L))
            .thenThrow(new PatientNotFoundException("Patient not found"));

        // Act & Assert
        mockMvc.perform(get("/api/patients/999"))
            .andExpect(status().isNotFound());

        verify(patientService).getPatientById(999L);
    }

    @Test
    void getPatientByEmail_Success() throws Exception {
        // Arrange
        when(patientService.getPatientByEmail("john.doe@example.com")).thenReturn(patientResponse);

        // Act & Assert
        mockMvc.perform(get("/api/patients/email/john.doe@example.com"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(patientService).getPatientByEmail("john.doe@example.com");
    }

    @Test
    void getPatientByEmail_NotFound() throws Exception {
        // Arrange
        when(patientService.getPatientByEmail("nonexistent@example.com"))
            .thenThrow(new PatientNotFoundException("Patient not found"));

        // Act & Assert
        mockMvc.perform(get("/api/patients/email/nonexistent@example.com"))
            .andExpect(status().isNotFound());

        verify(patientService).getPatientByEmail("nonexistent@example.com");
    }

    @Test
    void getAllPatients_Success() throws Exception {
        // Arrange
        List<PatientResponse> patients = Arrays.asList(patientResponse);
        when(patientService.getAllPatients()).thenReturn(patients);

        // Act & Assert
        mockMvc.perform(get("/api/patients"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].firstName").value("John"))
            .andExpect(jsonPath("$[0].lastName").value("Doe"));

        verify(patientService).getAllPatients();
    }

    @Test
    void updatePatient_Success() throws Exception {
        // Arrange
        when(patientService.updatePatient(eq(1L), any(PatientRegistrationRequest.class)))
            .thenReturn(patientResponse);

        // Act & Assert
        mockMvc.perform(put("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"));

        verify(patientService).updatePatient(eq(1L), any(PatientRegistrationRequest.class));
    }

    @Test
    void updatePatient_NotFound() throws Exception {
        // Arrange
        when(patientService.updatePatient(eq(999L), any(PatientRegistrationRequest.class)))
            .thenThrow(new PatientNotFoundException("Patient not found"));

        // Act & Assert
        mockMvc.perform(put("/api/patients/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isNotFound());

        verify(patientService).updatePatient(eq(999L), any(PatientRegistrationRequest.class));
    }

    @Test
    void deletePatient_Success() throws Exception {
        // Arrange
        doNothing().when(patientService).deletePatient(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/patients/1"))
            .andExpect(status().isNoContent());

        verify(patientService).deletePatient(1L);
    }

    @Test
    void deletePatient_NotFound() throws Exception {
        // Arrange
        doThrow(new PatientNotFoundException("Patient not found"))
            .when(patientService).deletePatient(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/patients/999"))
            .andExpect(status().isNotFound());

        verify(patientService).deletePatient(999L);
    }

    @Test
    void getPatientsByStatus_Success() throws Exception {
        // Arrange
        List<PatientResponse> patients = Arrays.asList(patientResponse);
        when(patientService.getPatientsByStatus(PatientStatus.ACTIVE)).thenReturn(patients);

        // Act & Assert
        mockMvc.perform(get("/api/patients/status/ACTIVE"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].status").value("ACTIVE"));

        verify(patientService).getPatientsByStatus(PatientStatus.ACTIVE);
    }

    @Test
    void searchPatientsByName_Success() throws Exception {
        // Arrange
        List<PatientResponse> patients = Arrays.asList(patientResponse);
        when(patientService.searchPatientsByName("John")).thenReturn(patients);

        // Act & Assert
        mockMvc.perform(get("/api/patients/search")
                .param("name", "John"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].firstName").value("John"));

        verify(patientService).searchPatientsByName("John");
    }
} 