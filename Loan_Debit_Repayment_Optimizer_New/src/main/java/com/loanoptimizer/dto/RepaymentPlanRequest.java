package com.loanoptimizer.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class RepaymentPlanRequest {
    @NotBlank
    @Size(max = 20)
    private String strategyType;

    @NotNull
    private LocalDate startDate;

    private LocalDate targetCompletion;
    private Double monthlyBudget;
    @Size(max = 20)
    private String status = "active";

    // Getters and setters
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