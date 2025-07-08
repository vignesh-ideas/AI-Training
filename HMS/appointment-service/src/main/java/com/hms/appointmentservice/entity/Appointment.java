package com.hms.appointmentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@EntityListeners(AuditingEntityListener.class)
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @NotNull(message = "Appointment date is required")
    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType type = AppointmentType.CONSULTATION;
    
    @Column(name = "reason")
    private String reason;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "room_number")
    private String roomNumber;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;
    
    @Column(name = "is_urgent")
    private Boolean isUrgent = false;
    
    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Appointment() {}
    
    public Appointment(Long patientId, Long doctorId, LocalDateTime appointmentDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
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
    
    public boolean isNoShow() {
        return AppointmentStatus.NO_SHOW.equals(status);
    }
    
    public boolean isUrgent() {
        return Boolean.TRUE.equals(isUrgent);
    }
    
    public void calculateEndTime() {
        if (appointmentDate != null && durationMinutes != null) {
            this.endTime = appointmentDate.plusMinutes(durationMinutes);
        }
    }
} 