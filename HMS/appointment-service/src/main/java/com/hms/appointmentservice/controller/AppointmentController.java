package com.hms.appointmentservice.controller;

import com.hms.appointmentservice.dto.AppointmentRequest;
import com.hms.appointmentservice.dto.AppointmentResponse;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import com.hms.appointmentservice.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse appointment = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatient(patientId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/patient/{patientId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatientAndStatus(
            @PathVariable Long patientId, @PathVariable AppointmentStatus status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatientAndStatus(patientId, status);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorAndStatus(
            @PathVariable Long doctorId, @PathVariable AppointmentStatus status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctorAndStatus(doctorId, status);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByType(@PathVariable AppointmentType type) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByType(type);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<AppointmentResponse> appointments = appointmentService.getUpcomingAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/patient/{patientId}/upcoming")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointmentsByPatient(@PathVariable Long patientId) {
        List<AppointmentResponse> appointments = appointmentService.getUpcomingAppointmentsByPatient(patientId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDateRange(start, end);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorAndDateRange(
            @PathVariable Long doctorId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, start, end);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/patient/{patientId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatientAndDateRange(
            @PathVariable Long patientId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatientAndDateRange(patientId, start, end);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}/from-date")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByDoctorFromDate(
            @PathVariable Long doctorId, @RequestParam String startDate,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").ascending());
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctorFromDate(doctorId, start, pageable);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/patient/{patientId}/from-date")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByPatientFromDate(
            @PathVariable Long patientId, @RequestParam String startDate,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").ascending());
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatientFromDate(patientId, start, pageable);
        return ResponseEntity.ok(appointments);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable Long id, @Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse appointment = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(appointment);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long id, @RequestParam AppointmentStatus status) {
        AppointmentResponse appointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(appointment);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getUrgentScheduledAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getUrgentScheduledAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/reminders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsForReminder(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsForReminder(start, end);
        return ResponseEntity.ok(appointments);
    }
    
    @PatchMapping("/{id}/reminder-sent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Void> markReminderSent(@PathVariable Long id) {
        appointmentService.markReminderSent(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getTotalAppointments() {
        long total = appointmentService.getTotalAppointments();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getAppointmentsByDoctorAndDateRange(
            @PathVariable Long doctorId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        long count = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, start, end);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/patient/{patientId}/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getCompletedAppointmentsByPatient(@PathVariable Long patientId) {
        long count = appointmentService.getCompletedAppointmentsByPatient(patientId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getAppointmentsByStatusCount() {
        List<Object[]> stats = appointmentService.getAppointmentsByStatusCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/by-type")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getAppointmentsByTypeCount() {
        List<Object[]> stats = appointmentService.getAppointmentsByTypeCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = Map.of(
                "status", "UP",
                "service", "Appointment Service"
        );
        return ResponseEntity.ok(response);
    }
} 