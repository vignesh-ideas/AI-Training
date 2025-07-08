package com.hms.vitalsservice.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class VitalSignsRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Record date is required")
    private LocalDateTime recordDate;
    
    private Double temperature;
    
    private Integer bloodPressureSystolic;
    
    private Integer bloodPressureDiastolic;
    
    private Integer heartRate;
    
    private Integer respiratoryRate;
    
    private Double oxygenSaturation;
    
    private Double height;
    
    private Double weight;
    
    private Integer painLevel;
    
    private Double bloodSugar;
    
    private String notes;
    
    private Boolean isUrgent = false;
    
    // Constructors
    public VitalSignsRequest() {}
    
    public VitalSignsRequest(Long patientId, Long doctorId, LocalDateTime recordDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
    }
    
    // Getters and Setters
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
    
    public Boolean getIsUrgent() {
        return isUrgent;
    }
    
    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
    
    @Override
    public String toString() {
        return "VitalSignsRequest{" +
                "patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", recordDate=" + recordDate +
                ", temperature=" + temperature +
                ", bloodPressureSystolic=" + bloodPressureSystolic +
                ", bloodPressureDiastolic=" + bloodPressureDiastolic +
                ", heartRate=" + heartRate +
                ", respiratoryRate=" + respiratoryRate +
                ", oxygenSaturation=" + oxygenSaturation +
                ", height=" + height +
                ", weight=" + weight +
                ", painLevel=" + painLevel +
                ", bloodSugar=" + bloodSugar +
                ", notes='" + notes + '\'' +
                ", isUrgent=" + isUrgent +
                '}';
    }
} 