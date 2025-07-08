package com.hms.vitalsservice.controller;

import com.hms.vitalsservice.dto.VitalSignsRequest;
import com.hms.vitalsservice.dto.VitalSignsResponse;
import com.hms.vitalsservice.entity.VitalStatus;
import com.hms.vitalsservice.service.VitalSignsService;
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
@RequestMapping("/api/vital-signs")
@CrossOrigin(origins = "*")
public class VitalSignsController {
    
    @Autowired
    private VitalSignsService vitalSignsService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<VitalSignsResponse> createVitalSigns(@Valid @RequestBody VitalSignsRequest request) {
        VitalSignsResponse vitalSigns = vitalSignsService.createVitalSigns(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vitalSigns);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<VitalSignsResponse> getVitalSignsById(@PathVariable Long id) {
        VitalSignsResponse vitalSigns = vitalSignsService.getVitalSignsById(id);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByPatient(@PathVariable Long patientId) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatient(patientId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByDoctor(@PathVariable Long doctorId) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByDoctor(doctorId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByPatientAndDoctor(
            @PathVariable Long patientId, @PathVariable Long doctorId) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatientAndDoctor(patientId, doctorId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByPatientAndStatus(
            @PathVariable Long patientId, @PathVariable VitalStatus status) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatientAndStatus(patientId, status);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByStatus(@PathVariable VitalStatus status) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByStatus(status);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByPatientAndDateRange(
            @PathVariable Long patientId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatientAndDateRange(patientId, start, end);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByDoctorAndDateRange(
            @PathVariable Long doctorId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByDoctorAndDateRange(doctorId, start, end);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByDateRange(start, end);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getUrgentVitalsByPatient(@PathVariable Long patientId) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getUrgentVitalsByPatient(patientId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/doctor/{doctorId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getUrgentVitalsByDoctor(@PathVariable Long doctorId) {
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getUrgentVitalsByDoctor(doctorId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<VitalSignsResponse>> getVitalSignsByPatientOrdered(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        Page<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatientOrdered(patientId, pageable);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/doctor/{doctorId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<VitalSignsResponse>> getVitalSignsByDoctorOrdered(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        Page<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByDoctorOrdered(doctorId, pageable);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/recent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getRecentVitalSignsByPatient(
            @PathVariable Long patientId, @RequestParam String startDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getRecentVitalSignsByPatient(patientId, start);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/patient/{patientId}/latest")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<VitalSignsResponse> getLatestVitalSignsByPatient(@PathVariable Long patientId) {
        VitalSignsResponse vitalSigns = vitalSignsService.getLatestVitalSignsByPatient(patientId);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<VitalSignsResponse> updateVitalSigns(
            @PathVariable Long id, @Valid @RequestBody VitalSignsRequest request) {
        VitalSignsResponse vitalSigns = vitalSignsService.updateVitalSigns(id, request);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<VitalSignsResponse> updateVitalSignsStatus(
            @PathVariable Long id, @RequestParam VitalStatus status) {
        VitalSignsResponse vitalSigns = vitalSignsService.updateVitalSignsStatus(id, status);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteVitalSigns(@PathVariable Long id) {
        vitalSignsService.deleteVitalSigns(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getTotalVitalSigns() {
        long total = vitalSignsService.getTotalVitalSigns();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getVitalSignsByPatient(@PathVariable Long patientId) {
        long count = vitalSignsService.getVitalSignsByPatient(patientId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getVitalSignsByDoctor(@PathVariable Long doctorId) {
        long count = vitalSignsService.getVitalSignsByDoctor(doctorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getVitalSignsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        long count = vitalSignsService.getVitalSignsByDateRange(start, end);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getVitalSignsByStatusCount() {
        List<Object[]> stats = vitalSignsService.getVitalSignsByStatusCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/patient/{patientId}/date-range/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<VitalSignsResponse>> getVitalSignsByPatientAndDateRangeOrdered(
            @PathVariable Long patientId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<VitalSignsResponse> vitalSigns = vitalSignsService.getVitalSignsByPatientAndDateRangeOrdered(patientId, start, end);
        return ResponseEntity.ok(vitalSigns);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = Map.of(
                "status", "UP",
                "service", "Vital Signs Service"
        );
        return ResponseEntity.ok(response);
    }
} 