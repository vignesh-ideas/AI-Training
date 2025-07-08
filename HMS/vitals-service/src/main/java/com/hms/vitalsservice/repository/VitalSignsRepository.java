package com.hms.vitalsservice.repository;

import com.hms.vitalsservice.entity.VitalSigns;
import com.hms.vitalsservice.entity.VitalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VitalSignsRepository extends JpaRepository<VitalSigns, Long> {
    
    List<VitalSigns> findByPatientId(Long patientId);
    
    List<VitalSigns> findByDoctorId(Long doctorId);
    
    List<VitalSigns> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    
    List<VitalSigns> findByPatientIdAndStatus(Long patientId, VitalStatus status);
    
    List<VitalSigns> findByStatus(VitalStatus status);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId AND vs.recordDate BETWEEN :startDate AND :endDate")
    List<VitalSigns> findByPatientIdAndDateRange(@Param("patientId") Long patientId, 
                                                @Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.doctorId = :doctorId AND vs.recordDate BETWEEN :startDate AND :endDate")
    List<VitalSigns> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.recordDate BETWEEN :startDate AND :endDate")
    List<VitalSigns> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId AND vs.isUrgent = true")
    List<VitalSigns> findUrgentVitalsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.doctorId = :doctorId AND vs.isUrgent = true")
    List<VitalSigns> findUrgentVitalsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId ORDER BY vs.recordDate DESC")
    Page<VitalSigns> findVitalsByPatientOrdered(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.doctorId = :doctorId ORDER BY vs.recordDate DESC")
    Page<VitalSigns> findVitalsByDoctorOrdered(@Param("doctorId") Long doctorId, Pageable pageable);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId AND vs.recordDate >= :startDate ORDER BY vs.recordDate DESC")
    List<VitalSigns> findRecentVitalsByPatient(@Param("patientId") Long patientId, 
                                               @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId ORDER BY vs.recordDate DESC LIMIT 1")
    VitalSigns findLatestVitalsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId AND vs.status = :status ORDER BY vs.recordDate DESC")
    List<VitalSigns> findVitalsByPatientAndStatus(@Param("patientId") Long patientId, 
                                                  @Param("status") VitalStatus status);
    
    @Query("SELECT COUNT(vs) FROM VitalSigns vs WHERE vs.patientId = :patientId")
    long countVitalsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(vs) FROM VitalSigns vs WHERE vs.doctorId = :doctorId")
    long countVitalsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(vs) FROM VitalSigns vs WHERE vs.recordDate BETWEEN :startDate AND :endDate")
    long countVitalsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vs.status, COUNT(vs) FROM VitalSigns vs GROUP BY vs.status")
    List<Object[]> countVitalsByStatus();
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patientId = :patientId AND vs.recordDate >= :startDate AND vs.recordDate <= :endDate ORDER BY vs.recordDate")
    List<VitalSigns> findVitalsByPatientAndDateRangeOrdered(@Param("patientId") Long patientId, 
                                                            @Param("startDate") LocalDateTime startDate, 
                                                            @Param("endDate") LocalDateTime endDate);
} 