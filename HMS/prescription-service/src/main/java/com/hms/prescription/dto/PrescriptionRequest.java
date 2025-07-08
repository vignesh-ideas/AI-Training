package com.hms.prescription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private Long appointmentId;
    
    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;
    
    private String notes;
    
    private LocalDateTime validUntil;
    
    @NotNull(message = "Prescription items are required")
    private List<PrescriptionItemRequest> prescriptionItems;
} 