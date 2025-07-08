package com.hms.prescription.controller;

import com.hms.prescription.dto.PrescriptionRequest;
import com.hms.prescription.dto.PrescriptionResponse;
import com.hms.prescription.entity.PrescriptionStatus;
import com.hms.prescription.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;
    
    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescriptionById(@PathVariable Long id) {
        PrescriptionResponse response = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        return ResponseEntity.ok(prescriptions);
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByDoctorId(@PathVariable Long doctorId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
        return ResponseEntity.ok(prescriptions);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<PrescriptionResponse> updatePrescriptionStatus(
            @PathVariable Long id, 
            @RequestParam PrescriptionStatus status) {
        PrescriptionResponse response = prescriptionService.updatePrescriptionStatus(id, status);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<PrescriptionResponse>> getExpiredPrescriptions() {
        List<PrescriptionResponse> expiredPrescriptions = prescriptionService.getExpiredPrescriptions();
        return ResponseEntity.ok(expiredPrescriptions);
    }
} 