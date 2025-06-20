package com.loanoptimizer.dto;

import java.time.LocalDate;

public class RepaymentPlanResponse {
    private Long id;
    private String strategyType;
    private LocalDate startDate;
    private LocalDate targetCompletion;
    private Double monthlyBudget;
    private String status;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStrategyType() { return strategyType; }
    public void setStrategyType(String strategyType) { this.strategyType = strategyType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getTargetCompletion() { return targetCompletion; }
    public void setTargetCompletion(LocalDate targetCompletion) { this.targetCompletion = targetCompletion; }
    public Double getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(Double monthlyBudget) { this.monthlyBudget = monthlyBudget; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 