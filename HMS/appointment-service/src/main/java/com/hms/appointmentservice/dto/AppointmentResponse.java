package com.hms.appointmentservice.dto;

import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;

import java.time.LocalDateTime;

public class AppointmentResponse {
    
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private LocalDateTime endTime;
    private AppointmentStatus status;
    private AppointmentType type;
    private String reason;
    private String notes;
    private String location;
    private String roomNumber;
    private Integer durationMinutes;
    private Boolean isUrgent;
    private Boolean reminderSent;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for patient and doctor info
    private String patientName;
    private String doctorName;
    
    // Constructors
    public AppointmentResponse() {}
    
    public AppointmentResponse(Long id, Long patientId, Long doctorId, LocalDateTime appointmentDate,
                             LocalDateTime endTime, AppointmentStatus status, AppointmentType type,
                             String reason, String notes, String location, String roomNumber,
                             Integer durationMinutes, Boolean isUrgent, Boolean reminderSent,
                             Long createdBy, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.endTime = endTime;
        this.status = status;
        this.type = type;
        this.reason = reason;
        this.notes = notes;
        this.location = location;
        this.roomNumber = roomNumber;
        this.durationMinutes = durationMinutes;
        this.isUrgent = isUrgent;
        this.reminderSent = reminderSent;
        this.createdBy = createdBy;
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
    
    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }
    
    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public AppointmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
    
    public AppointmentType getType() {
        return type;
    }
    
    public void setType(AppointmentType type) {
        this.type = type;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getRoomNumber() {
        return roomNumber;
    }
    
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public Boolean getIsUrgent() {
        return isUrgent;
    }
    
    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
    
    public Boolean getReminderSent() {
        return reminderSent;
    }
    
    public void setReminderSent(Boolean reminderSent) {
        this.reminderSent = reminderSent;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
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
    public boolean isScheduled() {
        return AppointmentStatus.SCHEDULED.equals(status);
    }
    
    public boolean isCompleted() {
        return AppointmentStatus.COMPLETED.equals(status);
    }
    
    public boolean isCancelled() {
        return AppointmentStatus.CANCELLED.equals(status);
    }
    
    public boolean isUrgent() {
        return Boolean.TRUE.equals(isUrgent);
    }
    
    public boolean isInProgress() {
        return AppointmentStatus.IN_PROGRESS.equals(status);
    }
    
    @Override
    public String toString() {
        return "AppointmentResponse{" +
                "id=" + id +
                ", patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", appointmentDate=" + appointmentDate +
                ", endTime=" + endTime +
                ", status=" + status +
                ", type=" + type +
                ", reason='" + reason + '\'' +
                ", notes='" + notes + '\'' +
                ", location='" + location + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", isUrgent=" + isUrgent +
                ", reminderSent=" + reminderSent +
                ", createdBy=" + createdBy +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", patientName='" + patientName + '\'' +
                ", doctorName='" + doctorName + '\'' +
                '}';
    }
} 