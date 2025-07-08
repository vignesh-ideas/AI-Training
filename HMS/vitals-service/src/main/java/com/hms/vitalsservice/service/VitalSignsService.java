package com.hms.vitalsservice.service;

import com.hms.vitalsservice.dto.VitalSignsRequest;
import com.hms.vitalsservice.dto.VitalSignsResponse;
import com.hms.vitalsservice.entity.VitalSigns;
import com.hms.vitalsservice.entity.VitalStatus;
import com.hms.vitalsservice.exception.VitalSignsNotFoundException;
import com.hms.vitalsservice.repository.VitalSignsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VitalSignsService {
    
    @Autowired
    private VitalSignsRepository vitalSignsRepository;
    
    public VitalSignsResponse createVitalSigns(VitalSignsRequest request) {
        // Create new vital signs record
        VitalSigns vitalSigns = new VitalSigns();
        vitalSigns.setPatientId(request.getPatientId());
        vitalSigns.setDoctorId(request.getDoctorId());
        vitalSigns.setRecordDate(request.getRecordDate());
        vitalSigns.setTemperature(request.getTemperature());
        vitalSigns.setBloodPressureSystolic(request.getBloodPressureSystolic());
        vitalSigns.setBloodPressureDiastolic(request.getBloodPressureDiastolic());
        vitalSigns.setHeartRate(request.getHeartRate());
        vitalSigns.setRespiratoryRate(request.getRespiratoryRate());
        vitalSigns.setOxygenSaturation(request.getOxygenSaturation());
        vitalSigns.setHeight(request.getHeight());
        vitalSigns.setWeight(request.getWeight());
        vitalSigns.setPainLevel(request.getPainLevel());
        vitalSigns.setBloodSugar(request.getBloodSugar());
        vitalSigns.setNotes(request.getNotes());
        vitalSigns.setIsUrgent(request.getIsUrgent());
        
        // Calculate BMI
        vitalSigns.calculateBmi();
        
        // Determine status based on vital signs
        vitalSigns.setStatus(determineVitalStatus(vitalSigns));
        
        VitalSigns savedVitalSigns = vitalSignsRepository.save(vitalSigns);
        return convertToVitalSignsResponse(savedVitalSigns);
    }
    
    public VitalSignsResponse getVitalSignsById(Long id) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(id)
                .orElseThrow(() -> new VitalSignsNotFoundException("Vital signs not found with id: " + id));
        return convertToVitalSignsResponse(vitalSigns);
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatient(Long patientId) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByPatientId(patientId);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByDoctor(Long doctorId) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByDoctorId(doctorId);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatientAndDoctor(Long patientId, Long doctorId) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByPatientIdAndDoctorId(patientId, doctorId);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatientAndStatus(Long patientId, VitalStatus status) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByPatientIdAndStatus(patientId, status);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByStatus(VitalStatus status) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByStatus(status);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatientAndDateRange(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getVitalSignsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByDateRange(startDate, endDate);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getUrgentVitalsByPatient(Long patientId) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findUrgentVitalsByPatient(patientId);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public List<VitalSignsResponse> getUrgentVitalsByDoctor(Long doctorId) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findUrgentVitalsByDoctor(doctorId);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public Page<VitalSignsResponse> getVitalSignsByPatientOrdered(Long patientId, Pageable pageable) {
        Page<VitalSigns> vitalSigns = vitalSignsRepository.findVitalsByPatientOrdered(patientId, pageable);
        return vitalSigns.map(this::convertToVitalSignsResponse);
    }
    
    public Page<VitalSignsResponse> getVitalSignsByDoctorOrdered(Long doctorId, Pageable pageable) {
        Page<VitalSigns> vitalSigns = vitalSignsRepository.findVitalsByDoctorOrdered(doctorId, pageable);
        return vitalSigns.map(this::convertToVitalSignsResponse);
    }
    
    public List<VitalSignsResponse> getRecentVitalSignsByPatient(Long patientId, LocalDateTime startDate) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findRecentVitalsByPatient(patientId, startDate);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public VitalSignsResponse getLatestVitalSignsByPatient(Long patientId) {
        VitalSigns vitalSigns = vitalSignsRepository.findLatestVitalsByPatient(patientId);
        if (vitalSigns == null) {
            throw new VitalSignsNotFoundException("No vital signs found for patient: " + patientId);
        }
        return convertToVitalSignsResponse(vitalSigns);
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatientAndStatus(Long patientId, VitalStatus status) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findVitalsByPatientAndStatus(patientId, status);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    public VitalSignsResponse updateVitalSigns(Long id, VitalSignsRequest request) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(id)
                .orElseThrow(() -> new VitalSignsNotFoundException("Vital signs not found with id: " + id));
        
        // Update vital signs fields
        vitalSigns.setPatientId(request.getPatientId());
        vitalSigns.setDoctorId(request.getDoctorId());
        vitalSigns.setRecordDate(request.getRecordDate());
        vitalSigns.setTemperature(request.getTemperature());
        vitalSigns.setBloodPressureSystolic(request.getBloodPressureSystolic());
        vitalSigns.setBloodPressureDiastolic(request.getBloodPressureDiastolic());
        vitalSigns.setHeartRate(request.getHeartRate());
        vitalSigns.setRespiratoryRate(request.getRespiratoryRate());
        vitalSigns.setOxygenSaturation(request.getOxygenSaturation());
        vitalSigns.setHeight(request.getHeight());
        vitalSigns.setWeight(request.getWeight());
        vitalSigns.setPainLevel(request.getPainLevel());
        vitalSigns.setBloodSugar(request.getBloodSugar());
        vitalSigns.setNotes(request.getNotes());
        vitalSigns.setIsUrgent(request.getIsUrgent());
        
        // Recalculate BMI and status
        vitalSigns.calculateBmi();
        vitalSigns.setStatus(determineVitalStatus(vitalSigns));
        
        VitalSigns updatedVitalSigns = vitalSignsRepository.save(vitalSigns);
        return convertToVitalSignsResponse(updatedVitalSigns);
    }
    
    public VitalSignsResponse updateVitalSignsStatus(Long id, VitalStatus status) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(id)
                .orElseThrow(() -> new VitalSignsNotFoundException("Vital signs not found with id: " + id));
        
        vitalSigns.setStatus(status);
        VitalSigns updatedVitalSigns = vitalSignsRepository.save(vitalSigns);
        return convertToVitalSignsResponse(updatedVitalSigns);
    }
    
    public void deleteVitalSigns(Long id) {
        if (!vitalSignsRepository.existsById(id)) {
            throw new VitalSignsNotFoundException("Vital signs not found with id: " + id);
        }
        vitalSignsRepository.deleteById(id);
    }
    
    public long getTotalVitalSigns() {
        return vitalSignsRepository.count();
    }
    
    public long getVitalSignsByPatient(Long patientId) {
        return vitalSignsRepository.countVitalsByPatient(patientId);
    }
    
    public long getVitalSignsByDoctor(Long doctorId) {
        return vitalSignsRepository.countVitalsByDoctor(doctorId);
    }
    
    public long getVitalSignsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return vitalSignsRepository.countVitalsByDateRange(startDate, endDate);
    }
    
    public List<Object[]> getVitalSignsByStatusCount() {
        return vitalSignsRepository.countVitalsByStatus();
    }
    
    public List<VitalSignsResponse> getVitalSignsByPatientAndDateRangeOrdered(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<VitalSigns> vitalSigns = vitalSignsRepository.findVitalsByPatientAndDateRangeOrdered(patientId, startDate, endDate);
        return vitalSigns.stream().map(this::convertToVitalSignsResponse).toList();
    }
    
    private VitalStatus determineVitalStatus(VitalSigns vitalSigns) {
        // Simple logic to determine vital status based on values
        // In a real application, this would be more sophisticated
        
        if (vitalSigns.getTemperature() != null && vitalSigns.getTemperature() > 39.0) {
            return VitalStatus.CRITICAL;
        }
        
        if (vitalSigns.getHeartRate() != null && vitalSigns.getHeartRate() > 120) {
            return VitalStatus.HIGH;
        }
        
        if (vitalSigns.getBloodPressureSystolic() != null && vitalSigns.getBloodPressureSystolic() > 140) {
            return VitalStatus.ELEVATED;
        }
        
        if (vitalSigns.getOxygenSaturation() != null && vitalSigns.getOxygenSaturation() < 90) {
            return VitalStatus.CRITICAL;
        }
        
        return VitalStatus.NORMAL;
    }
    
    private VitalSignsResponse convertToVitalSignsResponse(VitalSigns vitalSigns) {
        return new VitalSignsResponse(
                vitalSigns.getId(),
                vitalSigns.getPatientId(),
                vitalSigns.getDoctorId(),
                vitalSigns.getRecordDate(),
                vitalSigns.getTemperature(),
                vitalSigns.getBloodPressureSystolic(),
                vitalSigns.getBloodPressureDiastolic(),
                vitalSigns.getHeartRate(),
                vitalSigns.getRespiratoryRate(),
                vitalSigns.getOxygenSaturation(),
                vitalSigns.getHeight(),
                vitalSigns.getWeight(),
                vitalSigns.getBmi(),
                vitalSigns.getPainLevel(),
                vitalSigns.getBloodSugar(),
                vitalSigns.getNotes(),
                vitalSigns.getStatus(),
                vitalSigns.getIsUrgent(),
                vitalSigns.getCreatedAt(),
                vitalSigns.getUpdatedAt()
        );
    }
} 