package com.hms.vitalsservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
@EntityListeners(AuditingEntityListener.class)
public class VitalSigns {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(name = "record_date", nullable = false)
    private LocalDateTime recordDate;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;
    
    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;
    
    @Column(name = "heart_rate")
    private Integer heartRate;
    
    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;
    
    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation;
    
    @Column(name = "height")
    private Double height;
    
    @Column(name = "weight")
    private Double weight;
    
    @Column(name = "bmi")
    private Double bmi;
    
    @Column(name = "pain_level")
    private Integer painLevel;
    
    @Column(name = "blood_sugar")
    private Double bloodSugar;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VitalStatus status = VitalStatus.NORMAL;
    
    @Column(name = "is_urgent")
    private Boolean isUrgent = false;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public VitalSigns() {}
    
    public VitalSigns(Long patientId, Long doctorId, LocalDateTime recordDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getPatientId() {
        return patientId;
    }
    
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    
    public Long getDoctorId() {
        return doctorId;
    }
    
    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
    
    public LocalDateTime getRecordDate() {
        return recordDate;
    }
    
    public void setRecordDate(LocalDateTime recordDate) {
        this.recordDate = recordDate;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public Integer getBloodPressureSystolic() {
        return bloodPressureSystolic;
    }
    
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) {
        this.bloodPressureSystolic = bloodPressureSystolic;
    }
    
    public Integer getBloodPressureDiastolic() {
        return bloodPressureDiastolic;
    }
    
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) {
        this.bloodPressureDiastolic = bloodPressureDiastolic;
    }
    
    public Integer getHeartRate() {
        return heartRate;
    }
    
    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }
    
    public Integer getRespiratoryRate() {
        return respiratoryRate;
    }
    
    public void setRespiratoryRate(Integer respiratoryRate) {
        this.respiratoryRate = respiratoryRate;
    }
    
    public Double getOxygenSaturation() {
        return oxygenSaturation;
    }
    
    public void setOxygenSaturation(Double oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }
    
    public Double getHeight() {
        return height;
    }
    
    public void setHeight(Double height) {
        this.height = height;
    }
    
    public Double getWeight() {
        return weight;
    }
    
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    
    public Double getBmi() {
        return bmi;
    }
    
    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }
    
    public Integer getPainLevel() {
        return painLevel;
    }
    
    public void setPainLevel(Integer painLevel) {
        this.painLevel = painLevel;
    }
    
    public Double getBloodSugar() {
        return bloodSugar;
    }
    
    public void setBloodSugar(Double bloodSugar) {
        this.bloodSugar = bloodSugar;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public VitalStatus getStatus() {
        return status;
    }
    
    public void setStatus(VitalStatus status) {
        this.status = status;
    }
    
    public Boolean getIsUrgent() {
        return isUrgent;
    }
    
    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public boolean isNormal() {
        return VitalStatus.NORMAL.equals(status);
    }
    
    public boolean isUrgent() {
        return Boolean.TRUE.equals(isUrgent);
    }
    
    public String getBloodPressure() {
        if (bloodPressureSystolic != null && bloodPressureDiastolic != null) {
            return bloodPressureSystolic + "/" + bloodPressureDiastolic;
        }
        return null;
    }
    
    public void calculateBmi() {
        if (height != null && weight != null && height > 0) {
            double heightInMeters = height / 100.0; // Convert cm to meters
            this.bmi = weight / (heightInMeters * heightInMeters);
        }
    }
} 