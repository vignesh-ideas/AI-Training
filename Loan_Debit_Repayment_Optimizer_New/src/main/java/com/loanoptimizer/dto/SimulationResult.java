package com.loanoptimizer.dto;

import java.math.BigDecimal;
import java.util.List;

public class SimulationResult {
    private SimulationSummary summary;
    private List<PaymentProjection> paymentSchedule;
    private SimulationStrategy strategy;

    // Getters and setters
    public SimulationSummary getSummary() { return summary; }
    public void setSummary(SimulationSummary summary) { this.summary = summary; }
    public List<PaymentProjection> getPaymentSchedule() { return paymentSchedule; }
    public void setPaymentSchedule(List<PaymentProjection> paymentSchedule) { this.paymentSchedule = paymentSchedule; }
    public SimulationStrategy getStrategy() { return strategy; }
    public void setStrategy(SimulationStrategy strategy) { this.strategy = strategy; }

    // Nested DTOs for output
    public static class SimulationSummary {
        private BigDecimal totalInterestPaid;
        private int totalMonths;
        private BigDecimal totalPaid;
        // Getters and setters
        public BigDecimal getTotalInterestPaid() { return totalInterestPaid; }
        public void setTotalInterestPaid(BigDecimal totalInterestPaid) { this.totalInterestPaid = totalInterestPaid; }
        public int getTotalMonths() { return totalMonths; }
        public void setTotalMonths(int totalMonths) { this.totalMonths = totalMonths; }
        public BigDecimal getTotalPaid() { return totalPaid; }
        public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }
    }
    public static class PaymentProjection {
        private int month;
        private List<DebtPayment> debtPayments;
        // Getters and setters
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }
        public List<DebtPayment> getDebtPayments() { return debtPayments; }
        public void setDebtPayments(List<DebtPayment> debtPayments) { this.debtPayments = debtPayments; }
    }
    public static class DebtPayment {
        private Long debtId;
        private String name;
        private BigDecimal paymentAmount;
        private BigDecimal remainingPrincipal;
        // Getters and setters
        public Long getDebtId() { return debtId; }
        public void setDebtId(Long debtId) { this.debtId = debtId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getPaymentAmount() { return paymentAmount; }
        public void setPaymentAmount(BigDecimal paymentAmount) { this.paymentAmount = paymentAmount; }
        public BigDecimal getRemainingPrincipal() { return remainingPrincipal; }
        public void setRemainingPrincipal(BigDecimal remainingPrincipal) { this.remainingPrincipal = remainingPrincipal; }
    }
} 