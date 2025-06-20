package com.loanoptimizer.dto;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Double income;
    private Double budget;
    private Double emergencyFund;
    private String strategyPref;
    private String notificationSettings;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
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