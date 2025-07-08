package com.hms.medicalrecordsservice.service;

import com.hms.medicalrecordsservice.dto.MedicalRecordRequest;
import com.hms.medicalrecordsservice.dto.MedicalRecordResponse;
import com.hms.medicalrecordsservice.entity.MedicalRecord;
import com.hms.medicalrecordsservice.entity.RecordStatus;
import com.hms.medicalrecordsservice.entity.RecordType;
import com.hms.medicalrecordsservice.exception.MedicalRecordNotFoundException;
import com.hms.medicalrecordsservice.repository.MedicalRecordRepository;
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
public class MedicalRecordService {
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request) {
        // Create new medical record
        MedicalRecord record = new MedicalRecord();
        record.setPatientId(request.getPatientId());
        record.setDoctorId(request.getDoctorId());
        record.setRecordDate(request.getRecordDate());
        record.setType(request.getType());
        record.setDiagnosis(request.getDiagnosis());
        record.setSymptoms(request.getSymptoms());
        record.setTreatment(request.getTreatment());
        record.setMedications(request.getMedications());
        record.setDosage(request.getDosage());
        record.setDuration(request.getDuration());
        record.setNotes(request.getNotes());
        record.setVitalSigns(request.getVitalSigns());
        record.setLabResults(request.getLabResults());
        record.setImagingResults(request.getImagingResults());
        record.setFollowUpDate(request.getFollowUpDate());
        record.setIsUrgent(request.getIsUrgent());
        record.setAttachments(request.getAttachments());
        record.setStatus(RecordStatus.ACTIVE);
        
        MedicalRecord savedRecord = medicalRecordRepository.save(record);
        return convertToMedicalRecordResponse(savedRecord);
    }
    
    public MedicalRecordResponse getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new MedicalRecordNotFoundException("Medical record not found with id: " + id));
        return convertToMedicalRecordResponse(record);
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findByDoctorId(doctorId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatientAndDoctor(Long patientId, Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndDoctorId(patientId, doctorId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatientAndStatus(Long patientId, RecordStatus status) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndStatus(patientId, status);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatientAndType(Long patientId, RecordType type) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndType(patientId, type);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByStatus(RecordStatus status) {
        List<MedicalRecord> records = medicalRecordRepository.findByStatus(status);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByType(RecordType type) {
        List<MedicalRecord> records = medicalRecordRepository.findByType(type);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatientAndDateRange(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<MedicalRecord> records = medicalRecordRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<MedicalRecord> records = medicalRecordRepository.findByDateRange(startDate, endDate);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getUrgentRecordsByPatient(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findUrgentRecordsByPatient(patientId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getUrgentRecordsByDoctor(Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findUrgentRecordsByDoctor(doctorId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getRecordsWithFollowUp(LocalDateTime startDate) {
        List<MedicalRecord> records = medicalRecordRepository.findRecordsWithFollowUp(startDate);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getRecordsWithFollowUpByPatient(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findRecordsWithFollowUpByPatient(patientId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public List<MedicalRecordResponse> getRecordsWithFollowUpByDoctor(Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findRecordsWithFollowUpByDoctor(doctorId);
        return records.stream().map(this::convertToMedicalRecordResponse).toList();
    }
    
    public Page<MedicalRecordResponse> searchMedicalRecords(String searchTerm, Pageable pageable) {
        Page<MedicalRecord> records = medicalRecordRepository.searchRecords(searchTerm, pageable);
        return records.map(this::convertToMedicalRecordResponse);
    }
    
    public Page<MedicalRecordResponse> searchMedicalRecordsWithFilters(String searchTerm, Long patientId, 
                                                                     Long doctorId, RecordType type, RecordStatus status, 
                                                                     Pageable pageable) {
        Page<MedicalRecord> records = medicalRecordRepository.searchRecordsWithFilters(searchTerm, patientId, doctorId, type, status, pageable);
        return records.map(this::convertToMedicalRecordResponse);
    }
    
    public Page<MedicalRecordResponse> getMedicalRecordsByPatientOrdered(Long patientId, Pageable pageable) {
        Page<MedicalRecord> records = medicalRecordRepository.findRecordsByPatientOrdered(patientId, pageable);
        return records.map(this::convertToMedicalRecordResponse);
    }
    
    public Page<MedicalRecordResponse> getMedicalRecordsByDoctorOrdered(Long doctorId, Pageable pageable) {
        Page<MedicalRecord> records = medicalRecordRepository.findRecordsByDoctorOrdered(doctorId, pageable);
        return records.map(this::convertToMedicalRecordResponse);
    }
    
    public MedicalRecordResponse updateMedicalRecord(Long id, MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new MedicalRecordNotFoundException("Medical record not found with id: " + id));
        
        // Update record fields
        record.setPatientId(request.getPatientId());
        record.setDoctorId(request.getDoctorId());
        record.setRecordDate(request.getRecordDate());
        record.setType(request.getType());
        record.setDiagnosis(request.getDiagnosis());
        record.setSymptoms(request.getSymptoms());
        record.setTreatment(request.getTreatment());
        record.setMedications(request.getMedications());
        record.setDosage(request.getDosage());
        record.setDuration(request.getDuration());
        record.setNotes(request.getNotes());
        record.setVitalSigns(request.getVitalSigns());
        record.setLabResults(request.getLabResults());
        record.setImagingResults(request.getImagingResults());
        record.setFollowUpDate(request.getFollowUpDate());
        record.setIsUrgent(request.getIsUrgent());
        record.setAttachments(request.getAttachments());
        
        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return convertToMedicalRecordResponse(updatedRecord);
    }
    
    public MedicalRecordResponse updateMedicalRecordStatus(Long id, RecordStatus status) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new MedicalRecordNotFoundException("Medical record not found with id: " + id));
        
        record.setStatus(status);
        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return convertToMedicalRecordResponse(updatedRecord);
    }
    
    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new MedicalRecordNotFoundException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }
    
    public long getTotalMedicalRecords() {
        return medicalRecordRepository.count();
    }
    
    public long getRecordsByPatient(Long patientId) {
        return medicalRecordRepository.countRecordsByPatient(patientId);
    }
    
    public long getRecordsByDoctor(Long doctorId) {
        return medicalRecordRepository.countRecordsByDoctor(doctorId);
    }
    
    public long getRecordsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return medicalRecordRepository.countRecordsByDateRange(startDate, endDate);
    }
    
    public List<Object[]> getRecordsByTypeCount() {
        return medicalRecordRepository.countRecordsByType();
    }
    
    public List<Object[]> getRecordsByStatusCount() {
        return medicalRecordRepository.countRecordsByStatus();
    }
    
    private MedicalRecordResponse convertToMedicalRecordResponse(MedicalRecord record) {
        return new MedicalRecordResponse(
                record.getId(),
                record.getPatientId(),
                record.getDoctorId(),
                record.getRecordDate(),
                record.getType(),
                record.getDiagnosis(),
                record.getSymptoms(),
                record.getTreatment(),
                record.getMedications(),
                record.getDosage(),
                record.getDuration(),
                record.getNotes(),
                record.getVitalSigns(),
                record.getLabResults(),
                record.getImagingResults(),
                record.getFollowUpDate(),
                record.getStatus(),
                record.getIsUrgent(),
                record.getAttachments(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
} 