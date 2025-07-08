package com.hms.labservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_tests")
@EntityListeners(AuditingEntityListener.class)
public class LabTest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(name = "test_number", unique = true, nullable = false)
    private String testNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType type;
    
    @Column(name = "test_date", nullable = false)
    private LocalDateTime testDate;
    
    @Column(name = "result_date")
    private LocalDateTime resultDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status = TestStatus.PENDING;
    
    @Column(name = "test_results")
    private String testResults;
    
    @Column(name = "normal_range")
    private String normalRange;
    
    @Column(name = "units")
    private String units;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "lab_technician_id")
    private Long labTechnicianId;
    
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
    public LabTest() {}
    
    public LabTest(Long patientId, Long doctorId, String testNumber, TestType type, LocalDateTime testDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.testNumber = testNumber;
        this.type = type;
        this.testDate = testDate;
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
    
    public String getTestNumber() {
        return testNumber;
    }
    
    public void setTestNumber(String testNumber) {
        this.testNumber = testNumber;
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
    
    public TestStatus getStatus() {
        return status;
    }
    
    public void setStatus(TestStatus status) {
        this.status = status;
    }
    
    public String getTestResults() {
        return testResults;
    }
    
    public void setTestResults(String testResults) {
        this.testResults = testResults;
    }
    
    public String getNormalRange() {
        return normalRange;
    }
    
    public void setNormalRange(String normalRange) {
        this.normalRange = normalRange;
    }
    
    public String getUnits() {
        return units;
    }
    
    public void setUnits(String units) {
        this.units = units;
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
    public boolean isPending() {
        return TestStatus.PENDING.equals(status);
    }
    
    public boolean isCompleted() {
        return TestStatus.COMPLETED.equals(status);
    }
    
    public boolean isUrgent() {
        return Boolean.TRUE.equals(isUrgent);
    }
    
    public boolean hasResults() {
        return testResults != null && !testResults.isEmpty();
    }
} 