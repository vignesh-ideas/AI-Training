package com.hms.labservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.labservice.dto.LabTestRequest;
import com.hms.labservice.entity.LabTest;
import com.hms.labservice.entity.LabTestStatus;
import com.hms.labservice.entity.LabTestType;
import com.hms.labservice.repository.LabTestRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Transactional
class LabServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private LabTestRepository labTestRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        labTestRepository.deleteAll();
    }

    @Test
    void testCreateLabTest_Integration() throws Exception {
        LabTestRequest request = new LabTestRequest();
        request.setPatientId(1L);
        request.setTestType(LabTestType.BLOOD_TEST);
        request.setTestName("Complete Blood Count");
        request.setDescription("Routine blood test");

        mockMvc.perform(post("/api/lab-tests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.testName").value("Complete Blood Count"))
                .andExpect(jsonPath("$.testType").value("BLOOD_TEST"));

        assertEquals(1, labTestRepository.count());
    }

    @Test
    void testGetLabTestById_Integration() throws Exception {
        // Create lab test first
        LabTest labTest = new LabTest();
        labTest.setPatientId(1L);
        labTest.setTestType(LabTestType.BLOOD_TEST);
        labTest.setTestName("Complete Blood Count");
        labTest.setDescription("Routine blood test");
        labTest.setStatus(LabTestStatus.PENDING);
        labTest.setOrderedAt(LocalDateTime.now());
        
        LabTest savedLabTest = labTestRepository.save(labTest);

        mockMvc.perform(get("/api/lab-tests/" + savedLabTest.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedLabTest.getId()))
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.testName").value("Complete Blood Count"));
    }

    @Test
    void testGetLabTestsByPatientId_Integration() throws Exception {
        // Create lab test for patient
        LabTest labTest = new LabTest();
        labTest.setPatientId(1L);
        labTest.setTestType(LabTestType.BLOOD_TEST);
        labTest.setTestName("Complete Blood Count");
        labTest.setDescription("Routine blood test");
        labTest.setStatus(LabTestStatus.PENDING);
        labTest.setOrderedAt(LocalDateTime.now());
        
        labTestRepository.save(labTest);

        mockMvc.perform(get("/api/lab-tests/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId").value(1))
                .andExpect(jsonPath("$[0].testName").value("Complete Blood Count"));
    }

    @Test
    void testUpdateLabTest_Integration() throws Exception {
        // Create lab test first
        LabTest labTest = new LabTest();
        labTest.setPatientId(1L);
        labTest.setTestType(LabTestType.BLOOD_TEST);
        labTest.setTestName("Complete Blood Count");
        labTest.setDescription("Routine blood test");
        labTest.setStatus(LabTestStatus.PENDING);
        labTest.setOrderedAt(LocalDateTime.now());
        
        LabTest savedLabTest = labTestRepository.save(labTest);

        // Update request
        LabTestRequest updateRequest = new LabTestRequest();
        updateRequest.setPatientId(1L);
        updateRequest.setTestType(LabTestType.URINE_TEST);
        updateRequest.setTestName("Urinalysis");
        updateRequest.setDescription("Urine analysis test");

        mockMvc.perform(put("/api/lab-tests/" + savedLabTest.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testName").value("Urinalysis"))
                .andExpect(jsonPath("$.testType").value("URINE_TEST"));
    }

    @Test
    void testDeleteLabTest_Integration() throws Exception {
        // Create lab test first
        LabTest labTest = new LabTest();
        labTest.setPatientId(1L);
        labTest.setTestType(LabTestType.BLOOD_TEST);
        labTest.setTestName("Complete Blood Count");
        labTest.setDescription("Routine blood test");
        labTest.setStatus(LabTestStatus.PENDING);
        labTest.setOrderedAt(LocalDateTime.now());
        
        LabTest savedLabTest = labTestRepository.save(labTest);

        mockMvc.perform(delete("/api/lab-tests/" + savedLabTest.getId()))
                .andExpect(status().isNoContent());

        assertEquals(0, labTestRepository.count());
    }

    @Test
    void testGetAllLabTests_Integration() throws Exception {
        // Create multiple lab tests
        LabTest labTest1 = new LabTest();
        labTest1.setPatientId(1L);
        labTest1.setTestType(LabTestType.BLOOD_TEST);
        labTest1.setTestName("Complete Blood Count");
        labTest1.setDescription("Routine blood test");
        labTest1.setStatus(LabTestStatus.PENDING);
        labTest1.setOrderedAt(LocalDateTime.now());

        LabTest labTest2 = new LabTest();
        labTest2.setPatientId(2L);
        labTest2.setTestType(LabTestType.URINE_TEST);
        labTest2.setTestName("Urinalysis");
        labTest2.setDescription("Urine analysis test");
        labTest2.setStatus(LabTestStatus.COMPLETED);
        labTest2.setOrderedAt(LocalDateTime.now());

        labTestRepository.save(labTest1);
        labTestRepository.save(labTest2);

        mockMvc.perform(get("/api/lab-tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetLabTestsByStatus_Integration() throws Exception {
        // Create lab tests with different statuses
        LabTest labTest1 = new LabTest();
        labTest1.setPatientId(1L);
        labTest1.setTestType(LabTestType.BLOOD_TEST);
        labTest1.setTestName("Complete Blood Count");
        labTest1.setDescription("Routine blood test");
        labTest1.setStatus(LabTestStatus.PENDING);
        labTest1.setOrderedAt(LocalDateTime.now());

        LabTest labTest2 = new LabTest();
        labTest2.setPatientId(2L);
        labTest2.setTestType(LabTestType.URINE_TEST);
        labTest2.setTestName("Urinalysis");
        labTest2.setDescription("Urine analysis test");
        labTest2.setStatus(LabTestStatus.COMPLETED);
        labTest2.setOrderedAt(LocalDateTime.now());

        labTestRepository.save(labTest1);
        labTestRepository.save(labTest2);

        mockMvc.perform(get("/api/lab-tests/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void testCreateLabTest_ValidationError_Integration() throws Exception {
        LabTestRequest request = new LabTestRequest();
        request.setPatientId(1L);
        // Missing required fields

        mockMvc.perform(post("/api/lab-tests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        assertEquals(0, labTestRepository.count());
    }
} 