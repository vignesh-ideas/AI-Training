package com.loanoptimizer.controller;

import com.loanoptimizer.dto.SimulationRequest;
import com.loanoptimizer.dto.SimulationResult;
import com.loanoptimizer.service.SimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulations")
public class SimulationController {
    private final SimulationService simulationService;

    @Autowired
    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/run")
    public ResponseEntity<SimulationResult> runSimulation(@RequestBody SimulationRequest request) {
        SimulationResult result = simulationService.runSimulation(request);
        return ResponseEntity.ok(result);
    }
} 