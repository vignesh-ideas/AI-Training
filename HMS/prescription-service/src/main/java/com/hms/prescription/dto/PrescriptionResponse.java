package com.hms.prescription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.prescription.entity.PrescriptionStatus;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Long appointmentId;
    private String diagnosis;
    private String notes;
    private PrescriptionStatus status;
    private LocalDateTime prescribedDate;
    private LocalDateTime validUntil;
    private List<PrescriptionItemResponse> prescriptionItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 