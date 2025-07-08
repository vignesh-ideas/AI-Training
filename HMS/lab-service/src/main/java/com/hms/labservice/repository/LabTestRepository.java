package com.hms.labservice.repository;

import com.hms.labservice.entity.LabTest;
import com.hms.labservice.entity.TestStatus;
import com.hms.labservice.entity.TestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    
    Optional<LabTest> findByTestNumber(String testNumber);
    
    List<LabTest> findByPatientId(Long patientId);
    
    List<LabTest> findByDoctorId(Long doctorId);
    
    List<LabTest> findByLabTechnicianId(Long labTechnicianId);
    
    List<LabTest> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    
    List<LabTest> findByPatientIdAndStatus(Long patientId, TestStatus status);
    
    List<LabTest> findByStatus(TestStatus status);
    
    List<LabTest> findByType(TestType type);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.patientId = :patientId AND lt.testDate BETWEEN :startDate AND :endDate")
    List<LabTest> findByPatientIdAndDateRange(@Param("patientId") Long patientId, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.doctorId = :doctorId AND lt.testDate BETWEEN :startDate AND :endDate")
    List<LabTest> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId, 
                                            @Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.testDate BETWEEN :startDate AND :endDate")
    List<LabTest> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.patientId = :patientId AND lt.isUrgent = true")
    List<LabTest> findUrgentTestsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.doctorId = :doctorId AND lt.isUrgent = true")
    List<LabTest> findUrgentTestsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.status = 'PENDING' ORDER BY lt.testDate")
    List<LabTest> findPendingTests();
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.status = 'IN_PROGRESS' ORDER BY lt.testDate")
    List<LabTest> findInProgressTests();
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.status = 'COMPLETED' AND lt.resultDate IS NULL")
    List<LabTest> findCompletedTestsWithoutResults();
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.patientId = :patientId ORDER BY lt.testDate DESC")
    Page<LabTest> findTestsByPatientOrdered(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.doctorId = :doctorId ORDER BY lt.testDate DESC")
    Page<LabTest> findTestsByDoctorOrdered(@Param("doctorId") Long doctorId, Pageable pageable);
    
    @Query("SELECT lt FROM LabTest lt WHERE lt.labTechnicianId = :labTechnicianId ORDER BY lt.testDate DESC")
    Page<LabTest> findTestsByLabTechnicianOrdered(@Param("labTechnicianId") Long labTechnicianId, Pageable pageable);
    
    @Query("SELECT lt FROM LabTest lt WHERE " +
           "LOWER(lt.testNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(lt.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<LabTest> searchTests(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT lt FROM LabTest lt WHERE " +
           "(:patientId IS NULL OR lt.patientId = :patientId) AND " +
           "(:doctorId IS NULL OR lt.doctorId = :doctorId) AND " +
           "(:type IS NULL OR lt.type = :type) AND " +
           "(:status IS NULL OR lt.status = :status) AND " +
           "(LOWER(lt.testNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(lt.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<LabTest> searchTestsWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("type") TestType type,
            @Param("status") TestStatus status,
            Pageable pageable
    );
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.patientId = :patientId")
    long countTestsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.doctorId = :doctorId")
    long countTestsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.testDate BETWEEN :startDate AND :endDate")
    long countTestsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT lt.type, COUNT(lt) FROM LabTest lt GROUP BY lt.type")
    List<Object[]> countTestsByType();
    
    @Query("SELECT lt.status, COUNT(lt) FROM LabTest lt GROUP BY lt.status")
    List<Object[]> countTestsByStatus();
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.status = 'PENDING'")
    long countPendingTests();
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.status = 'IN_PROGRESS'")
    long countInProgressTests();
    
    @Query("SELECT COUNT(lt) FROM LabTest lt WHERE lt.status = 'COMPLETED'")
    long countCompletedTests();
} 