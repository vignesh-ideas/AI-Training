package com.hms.patientservice.controller;

import com.hms.patientservice.dto.PatientRegistrationRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.PatientStatus;
import com.hms.patientservice.service.PatientService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<PatientResponse> registerPatient(@Valid @RequestBody PatientRegistrationRequest request) {
        PatientResponse patient = patientService.registerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(patient);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long id) {
        PatientResponse patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }
    
    @GetMapping("/number/{patientNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<PatientResponse> getPatientByPatientNumber(@PathVariable String patientNumber) {
        PatientResponse patient = patientService.getPatientByPatientNumber(patientNumber);
        return ResponseEntity.ok(patient);
    }
    
    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<PatientResponse> getPatientByEmail(@PathVariable String email) {
        PatientResponse patient = patientService.getPatientByEmail(email);
        return ResponseEntity.ok(patient);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<PatientResponse>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PatientResponse> patients = patientService.getAllPatients(pageable);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<PatientResponse>> searchPatients(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PatientResponse> patients = patientService.searchPatients(searchTerm, pageable);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/search/filtered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<PatientResponse>> searchPatientsWithFilters(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) PatientStatus status,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PatientResponse> patients = patientService.searchPatientsWithFilters(searchTerm, status, gender, doctorId, pageable);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getPatientsByStatus(@PathVariable PatientStatus status) {
        List<PatientResponse> patients = patientService.getPatientsByStatus(status);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/gender/{gender}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getPatientsByGender(@PathVariable Gender gender) {
        List<PatientResponse> patients = patientService.getPatientsByGender(gender);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getPatientsByDoctor(@PathVariable Long doctorId) {
        List<PatientResponse> patients = patientService.getPatientsByDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/doctor/{doctorId}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getActivePatientsByDoctor(@PathVariable Long doctorId) {
        List<PatientResponse> patients = patientService.getActivePatientsByDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRegistrationRequest request) {
        PatientResponse patient = patientService.updatePatient(id, request);
        return ResponseEntity.ok(patient);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<PatientResponse> updatePatientStatus(
            @PathVariable Long id,
            @RequestParam PatientStatus status) {
        PatientResponse patient = patientService.updatePatientStatus(id, status);
        return ResponseEntity.ok(patient);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getTotalPatients() {
        long total = patientService.getTotalPatients();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/created-between")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getPatientsCreatedBetween(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        long count = patientService.getPatientsCreatedBetween(start, end);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-gender")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getPatientsByGenderCount() {
        List<Object[]> stats = patientService.getPatientsByGenderCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Object[]>> getPatientsByStatusCount() {
        List<Object[]> stats = patientService.getPatientsByStatusCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/age-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getPatientsByAgeRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<PatientResponse> patients = patientService.getPatientsByAgeRange(start, end);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/created-between")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getPatientsCreatedBetween(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<PatientResponse> patients = patientService.getPatientsCreatedBetween(start, end);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/doctor/{doctorId}/active-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Long> getActivePatientsByDoctorCount(@PathVariable Long doctorId) {
        long count = patientService.getActivePatientsByDoctor(doctorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/check/patient-number/{patientNumber}")
    public ResponseEntity<Boolean> checkPatientNumberExists(@PathVariable String patientNumber) {
        boolean exists = patientService.existsByPatientNumber(patientNumber);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = patientService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Patient Service");
        return ResponseEntity.ok(response);
    }
} 