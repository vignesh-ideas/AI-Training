package com.loanoptimizer.repository;

import com.loanoptimizer.domain.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationRepository extends JpaRepository<Simulation, Long> {
    // Optionally, add custom query methods here
} 