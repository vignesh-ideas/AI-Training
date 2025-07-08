package com.hms.medicalrecordsservice.repository;

import com.hms.medicalrecordsservice.entity.MedicalRecord;
import com.hms.medicalrecordsservice.entity.RecordStatus;
import com.hms.medicalrecordsservice.entity.RecordType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    List<MedicalRecord> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    
    List<MedicalRecord> findByPatientIdAndStatus(Long patientId, RecordStatus status);
    
    List<MedicalRecord> findByPatientIdAndType(Long patientId, RecordType type);
    
    List<MedicalRecord> findByStatus(RecordStatus status);
    
    List<MedicalRecord> findByType(RecordType type);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patientId = :patientId AND mr.recordDate BETWEEN :startDate AND :endDate")
    List<MedicalRecord> findByPatientIdAndDateRange(@Param("patientId") Long patientId, 
                                                   @Param("startDate") LocalDateTime startDate, 
                                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctorId = :doctorId AND mr.recordDate BETWEEN :startDate AND :endDate")
    List<MedicalRecord> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId, 
                                                  @Param("startDate") LocalDateTime startDate, 
                                                  @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.recordDate BETWEEN :startDate AND :endDate")
    List<MedicalRecord> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patientId = :patientId AND mr.isUrgent = true")
    List<MedicalRecord> findUrgentRecordsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctorId = :doctorId AND mr.isUrgent = true")
    List<MedicalRecord> findUrgentRecordsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.followUpDate IS NOT NULL AND mr.followUpDate >= :startDate")
    List<MedicalRecord> findRecordsWithFollowUp(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patientId = :patientId AND mr.followUpDate IS NOT NULL ORDER BY mr.followUpDate")
    List<MedicalRecord> findRecordsWithFollowUpByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctorId = :doctorId AND mr.followUpDate IS NOT NULL ORDER BY mr.followUpDate")
    List<MedicalRecord> findRecordsWithFollowUpByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
           "LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.symptoms) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.treatment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<MedicalRecord> searchRecords(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
           "(:patientId IS NULL OR mr.patientId = :patientId) AND " +
           "(:doctorId IS NULL OR mr.doctorId = :doctorId) AND " +
           "(:type IS NULL OR mr.type = :type) AND " +
           "(:status IS NULL OR mr.status = :status) AND " +
           "(LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.symptoms) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.treatment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<MedicalRecord> searchRecordsWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("type") RecordType type,
            @Param("status") RecordStatus status,
            Pageable pageable
    );
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.patientId = :patientId")
    long countRecordsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.doctorId = :doctorId")
    long countRecordsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.recordDate BETWEEN :startDate AND :endDate")
    long countRecordsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr.type, COUNT(mr) FROM MedicalRecord mr GROUP BY mr.type")
    List<Object[]> countRecordsByType();
    
    @Query("SELECT mr.status, COUNT(mr) FROM MedicalRecord mr GROUP BY mr.status")
    List<Object[]> countRecordsByStatus();
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patientId = :patientId ORDER BY mr.recordDate DESC")
    Page<MedicalRecord> findRecordsByPatientOrdered(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctorId = :doctorId ORDER BY mr.recordDate DESC")
    Page<MedicalRecord> findRecordsByDoctorOrdered(@Param("doctorId") Long doctorId, Pageable pageable);
} 