package com.hms.labservice.dto;

import com.hms.labservice.entity.TestStatus;
import com.hms.labservice.entity.TestType;

import java.time.LocalDateTime;

public class LabTestResponse {
    
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String testNumber;
    private TestType type;
    private LocalDateTime testDate;
    private LocalDateTime resultDate;
    private TestStatus status;
    private String testResults;
    private String normalRange;
    private String units;
    private String notes;
    private Long labTechnicianId;
    private Boolean isUrgent;
    private String attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for patient and doctor info
    private String patientName;
    private String doctorName;
    private String labTechnicianName;
    
    // Constructors
    public LabTestResponse() {}
    
    public LabTestResponse(Long id, Long patientId, Long doctorId, String testNumber, TestType type,
                          LocalDateTime testDate, LocalDateTime resultDate, TestStatus status,
                          String testResults, String normalRange, String units, String notes,
                          Long labTechnicianId, Boolean isUrgent, String attachments,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.testNumber = testNumber;
        this.type = type;
        this.testDate = testDate;
        this.resultDate = resultDate;
        this.status = status;
        this.testResults = testResults;
        this.normalRange = normalRange;
        this.units = units;
        this.notes = notes;
        this.labTechnicianId = labTechnicianId;
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
    
    public String getLabTechnicianName() {
        return labTechnicianName;
    }
    
    public void setLabTechnicianName(String labTechnicianName) {
        this.labTechnicianName = labTechnicianName;
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
    
    @Override
    public String toString() {
        return "LabTestResponse{" +
                "id=" + id +
                ", patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", testNumber='" + testNumber + '\'' +
                ", type=" + type +
                ", testDate=" + testDate +
                ", resultDate=" + resultDate +
                ", status=" + status +
                ", testResults='" + testResults + '\'' +
                ", normalRange='" + normalRange + '\'' +
                ", units='" + units + '\'' +
                ", notes='" + notes + '\'' +
                ", labTechnicianId=" + labTechnicianId +
                ", isUrgent=" + isUrgent +
                ", attachments='" + attachments + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", labTechnicianName='" + labTechnicianName + '\'' +
                '}';
    }
} 