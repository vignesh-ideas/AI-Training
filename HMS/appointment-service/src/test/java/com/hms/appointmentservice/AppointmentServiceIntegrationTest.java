package com.hms.appointmentservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.appointmentservice.dto.AppointmentRequest;
import com.hms.appointmentservice.dto.AppointmentResponse;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import com.hms.appointmentservice.repository.AppointmentRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class AppointmentServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private AppointmentRequest appointmentRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        appointmentRequest = new AppointmentRequest();
        appointmentRequest.setPatientId(1L);
        appointmentRequest.setDoctorId(2L);
        appointmentRequest.setAppointmentDate(LocalDateTime.now().plusDays(1));
        appointmentRequest.setAppointmentType(AppointmentType.CONSULTATION);
        appointmentRequest.setReason("Regular checkup");
        appointmentRequest.setNotes("Patient requested follow-up");
        appointmentRequest.setDuration(30);
    }

    @Test
    void createAppointment_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.appointmentType").value("CONSULTATION"))
            .andExpect(jsonPath("$.status").value("SCHEDULED"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        AppointmentResponse responseObj = objectMapper.readValue(response, AppointmentResponse.class);
        assertTrue(appointmentRepository.existsById(responseObj.getId()));
    }

    @Test
    void getAppointmentById_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        String createResponse = mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        AppointmentResponse createdAppointment = objectMapper.readValue(createResponse, AppointmentResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/" + createdAppointment.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdAppointment.getId()))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2));
    }

    @Test
    void getAppointmentsByPatientId_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/appointments/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].patientId").value(1));
    }

    @Test
    void getAppointmentsByDoctorId_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/appointments/doctor/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].doctorId").value(2));
    }

    @Test
    void updateAppointment_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        String createResponse = mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        AppointmentResponse createdAppointment = objectMapper.readValue(createResponse, AppointmentResponse.class);

        // Update appointment data
        appointmentRequest.setReason("Updated reason");
        appointmentRequest.setNotes("Updated notes");

        // Act & Assert
        mockMvc.perform(put("/api/appointments/" + createdAppointment.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reason").value("Updated reason"))
            .andExpect(jsonPath("$.notes").value("Updated notes"));
    }

    @Test
    void cancelAppointment_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        String createResponse = mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        AppointmentResponse createdAppointment = objectMapper.readValue(createResponse, AppointmentResponse.class);

        // Act & Assert
        mockMvc.perform(put("/api/appointments/" + createdAppointment.getId() + "/cancel"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void deleteAppointment_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        String createResponse = mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        AppointmentResponse createdAppointment = objectMapper.readValue(createResponse, AppointmentResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/appointments/" + createdAppointment.getId()))
            .andExpect(status().isNoContent());

        // Verify appointment is deleted
        assertFalse(appointmentRepository.existsById(createdAppointment.getId()));
    }

    @Test
    void getAppointmentsByStatus_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/appointments/status/SCHEDULED"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].status").value("SCHEDULED"));
    }

    @Test
    void getUpcomingAppointments_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/appointments/upcoming"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getAppointmentById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/appointments/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createAppointment_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        appointmentRequest.setPatientId(null);

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getAppointmentsByDateRange_IntegrationTest() throws Exception {
        // Arrange - Create appointment first
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        
        mockMvc.perform(get("/api/appointments/date-range")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
} 