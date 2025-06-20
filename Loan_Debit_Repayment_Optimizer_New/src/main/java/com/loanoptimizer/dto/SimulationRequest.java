package com.loanoptimizer.dto;

import java.math.BigDecimal;
import java.util.List;

public class SimulationRequest {
    private Long userId;
    private List<DebtInput> debts;
    private BigDecimal monthlyIncome;
    private SimulationStrategy strategy;
    private SimulationPreferences preferences;

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<DebtInput> getDebts() { return debts; }
    public void setDebts(List<DebtInput> debts) { this.debts = debts; }
    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public SimulationStrategy getStrategy() { return strategy; }
    public void setStrategy(SimulationStrategy strategy) { this.strategy = strategy; }
    public SimulationPreferences getPreferences() { return preferences; }
    public void setPreferences(SimulationPreferences preferences) { this.preferences = preferences; }

    // Nested DTOs for input
    public static class DebtInput {
        private Long debtId;
        private String name;
        private BigDecimal principal;
        private BigDecimal interestRate;
        private BigDecimal minPayment;
        // Getters and setters
        public Long getDebtId() { return debtId; }
        public void setDebtId(Long debtId) { this.debtId = debtId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getPrincipal() { return principal; }
        public void setPrincipal(BigDecimal principal) { this.principal = principal; }
        public BigDecimal getInterestRate() { return interestRate; }
        public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
        public BigDecimal getMinPayment() { return minPayment; }
        public void setMinPayment(BigDecimal minPayment) { this.minPayment = minPayment; }
    }
    public static class SimulationPreferences {
        private boolean allowExtraPayments;
        private BigDecimal extraPaymentAmount;
        // Getters and setters
        public boolean isAllowExtraPayments() { return allowExtraPayments; }
        public void setAllowExtraPayments(boolean allowExtraPayments) { this.allowExtraPayments = allowExtraPayments; }
        public BigDecimal getExtraPaymentAmount() { return extraPaymentAmount; }
        public void setExtraPaymentAmount(BigDecimal extraPaymentAmount) { this.extraPaymentAmount = extraPaymentAmount; }
    }
} 