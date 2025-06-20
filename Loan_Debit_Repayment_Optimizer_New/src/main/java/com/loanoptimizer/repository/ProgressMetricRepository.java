package com.loanoptimizer.repository;

import com.loanoptimizer.domain.ProgressMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressMetricRepository extends JpaRepository<ProgressMetric, Long> {
    // Optionally, add custom query methods here
} 