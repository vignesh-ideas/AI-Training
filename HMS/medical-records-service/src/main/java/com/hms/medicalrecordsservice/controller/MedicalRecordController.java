package com.hms.medicalrecordsservice.controller;

import com.hms.medicalrecordsservice.dto.MedicalRecordRequest;
import com.hms.medicalrecordsservice.dto.MedicalRecordResponse;
import com.hms.medicalrecordsservice.entity.RecordStatus;
import com.hms.medicalrecordsservice.entity.RecordType;
import com.hms.medicalrecordsservice.service.MedicalRecordService;
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
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "*")
public class MedicalRecordController {
    
    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(@Valid @RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse record = medicalRecordService.createMedicalRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecordResponse record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatient(patientId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDoctor(doctorId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatientAndDoctor(
            @PathVariable Long patientId, @PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientAndDoctor(patientId, doctorId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatientAndStatus(
            @PathVariable Long patientId, @PathVariable RecordStatus status) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientAndStatus(patientId, status);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatientAndType(
            @PathVariable Long patientId, @PathVariable RecordType type) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientAndType(patientId, type);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByStatus(@PathVariable RecordStatus status) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByStatus(status);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByType(@PathVariable RecordType type) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByType(type);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatientAndDateRange(
            @PathVariable Long patientId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientAndDateRange(patientId, start, end);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctorAndDateRange(
            @PathVariable Long doctorId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDoctorAndDateRange(doctorId, start, end);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDateRange(start, end);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getUrgentRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getUrgentRecordsByPatient(patientId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/doctor/{doctorId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getUrgentRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getUrgentRecordsByDoctor(doctorId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/follow-up")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getRecordsWithFollowUp(@RequestParam String startDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        List<MedicalRecordResponse> records = medicalRecordService.getRecordsWithFollowUp(start);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/follow-up")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getRecordsWithFollowUpByPatient(@PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getRecordsWithFollowUpByPatient(patientId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/doctor/{doctorId}/follow-up")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getRecordsWithFollowUpByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getRecordsWithFollowUpByDoctor(doctorId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<MedicalRecordResponse>> searchMedicalRecords(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicalRecordResponse> records = medicalRecordService.searchMedicalRecords(searchTerm, pageable);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/search/filtered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<MedicalRecordResponse>> searchMedicalRecordsWithFilters(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) RecordType type,
            @RequestParam(required = false) RecordStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicalRecordResponse> records = medicalRecordService.searchMedicalRecordsWithFilters(
                searchTerm, patientId, doctorId, type, status, pageable);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/patient/{patientId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<MedicalRecordResponse>> getMedicalRecordsByPatientOrdered(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        Page<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientOrdered(patientId, pageable);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/doctor/{doctorId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<MedicalRecordResponse>> getMedicalRecordsByDoctorOrdered(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        Page<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDoctorOrdered(doctorId, pageable);
        return ResponseEntity.ok(records);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable Long id, @Valid @RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse record = medicalRecordService.updateMedicalRecord(id, request);
        return ResponseEntity.ok(record);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecordStatus(
            @PathVariable Long id, @RequestParam RecordStatus status) {
        MedicalRecordResponse record = medicalRecordService.updateMedicalRecordStatus(id, status);
        return ResponseEntity.ok(record);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getTotalMedicalRecords() {
        long total = medicalRecordService.getTotalMedicalRecords();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getRecordsByPatient(@PathVariable Long patientId) {
        long count = medicalRecordService.getRecordsByPatient(patientId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getRecordsByDoctor(@PathVariable Long doctorId) {
        long count = medicalRecordService.getRecordsByDoctor(doctorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getRecordsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        long count = medicalRecordService.getRecordsByDateRange(start, end);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-type")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getRecordsByTypeCount() {
        List<Object[]> stats = medicalRecordService.getRecordsByTypeCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getRecordsByStatusCount() {
        List<Object[]> stats = medicalRecordService.getRecordsByStatusCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = Map.of(
                "status", "UP",
                "service", "Medical Records Service"
        );
        return ResponseEntity.ok(response);
    }
} 