package com.hms.labservice.dto;

import com.hms.labservice.entity.TestType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class LabTestRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Test type is required")
    private TestType type;
    
    @NotNull(message = "Test date is required")
    private LocalDateTime testDate;
    
    private LocalDateTime resultDate;
    
    private String notes;
    
    private Long labTechnicianId;
    
    private Boolean isUrgent = false;
    
    private String attachments;
    
    // Constructors
    public LabTestRequest() {}
    
    public LabTestRequest(Long patientId, Long doctorId, TestType type, LocalDateTime testDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.type = type;
        this.testDate = testDate;
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
    
    public TestType getType() {
        return type;
    }
    
    public void setType(TestType type) {
        this.type = type;
    }
    
    public LocalDateTime getTestDate() {
        return testDate;
    }
    
    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }
    
    public LocalDateTime getResultDate() {
        return resultDate;
    }
    
    public void setResultDate(LocalDateTime resultDate) {
        this.resultDate = resultDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Long getLabTechnicianId() {
        return labTechnicianId;
    }
    
    public void setLabTechnicianId(Long labTechnicianId) {
        this.labTechnicianId = labTechnicianId;
    }
    
    public Boolean getIsUrgent() {
        return isUrgent;
    }
    
    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
    
    public String getAttachments() {
        return attachments;
    }
    
    public void setAttachments(String attachments) {
        this.attachments = attachments;
    }
    
    @Override
    public String toString() {
        return "LabTestRequest{" +
                "patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", type=" + type +
                ", testDate=" + testDate +
                ", resultDate=" + resultDate +
                ", notes='" + notes + '\'' +
                ", labTechnicianId=" + labTechnicianId +
                ", isUrgent=" + isUrgent +
                ", attachments='" + attachments + '\'' +
                '}';
    }
} 