package com.hms.labservice.controller;

import com.hms.labservice.dto.LabTestRequest;
import com.hms.labservice.dto.LabTestResponse;
import com.hms.labservice.entity.TestStatus;
import com.hms.labservice.entity.TestType;
import com.hms.labservice.service.LabTestService;
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
@RequestMapping("/api/lab-tests")
@CrossOrigin(origins = "*")
public class LabTestController {
    
    @Autowired
    private LabTestService labTestService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<LabTestResponse> createLabTest(@Valid @RequestBody LabTestRequest request) {
        LabTestResponse labTest = labTestService.createLabTest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(labTest);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabTestResponse> getLabTestById(@PathVariable Long id) {
        LabTestResponse labTest = labTestService.getLabTestById(id);
        return ResponseEntity.ok(labTest);
    }
    
    @GetMapping("/test-number/{testNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabTestResponse> getLabTestByTestNumber(@PathVariable String testNumber) {
        LabTestResponse labTest = labTestService.getLabTestByTestNumber(testNumber);
        return ResponseEntity.ok(labTest);
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByPatient(@PathVariable Long patientId) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByPatient(patientId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByDoctor(@PathVariable Long doctorId) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByDoctor(doctorId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/technician/{labTechnicianId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByLabTechnician(@PathVariable Long labTechnicianId) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByLabTechnician(labTechnicianId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/patient/{patientId}/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByPatientAndDoctor(
            @PathVariable Long patientId, @PathVariable Long doctorId) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByPatientAndDoctor(patientId, doctorId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/patient/{patientId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByPatientAndStatus(
            @PathVariable Long patientId, @PathVariable TestStatus status) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByPatientAndStatus(patientId, status);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByStatus(@PathVariable TestStatus status) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByStatus(status);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByType(@PathVariable TestType type) {
        List<LabTestResponse> labTests = labTestService.getLabTestsByType(type);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/patient/{patientId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByPatientAndDateRange(
            @PathVariable Long patientId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<LabTestResponse> labTests = labTestService.getLabTestsByPatientAndDateRange(patientId, start, end);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByDoctorAndDateRange(
            @PathVariable Long doctorId, @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<LabTestResponse> labTests = labTestService.getLabTestsByDoctorAndDateRange(doctorId, start, end);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getLabTestsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<LabTestResponse> labTests = labTestService.getLabTestsByDateRange(start, end);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/patient/{patientId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getUrgentTestsByPatient(@PathVariable Long patientId) {
        List<LabTestResponse> labTests = labTestService.getUrgentTestsByPatient(patientId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/doctor/{doctorId}/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getUrgentTestsByDoctor(@PathVariable Long doctorId) {
        List<LabTestResponse> labTests = labTestService.getUrgentTestsByDoctor(doctorId);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getPendingTests() {
        List<LabTestResponse> labTests = labTestService.getPendingTests();
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/in-progress")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getInProgressTests() {
        List<LabTestResponse> labTests = labTestService.getInProgressTests();
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/completed-without-results")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<LabTestResponse>> getCompletedTestsWithoutResults() {
        List<LabTestResponse> labTests = labTestService.getCompletedTestsWithoutResults();
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/patient/{patientId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Page<LabTestResponse>> getLabTestsByPatientOrdered(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("testDate").descending());
        Page<LabTestResponse> labTests = labTestService.getLabTestsByPatientOrdered(patientId, pageable);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/doctor/{doctorId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Page<LabTestResponse>> getLabTestsByDoctorOrdered(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("testDate").descending());
        Page<LabTestResponse> labTests = labTestService.getLabTestsByDoctorOrdered(doctorId, pageable);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/technician/{labTechnicianId}/ordered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Page<LabTestResponse>> getLabTestsByLabTechnicianOrdered(
            @PathVariable Long labTechnicianId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("testDate").descending());
        Page<LabTestResponse> labTests = labTestService.getLabTestsByLabTechnicianOrdered(labTechnicianId, pageable);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Page<LabTestResponse>> searchLabTests(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<LabTestResponse> labTests = labTestService.searchLabTests(searchTerm, pageable);
        return ResponseEntity.ok(labTests);
    }
    
    @GetMapping("/search/filtered")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Page<LabTestResponse>> searchLabTestsWithFilters(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) TestType type,
            @RequestParam(required = false) TestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<LabTestResponse> labTests = labTestService.searchLabTestsWithFilters(
                searchTerm, patientId, doctorId, type, status, pageable);
        return ResponseEntity.ok(labTests);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<LabTestResponse> updateLabTest(
            @PathVariable Long id, @Valid @RequestBody LabTestRequest request) {
        LabTestResponse labTest = labTestService.updateLabTest(id, request);
        return ResponseEntity.ok(labTest);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabTestResponse> updateLabTestStatus(
            @PathVariable Long id, @RequestParam TestStatus status) {
        LabTestResponse labTest = labTestService.updateLabTestStatus(id, status);
        return ResponseEntity.ok(labTest);
    }
    
    @PatchMapping("/{id}/results")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabTestResponse> updateLabTestResults(
            @PathVariable Long id,
            @RequestParam String testResults,
            @RequestParam(required = false) String normalRange,
            @RequestParam(required = false) String units) {
        LabTestResponse labTest = labTestService.updateLabTestResults(id, testResults, normalRange, units);
        return ResponseEntity.ok(labTest);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteLabTest(@PathVariable Long id) {
        labTestService.deleteLabTest(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getTotalLabTests() {
        long total = labTestService.getTotalLabTests();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getLabTestsByPatient(@PathVariable Long patientId) {
        long count = labTestService.getLabTestsByPatient(patientId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getLabTestsByDoctor(@PathVariable Long doctorId) {
        long count = labTestService.getLabTestsByDoctor(doctorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getLabTestsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        long count = labTestService.getLabTestsByDateRange(start, end);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-type")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<Object[]>> getLabTestsByTypeCount() {
        List<Object[]> stats = labTestService.getLabTestsByTypeCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<List<Object[]>> getLabTestsByStatusCount() {
        List<Object[]> stats = labTestService.getLabTestsByStatusCount();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getPendingTestsCount() {
        long count = labTestService.getPendingTestsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/in-progress")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getInProgressTestsCount() {
        long count = labTestService.getInProgressTestsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<Long> getCompletedTestsCount() {
        long count = labTestService.getCompletedTestsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = Map.of(
                "status", "UP",
                "service", "Lab Service"
        );
        return ResponseEntity.ok(response);
    }
} 