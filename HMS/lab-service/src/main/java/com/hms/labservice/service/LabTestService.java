package com.hms.labservice.service;

import com.hms.labservice.dto.LabTestRequest;
import com.hms.labservice.dto.LabTestResponse;
import com.hms.labservice.entity.LabTest;
import com.hms.labservice.entity.TestStatus;
import com.hms.labservice.entity.TestType;
import com.hms.labservice.exception.LabTestNotFoundException;
import com.hms.labservice.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LabTestService {
    
    @Autowired
    private LabTestRepository labTestRepository;
    
    public LabTestResponse createLabTest(LabTestRequest request) {
        // Generate test number
        String testNumber = generateTestNumber();
        
        // Create new lab test
        LabTest labTest = new LabTest();
        labTest.setPatientId(request.getPatientId());
        labTest.setDoctorId(request.getDoctorId());
        labTest.setTestNumber(testNumber);
        labTest.setType(request.getType());
        labTest.setTestDate(request.getTestDate());
        labTest.setResultDate(request.getResultDate());
        labTest.setNotes(request.getNotes());
        labTest.setLabTechnicianId(request.getLabTechnicianId());
        labTest.setIsUrgent(request.getIsUrgent());
        labTest.setAttachments(request.getAttachments());
        labTest.setStatus(TestStatus.PENDING);
        
        LabTest savedLabTest = labTestRepository.save(labTest);
        return convertToLabTestResponse(savedLabTest);
    }
    
    public LabTestResponse getLabTestById(Long id) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new LabTestNotFoundException("Lab test not found with id: " + id));
        return convertToLabTestResponse(labTest);
    }
    
    public LabTestResponse getLabTestByTestNumber(String testNumber) {
        LabTest labTest = labTestRepository.findByTestNumber(testNumber)
                .orElseThrow(() -> new LabTestNotFoundException("Lab test not found with test number: " + testNumber));
        return convertToLabTestResponse(labTest);
    }
    
    public List<LabTestResponse> getLabTestsByPatient(Long patientId) {
        List<LabTest> labTests = labTestRepository.findByPatientId(patientId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByDoctor(Long doctorId) {
        List<LabTest> labTests = labTestRepository.findByDoctorId(doctorId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByLabTechnician(Long labTechnicianId) {
        List<LabTest> labTests = labTestRepository.findByLabTechnicianId(labTechnicianId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByPatientAndDoctor(Long patientId, Long doctorId) {
        List<LabTest> labTests = labTestRepository.findByPatientIdAndDoctorId(patientId, doctorId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByPatientAndStatus(Long patientId, TestStatus status) {
        List<LabTest> labTests = labTestRepository.findByPatientIdAndStatus(patientId, status);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByStatus(TestStatus status) {
        List<LabTest> labTests = labTestRepository.findByStatus(status);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByType(TestType type) {
        List<LabTest> labTests = labTestRepository.findByType(type);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByPatientAndDateRange(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<LabTest> labTests = labTestRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<LabTest> labTests = labTestRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getLabTestsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<LabTest> labTests = labTestRepository.findByDateRange(startDate, endDate);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getUrgentTestsByPatient(Long patientId) {
        List<LabTest> labTests = labTestRepository.findUrgentTestsByPatient(patientId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getUrgentTestsByDoctor(Long doctorId) {
        List<LabTest> labTests = labTestRepository.findUrgentTestsByDoctor(doctorId);
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getPendingTests() {
        List<LabTest> labTests = labTestRepository.findPendingTests();
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getInProgressTests() {
        List<LabTest> labTests = labTestRepository.findInProgressTests();
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public List<LabTestResponse> getCompletedTestsWithoutResults() {
        List<LabTest> labTests = labTestRepository.findCompletedTestsWithoutResults();
        return labTests.stream().map(this::convertToLabTestResponse).toList();
    }
    
    public Page<LabTestResponse> getLabTestsByPatientOrdered(Long patientId, Pageable pageable) {
        Page<LabTest> labTests = labTestRepository.findTestsByPatientOrdered(patientId, pageable);
        return labTests.map(this::convertToLabTestResponse);
    }
    
    public Page<LabTestResponse> getLabTestsByDoctorOrdered(Long doctorId, Pageable pageable) {
        Page<LabTest> labTests = labTestRepository.findTestsByDoctorOrdered(doctorId, pageable);
        return labTests.map(this::convertToLabTestResponse);
    }
    
    public Page<LabTestResponse> getLabTestsByLabTechnicianOrdered(Long labTechnicianId, Pageable pageable) {
        Page<LabTest> labTests = labTestRepository.findTestsByLabTechnicianOrdered(labTechnicianId, pageable);
        return labTests.map(this::convertToLabTestResponse);
    }
    
    public Page<LabTestResponse> searchLabTests(String searchTerm, Pageable pageable) {
        Page<LabTest> labTests = labTestRepository.searchTests(searchTerm, pageable);
        return labTests.map(this::convertToLabTestResponse);
    }
    
    public Page<LabTestResponse> searchLabTestsWithFilters(String searchTerm, Long patientId, 
                                                          Long doctorId, TestType type, TestStatus status, 
                                                          Pageable pageable) {
        Page<LabTest> labTests = labTestRepository.searchTestsWithFilters(searchTerm, patientId, doctorId, type, status, pageable);
        return labTests.map(this::convertToLabTestResponse);
    }
    
    public LabTestResponse updateLabTest(Long id, LabTestRequest request) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new LabTestNotFoundException("Lab test not found with id: " + id));
        
        // Update lab test fields
        labTest.setPatientId(request.getPatientId());
        labTest.setDoctorId(request.getDoctorId());
        labTest.setType(request.getType());
        labTest.setTestDate(request.getTestDate());
        labTest.setResultDate(request.getResultDate());
        labTest.setNotes(request.getNotes());
        labTest.setLabTechnicianId(request.getLabTechnicianId());
        labTest.setIsUrgent(request.getIsUrgent());
        labTest.setAttachments(request.getAttachments());
        
        LabTest updatedLabTest = labTestRepository.save(labTest);
        return convertToLabTestResponse(updatedLabTest);
    }
    
    public LabTestResponse updateLabTestStatus(Long id, TestStatus status) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new LabTestNotFoundException("Lab test not found with id: " + id));
        
        labTest.setStatus(status);
        
        // If status is completed, set result date
        if (TestStatus.COMPLETED.equals(status)) {
            labTest.setResultDate(LocalDateTime.now());
        }
        
        LabTest updatedLabTest = labTestRepository.save(labTest);
        return convertToLabTestResponse(updatedLabTest);
    }
    
    public LabTestResponse updateLabTestResults(Long id, String testResults, String normalRange, String units) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new LabTestNotFoundException("Lab test not found with id: " + id));
        
        labTest.setTestResults(testResults);
        labTest.setNormalRange(normalRange);
        labTest.setUnits(units);
        labTest.setResultDate(LocalDateTime.now());
        labTest.setStatus(TestStatus.COMPLETED);
        
        LabTest updatedLabTest = labTestRepository.save(labTest);
        return convertToLabTestResponse(updatedLabTest);
    }
    
    public void deleteLabTest(Long id) {
        if (!labTestRepository.existsById(id)) {
            throw new LabTestNotFoundException("Lab test not found with id: " + id);
        }
        labTestRepository.deleteById(id);
    }
    
    public long getTotalLabTests() {
        return labTestRepository.count();
    }
    
    public long getLabTestsByPatient(Long patientId) {
        return labTestRepository.countTestsByPatient(patientId);
    }
    
    public long getLabTestsByDoctor(Long doctorId) {
        return labTestRepository.countTestsByDoctor(doctorId);
    }
    
    public long getLabTestsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return labTestRepository.countTestsByDateRange(startDate, endDate);
    }
    
    public List<Object[]> getLabTestsByTypeCount() {
        return labTestRepository.countTestsByType();
    }
    
    public List<Object[]> getLabTestsByStatusCount() {
        return labTestRepository.countTestsByStatus();
    }
    
    public long getPendingTestsCount() {
        return labTestRepository.countPendingTests();
    }
    
    public long getInProgressTestsCount() {
        return labTestRepository.countInProgressTests();
    }
    
    public long getCompletedTestsCount() {
        return labTestRepository.countCompletedTests();
    }
    
    private String generateTestNumber() {
        // Generate a unique test number (T + timestamp + random number)
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.valueOf((int) (Math.random() * 1000));
        return "T" + timestamp + random;
    }
    
    private LabTestResponse convertToLabTestResponse(LabTest labTest) {
        return new LabTestResponse(
                labTest.getId(),
                labTest.getPatientId(),
                labTest.getDoctorId(),
                labTest.getTestNumber(),
                labTest.getType(),
                labTest.getTestDate(),
                labTest.getResultDate(),
                labTest.getStatus(),
                labTest.getTestResults(),
                labTest.getNormalRange(),
                labTest.getUnits(),
                labTest.getNotes(),
                labTest.getLabTechnicianId(),
                labTest.getIsUrgent(),
                labTest.getAttachments(),
                labTest.getCreatedAt(),
                labTest.getUpdatedAt()
        );
    }
} 