package com.hms.patientservice.repository;

import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.entity.PatientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByPatientNumber(String patientNumber);
    
    Optional<Patient> findByEmail(String email);
    
    boolean existsByPatientNumber(String patientNumber);
    
    boolean existsByEmail(String email);
    
    List<Patient> findByStatus(PatientStatus status);
    
    List<Patient> findByGender(Gender gender);
    
    List<Patient> findByAssignedDoctorId(Long doctorId);
    
    List<Patient> findByStatusAndAssignedDoctorId(PatientStatus status, Long doctorId);
    
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.patientNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Patient> searchPatients(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT p FROM Patient p WHERE " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:doctorId IS NULL OR p.assignedDoctorId = :doctorId) AND " +
           "(LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.patientNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Patient> searchPatientsWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("status") PatientStatus status,
            @Param("gender") Gender gender,
            @Param("doctorId") Long doctorId,
            Pageable pageable
    );
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    long countPatientsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p.gender, COUNT(p) FROM Patient p WHERE p.status = 'ACTIVE' GROUP BY p.gender")
    List<Object[]> countPatientsByGender();
    
    @Query("SELECT p.status, COUNT(p) FROM Patient p GROUP BY p.status")
    List<Object[]> countPatientsByStatus();
    
    @Query("SELECT p FROM Patient p WHERE p.dateOfBirth BETWEEN :startDate AND :endDate")
    List<Patient> findPatientsByAgeRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Patient p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    List<Patient> findPatientsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Patient p WHERE p.assignedDoctorId = :doctorId AND p.status = 'ACTIVE'")
    List<Patient> findActivePatientsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.assignedDoctorId = :doctorId AND p.status = 'ACTIVE'")
    long countActivePatientsByDoctor(@Param("doctorId") Long doctorId);
} 