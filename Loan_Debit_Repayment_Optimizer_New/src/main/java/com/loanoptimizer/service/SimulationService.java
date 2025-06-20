package com.loanoptimizer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanoptimizer.domain.Simulation;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.SimulationRequest;
import com.loanoptimizer.dto.SimulationResult;
import com.loanoptimizer.dto.SimulationStrategy;
import com.loanoptimizer.repository.SimulationRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SimulationService {
    private final SimulationRepository simulationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public SimulationService(SimulationRepository simulationRepository, UserRepository userRepository) {
        this.simulationRepository = simulationRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public SimulationResult runSimulation(SimulationRequest request) {
        // 1. Fetch user
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();

        // 2. Run selected strategy (stub for now)
        SimulationResult result;
        switch (request.getStrategy()) {
            case AVALANCHE:
                result = runAvalancheStrategy(request);
                break;
            case SNOWBALL:
                result = runSnowballStrategy(request);
                break;
            case CUSTOM:
                result = runCustomStrategy(request);
                break;
            default:
                throw new IllegalArgumentException("Unknown strategy");
        }

        // 3. Serialize input and result to JSON
        String inputJson;
        String resultJson;
        try {
            inputJson = objectMapper.writeValueAsString(request);
            resultJson = objectMapper.writeValueAsString(result);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize simulation data", e);
        }

        // 4. Save Simulation entity
        Simulation simulation = new Simulation();
        simulation.setUser(user);
        simulation.setInputJson(inputJson);
        simulation.setResultJson(resultJson);
        simulation.setStrategy(request.getStrategy().name());
        simulation.setCreatedAt(LocalDateTime.now());
        simulationRepository.save(simulation);

        // 5. Return result
        return result;
    }

    // Stub implementations for strategies
    private SimulationResult runAvalancheStrategy(SimulationRequest request) {
        // TODO: Implement actual avalanche logic
        return new SimulationResult();
    }
    private SimulationResult runSnowballStrategy(SimulationRequest request) {
        // TODO: Implement actual snowball logic
        return new SimulationResult();
    }
    private SimulationResult runCustomStrategy(SimulationRequest request) {
        // TODO: Implement actual custom logic
        return new SimulationResult();
    }
} 