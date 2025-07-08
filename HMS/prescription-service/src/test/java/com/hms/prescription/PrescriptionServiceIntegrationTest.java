package com.hms.prescription;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.prescription.dto.PrescriptionRequest;
import com.hms.prescription.dto.PrescriptionResponse;
import com.hms.prescription.entity.PrescriptionStatus;
import com.hms.prescription.entity.MedicationRoute;
import com.hms.prescription.repository.PrescriptionRepository;
import com.hms.prescription.repository.PrescriptionItemRepository;
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

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class PrescriptionServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PrescriptionItemRepository prescriptionItemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private PrescriptionRequest prescriptionRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        prescriptionRequest = new PrescriptionRequest();
        prescriptionRequest.setPatientId(1L);
        prescriptionRequest.setDoctorId(2L);
        prescriptionRequest.setAppointmentId(3L);
        prescriptionRequest.setDiagnosis("Hypertension");
        prescriptionRequest.setNotes("Take medication as prescribed");
        prescriptionRequest.setValidUntil(LocalDateTime.now().plusDays(30));

        com.hms.prescription.dto.PrescriptionItemRequest itemRequest = new com.hms.prescription.dto.PrescriptionItemRequest();
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
    }

    @Test
    void createPrescription_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"))
            .andExpect(jsonPath("$.status").value("ACTIVE"))
            .andExpect(jsonPath("$.prescriptionItems").exists())
            .andExpect(jsonPath("$.prescriptionItems[0].medicationName").value("Lisinopril"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        PrescriptionResponse responseObj = objectMapper.readValue(response, PrescriptionResponse.class);
        assertTrue(prescriptionRepository.existsById(responseObj.getId()));
    }

    @Test
    void getPrescriptionById_IntegrationTest() throws Exception {
        // Arrange - Create prescription first
        String createResponse = mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PrescriptionResponse createdPrescription = objectMapper.readValue(createResponse, PrescriptionResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/" + createdPrescription.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdPrescription.getId()))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"));
    }

    @Test
    void getPrescriptionsByPatientId_IntegrationTest() throws Exception {
        // Arrange - Create prescription first
        mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].patientId").value(1));
    }

    @Test
    void updatePrescriptionStatus_IntegrationTest() throws Exception {
        // Arrange - Create prescription first
        String createResponse = mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PrescriptionResponse createdPrescription = objectMapper.readValue(createResponse, PrescriptionResponse.class);

        // Act & Assert
        mockMvc.perform(put("/api/prescriptions/" + createdPrescription.getId() + "/status")
                .param("status", "DISPENSED"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("DISPENSED"));
    }

    @Test
    void deletePrescription_IntegrationTest() throws Exception {
        // Arrange - Create prescription first
        String createResponse = mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        PrescriptionResponse createdPrescription = objectMapper.readValue(createResponse, PrescriptionResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/prescriptions/" + createdPrescription.getId()))
            .andExpect(status().isNoContent());

        // Verify prescription is deleted
        assertFalse(prescriptionRepository.existsById(createdPrescription.getId()));
    }

    @Test
    void getPrescriptionById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/prescriptions/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createPrescription_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        prescriptionRequest.setPatientId(null);

        // Act & Assert
        mockMvc.perform(post("/api/prescriptions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prescriptionRequest)))
            .andExpect(status().isBadRequest());
    }
} 