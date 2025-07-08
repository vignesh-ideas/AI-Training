package com.hms.prescription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.prescription.entity.MedicationRoute;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemResponse {
    
    private Long id;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
    private Integer quantity;
    private MedicationRoute route;
    private Integer refills;
    private Boolean isGeneric;
} 