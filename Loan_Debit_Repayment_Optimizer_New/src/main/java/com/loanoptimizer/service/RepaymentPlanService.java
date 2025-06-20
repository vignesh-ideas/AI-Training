package com.loanoptimizer.service;

import com.loanoptimizer.domain.RepaymentPlan;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.RepaymentPlanRequest;
import com.loanoptimizer.dto.RepaymentPlanResponse;
import com.loanoptimizer.repository.RepaymentPlanRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RepaymentPlanService {
    private final RepaymentPlanRepository planRepository;
    private final UserRepository userRepository;

    @Autowired
    public RepaymentPlanService(RepaymentPlanRepository planRepository, UserRepository userRepository) {
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

    @Transactional
    public RepaymentPlanResponse createPlan(RepaymentPlanRequest request) {
        User user = getCurrentUser();
        RepaymentPlan plan = toPlan(request);
        plan.setUser(user);
        RepaymentPlan saved = planRepository.save(plan);
        return toPlanResponse(saved);
    }

    public List<RepaymentPlanResponse> listPlans(Optional<String> status) {
        User user = getCurrentUser();
        List<RepaymentPlan> plans = status.isPresent()
                ? planRepository.findByUserAndStatus(user, status.get())
                : planRepository.findByUser(user);
        return plans.stream().map(this::toPlanResponse).collect(Collectors.toList());
    }

    public RepaymentPlanResponse getPlan(Long id) {
        User user = getCurrentUser();
        RepaymentPlan plan = planRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found or forbidden"));
        return toPlanResponse(plan);
    }

    @Transactional
    public RepaymentPlanResponse updatePlan(Long id, RepaymentPlanRequest request) {
        User user = getCurrentUser();
        RepaymentPlan plan = planRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found or forbidden"));
        updatePlanFromRequest(plan, request);
        RepaymentPlan saved = planRepository.save(plan);
        return toPlanResponse(saved);
    }

    @Transactional
    public void deletePlan(Long id) {
        User user = getCurrentUser();
        RepaymentPlan plan = planRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found or forbidden"));
        planRepository.delete(plan);
    }

    private RepaymentPlan toPlan(RepaymentPlanRequest req) {
        RepaymentPlan p = new RepaymentPlan();
        p.setStrategyType(req.getStrategyType());
        p.setStartDate(req.getStartDate());
        p.setTargetCompletion(req.getTargetCompletion());
        p.setMonthlyBudget(req.getMonthlyBudget());
        p.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        return p;
    }

    private void updatePlanFromRequest(RepaymentPlan p, RepaymentPlanRequest req) {
        if (req.getStrategyType() != null) p.setStrategyType(req.getStrategyType());
        if (req.getStartDate() != null) p.setStartDate(req.getStartDate());
        if (req.getTargetCompletion() != null) p.setTargetCompletion(req.getTargetCompletion());
        if (req.getMonthlyBudget() != null) p.setMonthlyBudget(req.getMonthlyBudget());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
    }

    private RepaymentPlanResponse toPlanResponse(RepaymentPlan p) {
        RepaymentPlanResponse resp = new RepaymentPlanResponse();
        resp.setId(p.getId());
        resp.setStrategyType(p.getStrategyType());
        resp.setStartDate(p.getStartDate());
        resp.setTargetCompletion(p.getTargetCompletion());
        resp.setMonthlyBudget(p.getMonthlyBudget());
        resp.setStatus(p.getStatus());
        return resp;
    }
} 