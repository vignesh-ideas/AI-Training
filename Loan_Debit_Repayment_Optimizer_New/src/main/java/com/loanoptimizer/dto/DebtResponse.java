package com.loanoptimizer.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DebtResponse {
    private Long id;
    private String type;
    private String lenderName;
    private String lenderContact;
    private Double balance;
    private Double apr;
    private Double minPayment;
    private LocalDate dueDate;
    private Integer loanTermMonths;
    private Boolean secured;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLenderName() { return lenderName; }
    public void setLenderName(String lenderName) { this.lenderName = lenderName; }
    public String getLenderContact() { return lenderContact; }
    public void setLenderContact(String lenderContact) { this.lenderContact = lenderContact; }
    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
    public Double getApr() { return apr; }
    public void setApr(Double apr) { this.apr = apr; }
    public Double getMinPayment() { return minPayment; }
    public void setMinPayment(Double minPayment) { this.minPayment = minPayment; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Integer getLoanTermMonths() { return loanTermMonths; }
    public void setLoanTermMonths(Integer loanTermMonths) { this.loanTermMonths = loanTermMonths; }
    public Boolean getSecured() { return secured; }
    public void setSecured(Boolean secured) { this.secured = secured; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 