package com.loanoptimizer.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class DebtRequest {
    @NotBlank
    @Size(max = 50)
    private String type;

    @Size(max = 100)
    private String lenderName;

    @Size(max = 100)
    private String lenderContact;

    @NotNull
    private Double balance;

    @NotNull
    private Double apr;

    @NotNull
    private Double minPayment;

    @NotNull
    private LocalDate dueDate;

    private Integer loanTermMonths;
    private Boolean secured = false;
    @Size(max = 20)
    private String status = "active";

    // Getters and setters
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
} 