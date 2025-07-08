package com.hms.vitalsservice.dto;

import com.hms.vitalsservice.entity.VitalStatus;

import java.time.LocalDateTime;

public class VitalSignsResponse {
    
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime recordDate;
    private Double temperature;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Integer respiratoryRate;
    private Double oxygenSaturation;
    private Double height;
    private Double weight;
    private Double bmi;
    private Integer painLevel;
    private Double bloodSugar;
    private String notes;
    private VitalStatus status;
    private Boolean isUrgent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for patient and doctor info
    private String patientName;
    private String doctorName;
    
    // Constructors
    public VitalSignsResponse() {}
    
    public VitalSignsResponse(Long id, Long patientId, Long doctorId, LocalDateTime recordDate,
                            Double temperature, Integer bloodPressureSystolic, Integer bloodPressureDiastolic,
                            Integer heartRate, Integer respiratoryRate, Double oxygenSaturation,
                            Double height, Double weight, Double bmi, Integer painLevel, Double bloodSugar,
                            String notes, VitalStatus status, Boolean isUrgent, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
        this.temperature = temperature;
        this.bloodPressureSystolic = bloodPressureSystolic;
        this.bloodPressureDiastolic = bloodPressureDiastolic;
        this.heartRate = heartRate;
        this.respiratoryRate = respiratoryRate;
        this.oxygenSaturation = oxygenSaturation;
        this.height = height;
        this.weight = weight;
        this.bmi = bmi;
        this.painLevel = painLevel;
        this.bloodSugar = bloodSugar;
        this.notes = notes;
        this.status = status;
        this.isUrgent = isUrgent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    public String getPatientName() {
        return patientName;
    }
    
    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
    
    public String getDoctorName() {
        return doctorName;
    }
    
    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
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
    
    @Override
    public String toString() {
        return "VitalSignsResponse{" +
                "id=" + id +
                ", patientId=" + patientId +
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
                ", bmi=" + bmi +
                ", painLevel=" + painLevel +
                ", bloodSugar=" + bloodSugar +
                ", notes='" + notes + '\'' +
                ", status=" + status +
                ", isUrgent=" + isUrgent +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                '}';
    }
} 