package com.hms.prescription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.hms.prescription.entity.MedicationRoute;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemRequest {
    
    @NotBlank(message = "Medication name is required")
    private String medicationName;
    
    @NotBlank(message = "Dosage is required")
    private String dosage;
    
    @NotBlank(message = "Frequency is required")
    private String frequency;
    
    private String duration;
    
    private String instructions;
    
    private Integer quantity;
    
    private MedicationRoute route;
    
    private Integer refills;
    
    private Boolean isGeneric = false;
} 