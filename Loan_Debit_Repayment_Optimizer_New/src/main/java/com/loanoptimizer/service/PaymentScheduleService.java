package com.loanoptimizer.service;

import com.loanoptimizer.domain.PaymentSchedule;
import com.loanoptimizer.domain.RepaymentPlan;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.PaymentScheduleResponse;
import com.loanoptimizer.repository.PaymentScheduleRepository;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentScheduleService {
    private final PaymentScheduleRepository scheduleRepository;
    private final RepaymentPlanRepository planRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentScheduleService(PaymentScheduleRepository scheduleRepository, RepaymentPlanRepository planRepository, UserRepository userRepository) {
        this.scheduleRepository = scheduleRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails)
                ? ((UserDetails) principal).getUsername()
                : principal.toString();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<PaymentScheduleResponse> getSchedulesForPlan(Long planId) {
        User user = getCurrentUser();
        RepaymentPlan plan = planRepository.findByIdAndUser(planId, user)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found or forbidden"));
        List<PaymentSchedule> schedules = scheduleRepository.findByPlan(plan);
        return schedules.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PaymentScheduleResponse toResponse(PaymentSchedule s) {
        PaymentScheduleResponse resp = new PaymentScheduleResponse();
        resp.setId(s.getId());
        resp.setDebtId(s.getDebt().getId());
        resp.setPaymentDate(s.getPaymentDate());
        resp.setPaymentAmount(s.getPaymentAmount());
        resp.setPrincipalAmount(s.getPrincipalAmount());
        resp.setInterestAmount(s.getInterestAmount());
        resp.setStatus(s.getStatus());
        return resp;
    }
} 