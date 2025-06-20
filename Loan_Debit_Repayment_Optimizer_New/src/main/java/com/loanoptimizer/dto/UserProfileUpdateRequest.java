package com.loanoptimizer.dto;

import javax.validation.constraints.Size;
import java.math.BigDecimal;

public class UserProfileUpdateRequest {
    @Size(max = 100)
    private String name;
    @Size(max = 20)
    private String phone;
    private Double income;
    private Double budget;
    private Double emergencyFund;
    @Size(max = 50)
    private String strategyPref;
    @Size(max = 100)
    private String notificationSettings;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Double getIncome() { return income; }
    public void setIncome(Double income) { this.income = income; }
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    public Double getEmergencyFund() { return emergencyFund; }
    public void setEmergencyFund(Double emergencyFund) { this.emergencyFund = emergencyFund; }
    public String getStrategyPref() { return strategyPref; }
    public void setStrategyPref(String strategyPref) { this.strategyPref = strategyPref; }
    public String getNotificationSettings() { return notificationSettings; }
    public void setNotificationSettings(String notificationSettings) { this.notificationSettings = notificationSettings; }
} 