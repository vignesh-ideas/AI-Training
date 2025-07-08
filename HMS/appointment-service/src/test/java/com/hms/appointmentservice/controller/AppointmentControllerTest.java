package com.hms.appointmentservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.appointmentservice.dto.AppointmentRequest;
import com.hms.appointmentservice.dto.AppointmentResponse;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import com.hms.appointmentservice.service.AppointmentService;
import com.hms.appointmentservice.exception.AppointmentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppointmentController.class)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;

    @Autowired
    private ObjectMapper objectMapper;

    private AppointmentRequest appointmentRequest;
    private AppointmentResponse appointmentResponse;

    @BeforeEach
    void setUp() {
        // Setup AppointmentRequest
        appointmentRequest = new AppointmentRequest();
        appointmentRequest.setPatientId(1L);
        appointmentRequest.setDoctorId(2L);
        appointmentRequest.setAppointmentDate(LocalDateTime.now().plusDays(1));
        appointmentRequest.setAppointmentType(AppointmentType.CONSULTATION);
        appointmentRequest.setReason("Regular checkup");
        appointmentRequest.setNotes("Patient requested follow-up");
        appointmentRequest.setDuration(30);

        // Setup AppointmentResponse
        appointmentResponse = new AppointmentResponse();
        appointmentResponse.setId(1L);
        appointmentResponse.setPatientId(1L);
        appointmentResponse.setDoctorId(2L);
        appointmentResponse.setAppointmentDate(LocalDateTime.now().plusDays(1));
        appointmentResponse.setAppointmentType(AppointmentType.CONSULTATION);
        appointmentResponse.setStatus(AppointmentStatus.SCHEDULED);
        appointmentResponse.setReason("Regular checkup");
        appointmentResponse.setNotes("Patient requested follow-up");
        appointmentResponse.setDuration(30);
        appointmentResponse.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createAppointment_Success() throws Exception {
        // Arrange
        when(appointmentService.createAppointment(any(AppointmentRequest.class)))
            .thenReturn(appointmentResponse);

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2))
            .andExpect(jsonPath("$.appointmentType").value("CONSULTATION"))
            .andExpect(jsonPath("$.status").value("SCHEDULED"));

        verify(appointmentService).createAppointment(any(AppointmentRequest.class));
    }

    @Test
    void createAppointment_ValidationError() throws Exception {
        // Arrange
        appointmentRequest.setPatientId(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isBadRequest());

        verify(appointmentService, never()).createAppointment(any());
    }

    @Test
    void getAppointmentById_Success() throws Exception {
        // Arrange
        when(appointmentService.getAppointmentById(1L)).thenReturn(appointmentResponse);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.patientId").value(1))
            .andExpect(jsonPath("$.doctorId").value(2));

        verify(appointmentService).getAppointmentById(1L);
    }

    @Test
    void getAppointmentById_NotFound() throws Exception {
        // Arrange
        when(appointmentService.getAppointmentById(999L))
            .thenThrow(new AppointmentNotFoundException("Appointment not found"));

        // Act & Assert
        mockMvc.perform(get("/api/appointments/999"))
            .andExpect(status().isNotFound());

        verify(appointmentService).getAppointmentById(999L);
    }

    @Test
    void getAppointmentsByPatientId_Success() throws Exception {
        // Arrange
        List<AppointmentResponse> appointments = Arrays.asList(appointmentResponse);
        when(appointmentService.getAppointmentsByPatientId(1L)).thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/patient/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].patientId").value(1));

        verify(appointmentService).getAppointmentsByPatientId(1L);
    }

    @Test
    void getAppointmentsByDoctorId_Success() throws Exception {
        // Arrange
        List<AppointmentResponse> appointments = Arrays.asList(appointmentResponse);
        when(appointmentService.getAppointmentsByDoctorId(2L)).thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/doctor/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].doctorId").value(2));

        verify(appointmentService).getAppointmentsByDoctorId(2L);
    }

    @Test
    void getAppointmentsByStatus_Success() throws Exception {
        // Arrange
        List<AppointmentResponse> appointments = Arrays.asList(appointmentResponse);
        when(appointmentService.getAppointmentsByStatus(AppointmentStatus.SCHEDULED))
            .thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/status/SCHEDULED"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].status").value("SCHEDULED"));

        verify(appointmentService).getAppointmentsByStatus(AppointmentStatus.SCHEDULED);
    }

    @Test
    void updateAppointment_Success() throws Exception {
        // Arrange
        when(appointmentService.updateAppointment(eq(1L), any(AppointmentRequest.class)))
            .thenReturn(appointmentResponse);

        // Act & Assert
        mockMvc.perform(put("/api/appointments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(appointmentService).updateAppointment(eq(1L), any(AppointmentRequest.class));
    }

    @Test
    void updateAppointment_NotFound() throws Exception {
        // Arrange
        when(appointmentService.updateAppointment(eq(999L), any(AppointmentRequest.class)))
            .thenThrow(new AppointmentNotFoundException("Appointment not found"));

        // Act & Assert
        mockMvc.perform(put("/api/appointments/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointmentRequest)))
            .andExpect(status().isNotFound());

        verify(appointmentService).updateAppointment(eq(999L), any(AppointmentRequest.class));
    }

    @Test
    void cancelAppointment_Success() throws Exception {
        // Arrange
        when(appointmentService.cancelAppointment(1L)).thenReturn(appointmentResponse);

        // Act & Assert
        mockMvc.perform(put("/api/appointments/1/cancel"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("CANCELLED"));

        verify(appointmentService).cancelAppointment(1L);
    }

    @Test
    void cancelAppointment_NotFound() throws Exception {
        // Arrange
        when(appointmentService.cancelAppointment(999L))
            .thenThrow(new AppointmentNotFoundException("Appointment not found"));

        // Act & Assert
        mockMvc.perform(put("/api/appointments/999/cancel"))
            .andExpect(status().isNotFound());

        verify(appointmentService).cancelAppointment(999L);
    }

    @Test
    void deleteAppointment_Success() throws Exception {
        // Arrange
        doNothing().when(appointmentService).deleteAppointment(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/appointments/1"))
            .andExpect(status().isNoContent());

        verify(appointmentService).deleteAppointment(1L);
    }

    @Test
    void deleteAppointment_NotFound() throws Exception {
        // Arrange
        doThrow(new AppointmentNotFoundException("Appointment not found"))
            .when(appointmentService).deleteAppointment(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/appointments/999"))
            .andExpect(status().isNotFound());

        verify(appointmentService).deleteAppointment(999L);
    }

    @Test
    void getUpcomingAppointments_Success() throws Exception {
        // Arrange
        List<AppointmentResponse> appointments = Arrays.asList(appointmentResponse);
        when(appointmentService.getUpcomingAppointments()).thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/upcoming"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1));

        verify(appointmentService).getUpcomingAppointments();
    }

    @Test
    void getAppointmentsByDateRange_Success() throws Exception {
        // Arrange
        List<AppointmentResponse> appointments = Arrays.asList(appointmentResponse);
        when(appointmentService.getAppointmentsByDateRange(any(LocalDateTime.class), any(LocalDateTime.class)))
            .thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/date-range")
                .param("startDate", "2024-01-01T00:00:00")
                .param("endDate", "2024-01-31T23:59:59"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1));

        verify(appointmentService).getAppointmentsByDateRange(any(LocalDateTime.class), any(LocalDateTime.class));
    }
} 