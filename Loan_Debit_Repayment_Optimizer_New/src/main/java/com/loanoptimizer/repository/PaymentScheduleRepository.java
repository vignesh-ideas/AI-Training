package com.loanoptimizer.repository;

import com.loanoptimizer.domain.PaymentSchedule;
import com.loanoptimizer.domain.RepaymentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentScheduleRepository extends JpaRepository<PaymentSchedule, Long> {
    List<PaymentSchedule> findByPlan(RepaymentPlan plan);
} 