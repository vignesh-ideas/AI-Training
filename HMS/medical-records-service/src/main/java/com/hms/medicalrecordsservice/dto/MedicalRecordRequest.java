package com.hms.medicalrecordsservice.dto;

import com.hms.medicalrecordsservice.entity.RecordType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class MedicalRecordRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Record date is required")
    private LocalDateTime recordDate;
    
    @NotNull(message = "Record type is required")
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
    
    private Boolean isUrgent = false;
    
    private String attachments;
    
    // Constructors
    public MedicalRecordRequest() {}
    
    public MedicalRecordRequest(Long patientId, Long doctorId, LocalDateTime recordDate, RecordType type) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
        this.type = type;
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
        return "MedicalRecordRequest{" +
                "patientId=" + patientId +
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
                ", isUrgent=" + isUrgent +
                ", attachments='" + attachments + '\'' +
                '}';
    }
} 