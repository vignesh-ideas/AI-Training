package com.hms.patientservice.service;

import com.hms.patientservice.dto.PatientRegistrationRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.entity.PatientStatus;
import com.hms.patientservice.exception.PatientNotFoundException;
import com.hms.patientservice.exception.PatientRegistrationException;
import com.hms.patientservice.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public PatientResponse registerPatient(PatientRegistrationRequest request) {
        // Generate patient number
        String patientNumber = generatePatientNumber();
        
        // Check if email already exists
        if (request.getEmail() != null && patientRepository.existsByEmail(request.getEmail())) {
            throw new PatientRegistrationException("Email already exists: " + request.getEmail());
        }
        
        // Create new patient
        Patient patient = new Patient();
        patient.setPatientNumber(patientNumber);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setCurrentMedications(request.getCurrentMedications());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setInsuranceNumber(request.getInsuranceNumber());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setZipCode(request.getZipCode());
        patient.setCountry(request.getCountry());
        patient.setAssignedDoctorId(request.getAssignedDoctorId());
        patient.setStatus(PatientStatus.ACTIVE);
        
        Patient savedPatient = patientRepository.save(patient);
        return convertToPatientResponse(savedPatient);
    }
    
    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));
        return convertToPatientResponse(patient);
    }
    
    public PatientResponse getPatientByPatientNumber(String patientNumber) {
        Patient patient = patientRepository.findByPatientNumber(patientNumber)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with patient number: " + patientNumber));
        return convertToPatientResponse(patient);
    }
    
    public PatientResponse getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with email: " + email));
        return convertToPatientResponse(patient);
    }
    
    public Page<PatientResponse> getAllPatients(Pageable pageable) {
        Page<Patient> patients = patientRepository.findAll(pageable);
        return patients.map(this::convertToPatientResponse);
    }
    
    public Page<PatientResponse> searchPatients(String searchTerm, Pageable pageable) {
        Page<Patient> patients = patientRepository.searchPatients(searchTerm, pageable);
        return patients.map(this::convertToPatientResponse);
    }
    
    public Page<PatientResponse> searchPatientsWithFilters(String searchTerm, PatientStatus status, 
                                                         Gender gender, Long doctorId, Pageable pageable) {
        Page<Patient> patients = patientRepository.searchPatientsWithFilters(searchTerm, status, gender, doctorId, pageable);
        return patients.map(this::convertToPatientResponse);
    }
    
    public List<PatientResponse> getPatientsByStatus(PatientStatus status) {
        List<Patient> patients = patientRepository.findByStatus(status);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public List<PatientResponse> getPatientsByGender(Gender gender) {
        List<Patient> patients = patientRepository.findByGender(gender);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public List<PatientResponse> getPatientsByDoctor(Long doctorId) {
        List<Patient> patients = patientRepository.findByAssignedDoctorId(doctorId);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public List<PatientResponse> getActivePatientsByDoctor(Long doctorId) {
        List<Patient> patients = patientRepository.findActivePatientsByDoctor(doctorId);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public PatientResponse updatePatient(Long id, PatientRegistrationRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));
        
        // Check if new email conflicts with existing patients
        if (request.getEmail() != null && !request.getEmail().equals(patient.getEmail()) && 
            patientRepository.existsByEmail(request.getEmail())) {
            throw new PatientRegistrationException("Email already exists: " + request.getEmail());
        }
        
        // Update patient fields
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setCurrentMedications(request.getCurrentMedications());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setInsuranceNumber(request.getInsuranceNumber());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setZipCode(request.getZipCode());
        patient.setCountry(request.getCountry());
        patient.setAssignedDoctorId(request.getAssignedDoctorId());
        
        Patient updatedPatient = patientRepository.save(patient);
        return convertToPatientResponse(updatedPatient);
    }
    
    public PatientResponse updatePatientStatus(Long id, PatientStatus status) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));
        
        patient.setStatus(status);
        Patient updatedPatient = patientRepository.save(patient);
        return convertToPatientResponse(updatedPatient);
    }
    
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new PatientNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }
    
    public long getTotalPatients() {
        return patientRepository.count();
    }
    
    public long getPatientsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return patientRepository.countPatientsCreatedBetween(startDate, endDate);
    }
    
    public List<Object[]> getPatientsByGenderCount() {
        return patientRepository.countPatientsByGender();
    }
    
    public List<Object[]> getPatientsByStatusCount() {
        return patientRepository.countPatientsByStatus();
    }
    
    public List<PatientResponse> getPatientsByAgeRange(LocalDate startDate, LocalDate endDate) {
        List<Patient> patients = patientRepository.findPatientsByAgeRange(startDate, endDate);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public List<PatientResponse> getPatientsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        List<Patient> patients = patientRepository.findPatientsCreatedBetween(startDate, endDate);
        return patients.stream().map(this::convertToPatientResponse).toList();
    }
    
    public long getActivePatientsByDoctor(Long doctorId) {
        return patientRepository.countActivePatientsByDoctor(doctorId);
    }
    
    public boolean existsByPatientNumber(String patientNumber) {
        return patientRepository.existsByPatientNumber(patientNumber);
    }
    
    public boolean existsByEmail(String email) {
        return patientRepository.existsByEmail(email);
    }
    
    private String generatePatientNumber() {
        // Generate a unique patient number (P + timestamp + random number)
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.valueOf((int) (Math.random() * 1000));
        return "P" + timestamp.substring(timestamp.length() - 8) + random;
    }
    
    private PatientResponse convertToPatientResponse(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getPatientNumber(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getDateOfBirth(),
                patient.getGender(),
                patient.getEmail(),
                patient.getPhoneNumber(),
                patient.getEmergencyContact(),
                patient.getEmergencyPhone(),
                patient.getBloodGroup(),
                patient.getAllergies(),
                patient.getMedicalHistory(),
                patient.getCurrentMedications(),
                patient.getInsuranceProvider(),
                patient.getInsuranceNumber(),
                patient.getAddress(),
                patient.getCity(),
                patient.getState(),
                patient.getZipCode(),
                patient.getCountry(),
                patient.getStatus(),
                patient.getAssignedDoctorId(),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }
} 