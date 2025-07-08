package com.hms.medicalrecordsservice.dto;

import com.hms.medicalrecordsservice.entity.RecordStatus;
import com.hms.medicalrecordsservice.entity.RecordType;

import java.time.LocalDateTime;

public class MedicalRecordResponse {
    
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime recordDate;
    private RecordType type;
    private String diagnosis;
    private String symptoms;
    private String treatment;
    private String medications;
    private String dosage;
    private String duration;
    private String notes;
    private String vitalSigns;
    private String labResults;
    private String imagingResults;
    private LocalDateTime followUpDate;
    private RecordStatus status;
    private Boolean isUrgent;
    private String attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for patient and doctor info
    private String patientName;
    private String doctorName;
    
    // Constructors
    public MedicalRecordResponse() {}
    
    public MedicalRecordResponse(Long id, Long patientId, Long doctorId, LocalDateTime recordDate,
                               RecordType type, String diagnosis, String symptoms, String treatment,
                               String medications, String dosage, String duration, String notes,
                               String vitalSigns, String labResults, String imagingResults,
                               LocalDateTime followUpDate, RecordStatus status, Boolean isUrgent,
                               String attachments, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
        this.type = type;
        this.diagnosis = diagnosis;
        this.symptoms = symptoms;
        this.treatment = treatment;
        this.medications = medications;
        this.dosage = dosage;
        this.duration = duration;
        this.notes = notes;
        this.vitalSigns = vitalSigns;
        this.labResults = labResults;
        this.imagingResults = imagingResults;
        this.followUpDate = followUpDate;
        this.status = status;
        this.isUrgent = isUrgent;
        this.attachments = attachments;
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
    
    public RecordType getType() {
        return type;
    }
    
    public void setType(RecordType type) {
        this.type = type;
    }
    
    public String getDiagnosis() {
        return diagnosis;
    }
    
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
    
    public String getSymptoms() {
        return symptoms;
    }
    
    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
    
    public String getTreatment() {
        return treatment;
    }
    
    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }
    
    public String getMedications() {
        return medications;
    }
    
    public void setMedications(String medications) {
        this.medications = medications;
    }
    
    public String getDosage() {
        return dosage;
    }
    
    public void setDosage(String dosage) {
        this.dosage = dosage;
    }
    
    public String getDuration() {
        return duration;
    }
    
    public void setDuration(String duration) {
        this.duration = duration;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getVitalSigns() {
        return vitalSigns;
    }
    
    public void setVitalSigns(String vitalSigns) {
        this.vitalSigns = vitalSigns;
    }
    
    public String getLabResults() {
        return labResults;
    }
    
    public void setLabResults(String labResults) {
        this.labResults = labResults;
    }
    
    public String getImagingResults() {
        return imagingResults;
    }
    
    public void setImagingResults(String imagingResults) {
        this.imagingResults = imagingResults;
    }
    
    public LocalDateTime getFollowUpDate() {
        return followUpDate;
    }
    
    public void setFollowUpDate(LocalDateTime followUpDate) {
        this.followUpDate = followUpDate;
    }
    
    public RecordStatus getStatus() {
        return status;
    }
    
    public void setStatus(RecordStatus status) {
        this.status = status;
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
    public boolean isActive() {
        return RecordStatus.ACTIVE.equals(status);
    }
    
    public boolean isUrgent() {
        return Boolean.TRUE.equals(isUrgent);
    }
    
    public boolean hasFollowUp() {
        return followUpDate != null;
    }
    
    @Override
    public String toString() {
        return "MedicalRecordResponse{" +
                "id=" + id +
                ", patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", recordDate=" + recordDate +
                ", type=" + type +
                ", diagnosis='" + diagnosis + '\'' +
                ", symptoms='" + symptoms + '\'' +
                ", treatment='" + treatment + '\'' +
                ", medications='" + medications + '\'' +
                ", dosage='" + dosage + '\'' +
                ", duration='" + duration + '\'' +
                ", notes='" + notes + '\'' +
                ", vitalSigns='" + vitalSigns + '\'' +
                ", labResults='" + labResults + '\'' +
                ", imagingResults='" + imagingResults + '\'' +
                ", followUpDate=" + followUpDate +
                ", status=" + status +
                ", isUrgent=" + isUrgent +
                ", attachments='" + attachments + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                '}';
    }
} 