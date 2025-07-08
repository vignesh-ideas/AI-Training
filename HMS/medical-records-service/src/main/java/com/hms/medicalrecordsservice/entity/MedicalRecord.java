package com.hms.medicalrecordsservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@EntityListeners(AuditingEntityListener.class)
public class MedicalRecord {
    
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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordType type;
    
    @Column(name = "diagnosis")
    private String diagnosis;
    
    @Column(name = "symptoms")
    private String symptoms;
    
    @Column(name = "treatment")
    private String treatment;
    
    @Column(name = "medications")
    private String medications;
    
    @Column(name = "dosage")
    private String dosage;
    
    @Column(name = "duration")
    private String duration;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "vital_signs")
    private String vitalSigns;
    
    @Column(name = "lab_results")
    private String labResults;
    
    @Column(name = "imaging_results")
    private String imagingResults;
    
    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordStatus status = RecordStatus.ACTIVE;
    
    @Column(name = "is_urgent")
    private Boolean isUrgent = false;
    
    @Column(name = "attachments")
    private String attachments;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public MedicalRecord() {}
    
    public MedicalRecord(Long patientId, Long doctorId, LocalDateTime recordDate, RecordType type) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.recordDate = recordDate;
        this.type = type;
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
} 