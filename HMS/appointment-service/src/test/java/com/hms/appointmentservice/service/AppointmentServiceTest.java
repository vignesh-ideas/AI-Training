package com.hms.appointmentservice.service;

import com.hms.appointmentservice.dto.AppointmentRequest;
import com.hms.appointmentservice.dto.AppointmentResponse;
import com.hms.appointmentservice.entity.Appointment;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import com.hms.appointmentservice.exception.AppointmentNotFoundException;
import com.hms.appointmentservice.repository.AppointmentRepository;
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
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private AppointmentRequest appointmentRequest;
    private Appointment appointment;
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

        // Setup Appointment entity
        appointment = new Appointment();
        appointment.setId(1L);
        appointment.setPatientId(1L);
        appointment.setDoctorId(2L);
        appointment.setAppointmentDate(LocalDateTime.now().plusDays(1));
        appointment.setAppointmentType(AppointmentType.CONSULTATION);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setReason("Regular checkup");
        appointment.setNotes("Patient requested follow-up");
        appointment.setDuration(30);
        appointment.setCreatedAt(LocalDateTime.now());

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
    void createAppointment_Success() {
        // Arrange
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        // Act
        AppointmentResponse response = appointmentService.createAppointment(appointmentRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());
        assertEquals(AppointmentType.CONSULTATION, response.getAppointmentType());
        assertEquals(AppointmentStatus.SCHEDULED, response.getStatus());

        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void getAppointmentById_Success() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        // Act
        AppointmentResponse response = appointmentService.getAppointmentById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getPatientId());
        assertEquals(2L, response.getDoctorId());

        verify(appointmentRepository).findById(1L);
    }

    @Test
    void getAppointmentById_NotFound() {
        // Arrange
        when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.getAppointmentById(999L);
        });

        verify(appointmentRepository).findById(999L);
    }

    @Test
    void getAppointmentsByPatientId_Success() {
        // Arrange
        List<Appointment> appointments = Arrays.asList(appointment);
        when(appointmentRepository.findByPatientId(1L)).thenReturn(appointments);

        // Act
        List<AppointmentResponse> responses = appointmentService.getAppointmentsByPatientId(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(appointmentRepository).findByPatientId(1L);
    }

    @Test
    void getAppointmentsByDoctorId_Success() {
        // Arrange
        List<Appointment> appointments = Arrays.asList(appointment);
        when(appointmentRepository.findByDoctorId(2L)).thenReturn(appointments);

        // Act
        List<AppointmentResponse> responses = appointmentService.getAppointmentsByDoctorId(2L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(appointmentRepository).findByDoctorId(2L);
    }

    @Test
    void getAppointmentsByStatus_Success() {
        // Arrange
        List<Appointment> appointments = Arrays.asList(appointment);
        when(appointmentRepository.findByStatus(AppointmentStatus.SCHEDULED)).thenReturn(appointments);

        // Act
        List<AppointmentResponse> responses = appointmentService.getAppointmentsByStatus(AppointmentStatus.SCHEDULED);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(appointmentRepository).findByStatus(AppointmentStatus.SCHEDULED);
    }

    @Test
    void updateAppointment_Success() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        // Act
        AppointmentResponse response = appointmentService.updateAppointment(1L, appointmentRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());

        verify(appointmentRepository).findById(1L);
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void updateAppointment_NotFound() {
        // Arrange
        when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.updateAppointment(999L, appointmentRequest);
        });

        verify(appointmentRepository).findById(999L);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void cancelAppointment_Success() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        // Act
        AppointmentResponse response = appointmentService.cancelAppointment(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(AppointmentStatus.CANCELLED, response.getStatus());

        verify(appointmentRepository).findById(1L);
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void cancelAppointment_NotFound() {
        // Arrange
        when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.cancelAppointment(999L);
        });

        verify(appointmentRepository).findById(999L);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void deleteAppointment_Success() {
        // Arrange
        when(appointmentRepository.existsById(1L)).thenReturn(true);

        // Act
        appointmentService.deleteAppointment(1L);

        // Assert
        verify(appointmentRepository).existsById(1L);
        verify(appointmentRepository).deleteById(1L);
    }

    @Test
    void deleteAppointment_NotFound() {
        // Arrange
        when(appointmentRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.deleteAppointment(999L);
        });

        verify(appointmentRepository).existsById(999L);
        verify(appointmentRepository, never()).deleteById(any());
    }

    @Test
    void getUpcomingAppointments_Success() {
        // Arrange
        List<Appointment> appointments = Arrays.asList(appointment);
        when(appointmentRepository.findUpcomingAppointments(any(LocalDateTime.class)))
            .thenReturn(appointments);

        // Act
        List<AppointmentResponse> responses = appointmentService.getUpcomingAppointments();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(appointmentRepository).findUpcomingAppointments(any(LocalDateTime.class));
    }

    @Test
    void getAppointmentsByDateRange_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        List<Appointment> appointments = Arrays.asList(appointment);
        when(appointmentRepository.findByAppointmentDateBetween(startDate, endDate))
            .thenReturn(appointments);

        // Act
        List<AppointmentResponse> responses = appointmentService.getAppointmentsByDateRange(startDate, endDate);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(appointmentRepository).findByAppointmentDateBetween(startDate, endDate);
    }
} 