package com.hms.prescription.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "prescription_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;
    
    @Column(name = "medication_name", nullable = false)
    private String medicationName;
    
    @Column(name = "dosage", nullable = false)
    private String dosage;
    
    @Column(name = "frequency", nullable = false)
    private String frequency;
    
    @Column(name = "duration")
    private String duration;
    
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "route")
    private MedicationRoute route;
    
    @Column(name = "refills")
    private Integer refills;
    
    @Column(name = "is_generic")
    private Boolean isGeneric = false;
} 