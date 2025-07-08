package com.hms.prescription.repository;

import com.hms.prescription.entity.Prescription;
import com.hms.prescription.entity.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPatientId(Long patientId);
    
    List<Prescription> findByDoctorId(Long doctorId);
    
    List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);
    
    List<Prescription> findByDoctorIdAndStatus(Long doctorId, PrescriptionStatus status);
    
    List<Prescription> findByAppointmentId(Long appointmentId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patientId = :patientId AND p.prescribedDate >= :startDate")
    List<Prescription> findByPatientIdAndDateAfter(@Param("patientId") Long patientId, 
                                                   @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.status = :status AND p.validUntil < :currentDate")
    List<Prescription> findExpiredPrescriptions(@Param("status") PrescriptionStatus status, 
                                               @Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.patientId = :patientId AND p.status = :status")
    Long countByPatientIdAndStatus(@Param("patientId") Long patientId, 
                                   @Param("status") PrescriptionStatus status);
} 