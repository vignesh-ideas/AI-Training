package com.hms.appointmentservice.dto;

import com.hms.appointmentservice.entity.AppointmentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;

import java.time.LocalDateTime;

public class AppointmentRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Appointment date is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;
    
    private LocalDateTime endTime;
    
    private AppointmentType type = AppointmentType.CONSULTATION;
    
    private String reason;
    
    private String notes;
    
    private String location;
    
    private String roomNumber;
    
    private Integer durationMinutes = 30;
    
    private Boolean isUrgent = false;
    
    private Long createdBy;
    
    // Constructors
    public AppointmentRequest() {}
    
    public AppointmentRequest(Long patientId, Long doctorId, LocalDateTime appointmentDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
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
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    @Override
    public String toString() {
        return "AppointmentRequest{" +
                "patientId=" + patientId +
                ", doctorId=" + doctorId +
                ", appointmentDate=" + appointmentDate +
                ", endTime=" + endTime +
                ", type=" + type +
                ", reason='" + reason + '\'' +
                ", notes='" + notes + '\'' +
                ", location='" + location + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", isUrgent=" + isUrgent +
                ", createdBy=" + createdBy +
                '}';
    }
} 