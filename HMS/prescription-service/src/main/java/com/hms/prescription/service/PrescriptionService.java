package com.hms.prescription.service;

import com.hms.prescription.dto.PrescriptionRequest;
import com.hms.prescription.dto.PrescriptionResponse;
import com.hms.prescription.entity.Prescription;
import com.hms.prescription.entity.PrescriptionItem;
import com.hms.prescription.entity.PrescriptionStatus;
import com.hms.prescription.exception.PrescriptionNotFoundException;
import com.hms.prescription.repository.PrescriptionRepository;
import com.hms.prescription.repository.PrescriptionItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    
    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        Prescription prescription = new Prescription();
        prescription.setPatientId(request.getPatientId());
        prescription.setDoctorId(request.getDoctorId());
        prescription.setAppointmentId(request.getAppointmentId());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());
        prescription.setStatus(PrescriptionStatus.ACTIVE);
        prescription.setValidUntil(request.getValidUntil());
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        // Save prescription items
        if (request.getPrescriptionItems() != null) {
            List<PrescriptionItem> items = request.getPrescriptionItems().stream()
                .map(itemRequest -> {
                    PrescriptionItem item = new PrescriptionItem();
                    item.setPrescription(savedPrescription);
                    item.setMedicationName(itemRequest.getMedicationName());
                    item.setDosage(itemRequest.getDosage());
                    item.setFrequency(itemRequest.getFrequency());
                    item.setDuration(itemRequest.getDuration());
                    item.setInstructions(itemRequest.getInstructions());
                    item.setQuantity(itemRequest.getQuantity());
                    item.setRoute(itemRequest.getRoute());
                    item.setRefills(itemRequest.getRefills());
                    item.setIsGeneric(itemRequest.getIsGeneric());
                    return item;
                })
                .collect(Collectors.toList());
            
            prescriptionItemRepository.saveAll(items);
            savedPrescription.setPrescriptionItems(items);
        }
        
        return mapToResponse(savedPrescription);
    }
    
    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
            .orElseThrow(() -> new PrescriptionNotFoundException("Prescription not found with id: " + id));
        return mapToResponse(prescription);
    }
    
    public List<PrescriptionResponse> getPrescriptionsByPatientId(Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        return prescriptions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<PrescriptionResponse> getPrescriptionsByDoctorId(Long doctorId) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);
        return prescriptions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public PrescriptionResponse updatePrescriptionStatus(Long id, PrescriptionStatus status) {
        Prescription prescription = prescriptionRepository.findById(id)
            .orElseThrow(() -> new PrescriptionNotFoundException("Prescription not found with id: " + id));
        
        prescription.setStatus(status);
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(updatedPrescription);
    }
    
    @Transactional
    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new PrescriptionNotFoundException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
    
    public List<PrescriptionResponse> getExpiredPrescriptions() {
        List<Prescription> expiredPrescriptions = prescriptionRepository.findExpiredPrescriptions(
            PrescriptionStatus.ACTIVE, LocalDateTime.now());
        return expiredPrescriptions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    private PrescriptionResponse mapToResponse(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setId(prescription.getId());
        response.setPatientId(prescription.getPatientId());
        response.setDoctorId(prescription.getDoctorId());
        response.setAppointmentId(prescription.getAppointmentId());
        response.setDiagnosis(prescription.getDiagnosis());
        response.setNotes(prescription.getNotes());
        response.setStatus(prescription.getStatus());
        response.setPrescribedDate(prescription.getPrescribedDate());
        response.setValidUntil(prescription.getValidUntil());
        response.setCreatedAt(prescription.getCreatedAt());
        response.setUpdatedAt(prescription.getUpdatedAt());
        
        if (prescription.getPrescriptionItems() != null) {
            response.setPrescriptionItems(prescription.getPrescriptionItems().stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    private com.hms.prescription.dto.PrescriptionItemResponse mapToItemResponse(PrescriptionItem item) {
        com.hms.prescription.dto.PrescriptionItemResponse response = new com.hms.prescription.dto.PrescriptionItemResponse();
        response.setId(item.getId());
        response.setMedicationName(item.getMedicationName());
        response.setDosage(item.getDosage());
        response.setFrequency(item.getFrequency());
        response.setDuration(item.getDuration());
        response.setInstructions(item.getInstructions());
        response.setQuantity(item.getQuantity());
        response.setRoute(item.getRoute());
        response.setRefills(item.getRefills());
        response.setIsGeneric(item.getIsGeneric());
        return response;
    }
} 