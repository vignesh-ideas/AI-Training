package com.hms.appointmentservice.service;

import com.hms.appointmentservice.dto.AppointmentRequest;
import com.hms.appointmentservice.dto.AppointmentResponse;
import com.hms.appointmentservice.entity.Appointment;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import com.hms.appointmentservice.exception.AppointmentNotFoundException;
import com.hms.appointmentservice.exception.AppointmentConflictException;
import com.hms.appointmentservice.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    public AppointmentResponse createAppointment(AppointmentRequest request) {
        // Check for scheduling conflicts
        checkForConflicts(request.getDoctorId(), request.getAppointmentDate(), request.getDurationMinutes());
        
        // Create new appointment
        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setType(request.getType());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setLocation(request.getLocation());
        appointment.setRoomNumber(request.getRoomNumber());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setIsUrgent(request.getIsUrgent());
        appointment.setCreatedBy(request.getCreatedBy());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        
        // Calculate end time
        appointment.calculateEndTime();
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToAppointmentResponse(savedAppointment);
    }
    
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + id));
        return convertToAppointmentResponse(appointment);
    }
    
    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByPatientAndStatus(Long patientId, AppointmentStatus status) {
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndStatus(patientId, status);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByDoctorAndStatus(Long doctorId, AppointmentStatus status) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStatus(doctorId, status);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status) {
        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByType(AppointmentType type) {
        List<Appointment> appointments = appointmentRepository.findByType(type);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getUpcomingAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByDoctor(doctorId, LocalDateTime.now());
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getUpcomingAppointmentsByPatient(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByPatient(patientId, LocalDateTime.now());
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsByPatientAndDateRange(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public Page<AppointmentResponse> getAppointmentsByDoctorFromDate(Long doctorId, LocalDateTime startDate, Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAppointmentsByDoctorFromDate(doctorId, startDate, pageable);
        return appointments.map(this::convertToAppointmentResponse);
    }
    
    public Page<AppointmentResponse> getAppointmentsByPatientFromDate(Long patientId, LocalDateTime startDate, Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAppointmentsByPatientFromDate(patientId, startDate, pageable);
        return appointments.map(this::convertToAppointmentResponse);
    }
    
    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + id));
        
        // Check for conflicts if date/time is being changed
        if (!appointment.getAppointmentDate().equals(request.getAppointmentDate()) || 
            !appointment.getDoctorId().equals(request.getDoctorId())) {
            checkForConflicts(request.getDoctorId(), request.getAppointmentDate(), request.getDurationMinutes());
        }
        
        // Update appointment fields
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setType(request.getType());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setLocation(request.getLocation());
        appointment.setRoomNumber(request.getRoomNumber());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setIsUrgent(request.getIsUrgent());
        
        // Recalculate end time
        appointment.calculateEndTime();
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToAppointmentResponse(updatedAppointment);
    }
    
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + id));
        
        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToAppointmentResponse(updatedAppointment);
    }
    
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new AppointmentNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }
    
    public List<AppointmentResponse> getUrgentScheduledAppointments() {
        List<Appointment> appointments = appointmentRepository.findUrgentScheduledAppointments();
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public List<AppointmentResponse> getAppointmentsForReminder(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsForReminder(startDate, endDate);
        return appointments.stream().map(this::convertToAppointmentResponse).toList();
    }
    
    public void markReminderSent(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + appointmentId));
        
        appointment.setReminderSent(true);
        appointmentRepository.save(appointment);
    }
    
    public long getTotalAppointments() {
        return appointmentRepository.count();
    }
    
    public long getAppointmentsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.countAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate);
    }
    
    public long getCompletedAppointmentsByPatient(Long patientId) {
        return appointmentRepository.countCompletedAppointmentsByPatient(patientId);
    }
    
    public List<Object[]> getAppointmentsByStatusCount() {
        return appointmentRepository.countAppointmentsByStatus();
    }
    
    public List<Object[]> getAppointmentsByTypeCount() {
        return appointmentRepository.countAppointmentsByType();
    }
    
    private void checkForConflicts(Long doctorId, LocalDateTime appointmentDate, Integer durationMinutes) {
        LocalDateTime endTime = appointmentDate.plusMinutes(durationMinutes);
        
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndDateRange(
                doctorId, appointmentDate, endTime);
        
        if (!existingAppointments.isEmpty()) {
            throw new AppointmentConflictException("Appointment conflicts with existing schedule for doctor: " + doctorId);
        }
    }
    
    private AppointmentResponse convertToAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getAppointmentDate(),
                appointment.getEndTime(),
                appointment.getStatus(),
                appointment.getType(),
                appointment.getReason(),
                appointment.getNotes(),
                appointment.getLocation(),
                appointment.getRoomNumber(),
                appointment.getDurationMinutes(),
                appointment.getIsUrgent(),
                appointment.getReminderSent(),
                appointment.getCreatedBy(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }
} 