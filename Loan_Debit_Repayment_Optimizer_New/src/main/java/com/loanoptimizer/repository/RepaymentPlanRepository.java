package com.loanoptimizer.repository;

import com.loanoptimizer.domain.RepaymentPlan;
import com.loanoptimizer.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepaymentPlanRepository extends JpaRepository<RepaymentPlan, Long> {
    List<RepaymentPlan> findByUser(User user);
    List<RepaymentPlan> findByUserAndStatus(User user, String status);
    Optional<RepaymentPlan> findByIdAndUser(Long id, User user);
} 