package com.hms.appointmentservice.repository;

import com.hms.appointmentservice.entity.Appointment;
import com.hms.appointmentservice.entity.AppointmentStatus;
import com.hms.appointmentservice.entity.AppointmentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    
    List<Appointment> findByStatus(AppointmentStatus status);
    
    List<Appointment> findByType(AppointmentType type);
    
    List<Appointment> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId, 
                                                @Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByPatientIdAndDateRange(@Param("patientId") Long patientId, 
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate >= :startDate AND a.status = 'SCHEDULED'")
    List<Appointment> findUpcomingAppointmentsByDoctor(@Param("doctorId") Long doctorId, 
                                                      @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId AND a.appointmentDate >= :startDate AND a.status = 'SCHEDULED'")
    List<Appointment> findUpcomingAppointmentsByPatient(@Param("patientId") Long patientId, 
                                                       @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND a.status = :status")
    List<Appointment> findByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate, 
                                             @Param("status") AppointmentStatus status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    long countAppointmentsByDoctorAndDateRange(@Param("doctorId") Long doctorId, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patientId = :patientId AND a.status = 'COMPLETED'")
    long countCompletedAppointmentsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countAppointmentsByStatus();
    
    @Query("SELECT a.type, COUNT(a) FROM Appointment a GROUP BY a.type")
    List<Object[]> countAppointmentsByType();
    
    @Query("SELECT a FROM Appointment a WHERE a.isUrgent = true AND a.status = 'SCHEDULED' ORDER BY a.appointmentDate")
    List<Appointment> findUrgentScheduledAppointments();
    
    @Query("SELECT a FROM Appointment a WHERE a.reminderSent = false AND a.appointmentDate BETWEEN :startDate AND :endDate AND a.status = 'SCHEDULED'")
    List<Appointment> findAppointmentsForReminder(@Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate >= :startDate ORDER BY a.appointmentDate")
    Page<Appointment> findAppointmentsByDoctorFromDate(@Param("doctorId") Long doctorId, 
                                                      @Param("startDate") LocalDateTime startDate, 
                                                      Pageable pageable);
    
    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId AND a.appointmentDate >= :startDate ORDER BY a.appointmentDate")
    Page<Appointment> findAppointmentsByPatientFromDate(@Param("patientId") Long patientId, 
                                                       @Param("startDate") LocalDateTime startDate, 
                                                       Pageable pageable);
} 