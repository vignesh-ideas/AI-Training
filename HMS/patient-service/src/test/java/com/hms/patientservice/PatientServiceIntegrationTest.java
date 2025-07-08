package com.hms.patientservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.patientservice.dto.PatientRegistrationRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.PatientStatus;
import com.hms.patientservice.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class PatientServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private PatientRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
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
    }

    @Test
    void registerPatient_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"))
            .andExpect(jsonPath("$.gender").value("MALE"))
            .andExpect(jsonPath("$.status").value("ACTIVE"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        PatientResponse responseObj = objectMapper.readValue(response, PatientResponse.class);
        assertTrue(patientRepository.existsById(responseObj.getId()));
    }

    @Test
    void getPatientById_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        String createResponse = mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PatientResponse createdPatient = objectMapper.readValue(createResponse, PatientResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/patients/" + createdPatient.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdPatient.getId()))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void getPatientByEmail_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/patients/email/john.doe@example.com"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("john.doe@example.com"))
            .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void getAllPatients_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/patients"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    void updatePatient_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        String createResponse = mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PatientResponse createdPatient = objectMapper.readValue(createResponse, PatientResponse.class);

        // Update patient data
        registrationRequest.setFirstName("Jane");
        registrationRequest.setLastName("Smith");

        // Act & Assert
        mockMvc.perform(put("/api/patients/" + createdPatient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.lastName").value("Smith"));
    }

    @Test
    void deletePatient_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        String createResponse = mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PatientResponse createdPatient = objectMapper.readValue(createResponse, PatientResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/patients/" + createdPatient.getId()))
            .andExpect(status().isNoContent());

        // Verify patient is deleted
        assertFalse(patientRepository.existsById(createdPatient.getId()));
    }

    @Test
    void getPatientsByStatus_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/patients/status/ACTIVE"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    void searchPatientsByName_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/patients/search")
                .param("name", "John"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    void getPatientById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/patients/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void registerPatient_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        registrationRequest.setFirstName(null);

        // Act & Assert
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void registerPatient_DuplicateEmail_IntegrationTest() throws Exception {
        // Arrange - Create patient first
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert - Try to register with same email
        mockMvc.perform(post("/api/patients/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());
    }
} 