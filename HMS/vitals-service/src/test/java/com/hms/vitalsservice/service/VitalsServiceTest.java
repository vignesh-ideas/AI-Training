package com.hms.vitalsservice.service;

import com.hms.vitalsservice.dto.VitalsRequest;
import com.hms.vitalsservice.dto.VitalsResponse;
import com.hms.vitalsservice.entity.Vitals;
import com.hms.vitalsservice.entity.VitalsStatus;
import com.hms.vitalsservice.exception.VitalsNotFoundException;
import com.hms.vitalsservice.repository.VitalsRepository;
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
class VitalsServiceTest {

    @Mock
    private VitalsRepository vitalsRepository;

    @InjectMocks
    private VitalsService vitalsService;

    private Vitals vitals;
    private VitalsRequest vitalsRequest;

    @BeforeEach
    void setUp() {
        vitals = new Vitals();
        vitals.setId(1L);
        vitals.setPatientId(1L);
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(75);
        vitals.setTemperature(98.6);
        vitals.setWeight(70.5);
        vitals.setHeight(175.0);
        vitals.setStatus(VitalsStatus.NORMAL);
        vitals.setRecordedAt(LocalDateTime.now());

        vitalsRequest = new VitalsRequest();
        vitalsRequest.setPatientId(1L);
        vitalsRequest.setBloodPressure("120/80");
        vitalsRequest.setHeartRate(75);
        vitalsRequest.setTemperature(98.6);
        vitalsRequest.setWeight(70.5);
        vitalsRequest.setHeight(175.0);
    }

    @Test
    void testCreateVitals_Success() {
        when(vitalsRepository.save(any(Vitals.class))).thenReturn(vitals);

        VitalsResponse response = vitalsService.createVitals(vitalsRequest);

        assertNotNull(response);
        assertEquals(vitals.getId(), response.getId());
        assertEquals(vitals.getPatientId(), response.getPatientId());
        verify(vitalsRepository, times(1)).save(any(Vitals.class));
    }

    @Test
    void testGetVitalsById_Success() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.of(vitals));

        VitalsResponse response = vitalsService.getVitalsById(1L);

        assertNotNull(response);
        assertEquals(vitals.getId(), response.getId());
        assertEquals(vitals.getPatientId(), response.getPatientId());
    }

    @Test
    void testGetVitalsById_NotFound() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(VitalsNotFoundException.class, () -> {
            vitalsService.getVitalsById(1L);
        });
    }

    @Test
    void testGetVitalsByPatientId_Success() {
        List<Vitals> vitalsList = Arrays.asList(vitals);
        when(vitalsRepository.findByPatientId(1L)).thenReturn(vitalsList);

        List<VitalsResponse> responses = vitalsService.getVitalsByPatientId(1L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(vitals.getId(), responses.get(0).getId());
    }

    @Test
    void testUpdateVitals_Success() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.of(vitals));
        when(vitalsRepository.save(any(Vitals.class))).thenReturn(vitals);

        VitalsResponse response = vitalsService.updateVitals(1L, vitalsRequest);

        assertNotNull(response);
        assertEquals(vitals.getId(), response.getId());
        verify(vitalsRepository, times(1)).save(any(Vitals.class));
    }

    @Test
    void testUpdateVitals_NotFound() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(VitalsNotFoundException.class, () -> {
            vitalsService.updateVitals(1L, vitalsRequest);
        });
    }

    @Test
    void testDeleteVitals_Success() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.of(vitals));
        doNothing().when(vitalsRepository).deleteById(1L);

        vitalsService.deleteVitals(1L);

        verify(vitalsRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteVitals_NotFound() {
        when(vitalsRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(VitalsNotFoundException.class, () -> {
            vitalsService.deleteVitals(1L);
        });
    }

    @Test
    void testGetAllVitals_Success() {
        List<Vitals> vitalsList = Arrays.asList(vitals);
        when(vitalsRepository.findAll()).thenReturn(vitalsList);

        List<VitalsResponse> responses = vitalsService.getAllVitals();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(vitals.getId(), responses.get(0).getId());
    }
} 