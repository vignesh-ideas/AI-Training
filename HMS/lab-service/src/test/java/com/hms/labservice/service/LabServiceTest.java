package com.hms.labservice.service;

import com.hms.labservice.dto.LabTestRequest;
import com.hms.labservice.dto.LabTestResponse;
import com.hms.labservice.entity.LabTest;
import com.hms.labservice.entity.LabTestStatus;
import com.hms.labservice.entity.LabTestType;
import com.hms.labservice.exception.LabTestNotFoundException;
import com.hms.labservice.repository.LabTestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LabServiceTest {

    @Mock
    private LabTestRepository labTestRepository;

    @InjectMocks
    private LabService labService;

    private LabTest labTest;
    private LabTestRequest labTestRequest;

    @BeforeEach
    void setUp() {
        labTest = new LabTest();
        labTest.setId(1L);
        labTest.setPatientId(1L);
        labTest.setTestType(LabTestType.BLOOD_TEST);
        labTest.setTestName("Complete Blood Count");
        labTest.setDescription("Routine blood test");
        labTest.setStatus(LabTestStatus.PENDING);
        labTest.setOrderedAt(LocalDateTime.now());

        labTestRequest = new LabTestRequest();
        labTestRequest.setPatientId(1L);
        labTestRequest.setTestType(LabTestType.BLOOD_TEST);
        labTestRequest.setTestName("Complete Blood Count");
        labTestRequest.setDescription("Routine blood test");
    }

    @Test
    void testCreateLabTest_Success() {
        when(labTestRepository.save(any(LabTest.class))).thenReturn(labTest);

        LabTestResponse response = labService.createLabTest(labTestRequest);

        assertNotNull(response);
        assertEquals(labTest.getId(), response.getId());
        assertEquals(labTest.getPatientId(), response.getPatientId());
        verify(labTestRepository, times(1)).save(any(LabTest.class));
    }

    @Test
    void testGetLabTestById_Success() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.of(labTest));

        LabTestResponse response = labService.getLabTestById(1L);

        assertNotNull(response);
        assertEquals(labTest.getId(), response.getId());
        assertEquals(labTest.getPatientId(), response.getPatientId());
    }

    @Test
    void testGetLabTestById_NotFound() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(LabTestNotFoundException.class, () -> {
            labService.getLabTestById(1L);
        });
    }

    @Test
    void testGetLabTestsByPatientId_Success() {
        List<LabTest> labTests = Arrays.asList(labTest);
        when(labTestRepository.findByPatientId(1L)).thenReturn(labTests);

        List<LabTestResponse> responses = labService.getLabTestsByPatientId(1L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(labTest.getId(), responses.get(0).getId());
    }

    @Test
    void testUpdateLabTest_Success() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.of(labTest));
        when(labTestRepository.save(any(LabTest.class))).thenReturn(labTest);

        LabTestResponse response = labService.updateLabTest(1L, labTestRequest);

        assertNotNull(response);
        assertEquals(labTest.getId(), response.getId());
        verify(labTestRepository, times(1)).save(any(LabTest.class));
    }

    @Test
    void testUpdateLabTest_NotFound() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(LabTestNotFoundException.class, () -> {
            labService.updateLabTest(1L, labTestRequest);
        });
    }

    @Test
    void testDeleteLabTest_Success() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.of(labTest));
        doNothing().when(labTestRepository).deleteById(1L);

        labService.deleteLabTest(1L);

        verify(labTestRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteLabTest_NotFound() {
        when(labTestRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(LabTestNotFoundException.class, () -> {
            labService.deleteLabTest(1L);
        });
    }

    @Test
    void testGetAllLabTests_Success() {
        List<LabTest> labTests = Arrays.asList(labTest);
        when(labTestRepository.findAll()).thenReturn(labTests);

        List<LabTestResponse> responses = labService.getAllLabTests();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(labTest.getId(), responses.get(0).getId());
    }

    @Test
    void testGetLabTestsByStatus_Success() {
        List<LabTest> labTests = Arrays.asList(labTest);
        when(labTestRepository.findByStatus(LabTestStatus.PENDING)).thenReturn(labTests);

        List<LabTestResponse> responses = labService.getLabTestsByStatus(LabTestStatus.PENDING);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(labTest.getId(), responses.get(0).getId());
    }
} 