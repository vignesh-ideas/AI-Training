package com.hms.medicalrecordsservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.medicalrecordsservice.dto.MedicalRecordRequest;
import com.hms.medicalrecordsservice.dto.MedicalRecordResponse;
import com.hms.medicalrecordsservice.entity.RecordType;
import com.hms.medicalrecordsservice.repository.MedicalRecordRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class MedicalRecordServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private MedicalRecordRequest recordRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        recordRequest = new MedicalRecordRequest();
        recordRequest.setPatientId(1L);
        recordRequest.setDoctorId(2L);
        recordRequest.setRecordType(RecordType.CONSULTATION);
        recordRequest.setDiagnosis("Hypertension");
        recordRequest.setSymptoms("High blood pressure, headache");
        recordRequest.setTreatment("Prescribed medication");
        recordRequest.setNotes("Patient needs regular monitoring");
        recordRequest.setVitalSigns("BP: 140/90, HR: 80");
    }

    @Test
    void createMedicalRecord_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.recordType").value("CONSULTATION"))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        MedicalRecordResponse responseObj = objectMapper.readValue(response, MedicalRecordResponse.class);
        assertTrue(medicalRecordRepository.existsById(responseObj.getId()));
    }

    @Test
    void getMedicalRecordById_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        String createResponse = mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        MedicalRecordResponse createdRecord = objectMapper.readValue(createResponse, MedicalRecordResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/" + createdRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdRecord.getId()))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.diagnosis").value("Hypertension"));
    }

    @Test
    void getMedicalRecordsByPatientId_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].patientId").value(1));
    }

    @Test
    void getMedicalRecordsByDoctorId_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/doctor/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].doctorId").value(2));
    }

    @Test
    void updateMedicalRecord_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        String createResponse = mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        MedicalRecordResponse createdRecord = objectMapper.readValue(createResponse, MedicalRecordResponse.class);

        // Update record data
        recordRequest.setDiagnosis("Updated diagnosis");
        recordRequest.setTreatment("Updated treatment");

        // Act & Assert
        mockMvc.perform(put("/api/medical-records/" + createdRecord.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.diagnosis").value("Updated diagnosis"))
            .andExpect(jsonPath("$.treatment").value("Updated treatment"));
    }

    @Test
    void deleteMedicalRecord_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        String createResponse = mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        MedicalRecordResponse createdRecord = objectMapper.readValue(createResponse, MedicalRecordResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/medical-records/" + createdRecord.getId()))
            .andExpect(status().isNoContent());

        // Verify record is deleted
        assertFalse(medicalRecordRepository.existsById(createdRecord.getId()));
    }

    @Test
    void getMedicalRecordsByType_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/type/CONSULTATION"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].recordType").value("CONSULTATION"));
    }

    @Test
    void searchMedicalRecords_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/search")
                .param("patientId", "1")
                .param("query", "Hypertension"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].diagnosis").value("Hypertension"));
    }

    @Test
    void getMedicalRecordById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/medical-records/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createMedicalRecord_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        recordRequest.setPatientId(null);

        // Act & Assert
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getMedicalRecordsByDateRange_IntegrationTest() throws Exception {
        // Arrange - Create medical record first
        mockMvc.perform(post("/api/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recordRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/medical-records/date-range")
                .param("startDate", "2024-01-01T00:00:00")
                .param("endDate", "2024-12-31T23:59:59"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
} 