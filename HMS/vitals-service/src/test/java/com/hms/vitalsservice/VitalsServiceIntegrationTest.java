package com.hms.vitalsservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.vitalsservice.dto.VitalsRequest;
import com.hms.vitalsservice.entity.Vitals;
import com.hms.vitalsservice.entity.VitalsStatus;
import com.hms.vitalsservice.repository.VitalsRepository;
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
class VitalsServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private VitalsRepository vitalsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        vitalsRepository.deleteAll();
    }

    @Test
    void testCreateVitals_Integration() throws Exception {
        VitalsRequest request = new VitalsRequest();
        request.setPatientId(1L);
        request.setBloodPressure("120/80");
        request.setHeartRate(75);
        request.setTemperature(98.6);
        request.setWeight(70.5);
        request.setHeight(175.0);

        mockMvc.perform(post("/api/vitals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.bloodPressure").value("120/80"))
                .andExpect(jsonPath("$.heartRate").value(75));

        assertEquals(1, vitalsRepository.count());
    }

    @Test
    void testGetVitalsById_Integration() throws Exception {
        // Create vitals first
        Vitals vitals = new Vitals();
        vitals.setPatientId(1L);
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(75);
        vitals.setTemperature(98.6);
        vitals.setWeight(70.5);
        vitals.setHeight(175.0);
        vitals.setStatus(VitalsStatus.NORMAL);
        vitals.setRecordedAt(LocalDateTime.now());
        
        Vitals savedVitals = vitalsRepository.save(vitals);

        mockMvc.perform(get("/api/vitals/" + savedVitals.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedVitals.getId()))
                .andExpect(jsonPath("$.patientId").value(1))
                .andExpect(jsonPath("$.bloodPressure").value("120/80"));
    }

    @Test
    void testGetVitalsByPatientId_Integration() throws Exception {
        // Create vitals for patient
        Vitals vitals = new Vitals();
        vitals.setPatientId(1L);
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(75);
        vitals.setTemperature(98.6);
        vitals.setWeight(70.5);
        vitals.setHeight(175.0);
        vitals.setStatus(VitalsStatus.NORMAL);
        vitals.setRecordedAt(LocalDateTime.now());
        
        vitalsRepository.save(vitals);

        mockMvc.perform(get("/api/vitals/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId").value(1))
                .andExpect(jsonPath("$[0].bloodPressure").value("120/80"));
    }

    @Test
    void testUpdateVitals_Integration() throws Exception {
        // Create vitals first
        Vitals vitals = new Vitals();
        vitals.setPatientId(1L);
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(75);
        vitals.setTemperature(98.6);
        vitals.setWeight(70.5);
        vitals.setHeight(175.0);
        vitals.setStatus(VitalsStatus.NORMAL);
        vitals.setRecordedAt(LocalDateTime.now());
        
        Vitals savedVitals = vitalsRepository.save(vitals);

        // Update request
        VitalsRequest updateRequest = new VitalsRequest();
        updateRequest.setPatientId(1L);
        updateRequest.setBloodPressure("130/85");
        updateRequest.setHeartRate(80);
        updateRequest.setTemperature(99.0);
        updateRequest.setWeight(71.0);
        updateRequest.setHeight(175.0);

        mockMvc.perform(put("/api/vitals/" + savedVitals.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bloodPressure").value("130/85"))
                .andExpect(jsonPath("$.heartRate").value(80));
    }

    @Test
    void testDeleteVitals_Integration() throws Exception {
        // Create vitals first
        Vitals vitals = new Vitals();
        vitals.setPatientId(1L);
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(75);
        vitals.setTemperature(98.6);
        vitals.setWeight(70.5);
        vitals.setHeight(175.0);
        vitals.setStatus(VitalsStatus.NORMAL);
        vitals.setRecordedAt(LocalDateTime.now());
        
        Vitals savedVitals = vitalsRepository.save(vitals);

        mockMvc.perform(delete("/api/vitals/" + savedVitals.getId()))
                .andExpect(status().isNoContent());

        assertEquals(0, vitalsRepository.count());
    }

    @Test
    void testGetAllVitals_Integration() throws Exception {
        // Create multiple vitals
        Vitals vitals1 = new Vitals();
        vitals1.setPatientId(1L);
        vitals1.setBloodPressure("120/80");
        vitals1.setHeartRate(75);
        vitals1.setTemperature(98.6);
        vitals1.setWeight(70.5);
        vitals1.setHeight(175.0);
        vitals1.setStatus(VitalsStatus.NORMAL);
        vitals1.setRecordedAt(LocalDateTime.now());

        Vitals vitals2 = new Vitals();
        vitals2.setPatientId(2L);
        vitals2.setBloodPressure("125/85");
        vitals2.setHeartRate(80);
        vitals2.setTemperature(98.8);
        vitals2.setWeight(75.0);
        vitals2.setHeight(180.0);
        vitals2.setStatus(VitalsStatus.NORMAL);
        vitals2.setRecordedAt(LocalDateTime.now());

        vitalsRepository.save(vitals1);
        vitalsRepository.save(vitals2);

        mockMvc.perform(get("/api/vitals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testCreateVitals_ValidationError_Integration() throws Exception {
        VitalsRequest request = new VitalsRequest();
        request.setPatientId(1L);
        // Missing required fields

        mockMvc.perform(post("/api/vitals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        assertEquals(0, vitalsRepository.count());
    }
} 