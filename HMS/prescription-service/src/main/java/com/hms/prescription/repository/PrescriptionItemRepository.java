package com.hms.prescription.repository;

import com.hms.prescription.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    
    List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);
    
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.patientId = :patientId")
    List<PrescriptionItem> findByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.medicationName LIKE %:medicationName%")
    List<PrescriptionItem> findByMedicationNameContaining(@Param("medicationName") String medicationName);
} 