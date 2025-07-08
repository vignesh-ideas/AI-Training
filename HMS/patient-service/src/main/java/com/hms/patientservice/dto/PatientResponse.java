package com.hms.patientservice.dto;

import com.hms.patientservice.entity.Gender;
import com.hms.patientservice.entity.PatientStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientResponse {
    
    private Long id;
    private String patientNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String email;
    private String phoneNumber;
    private String emergencyContact;
    private String emergencyPhone;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    private String currentMedications;
    private String insuranceProvider;
    private String insuranceNumber;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private PatientStatus status;
    private Long assignedDoctorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public PatientResponse() {}
    
    public PatientResponse(Long id, String patientNumber, String firstName, String lastName, LocalDate dateOfBirth,
                         Gender gender, String email, String phoneNumber, String emergencyContact, String emergencyPhone,
                         String bloodGroup, String allergies, String medicalHistory, String currentMedications,
                         String insuranceProvider, String insuranceNumber, String address, String city, String state,
                         String zipCode, String country, PatientStatus status, Long assignedDoctorId,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientNumber = patientNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.emergencyContact = emergencyContact;
        this.emergencyPhone = emergencyPhone;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.medicalHistory = medicalHistory;
        this.currentMedications = currentMedications;
        this.insuranceProvider = insuranceProvider;
        this.insuranceNumber = insuranceNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.status = status;
        this.assignedDoctorId = assignedDoctorId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPatientNumber() {
        return patientNumber;
    }
    
    public void setPatientNumber(String patientNumber) {
        this.patientNumber = patientNumber;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public Gender getGender() {
        return gender;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getEmergencyContact() {
        return emergencyContact;
    }
    
    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }
    
    public String getEmergencyPhone() {
        return emergencyPhone;
    }
    
    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }
    
    public String getBloodGroup() {
        return bloodGroup;
    }
    
    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }
    
    public String getAllergies() {
        return allergies;
    }
    
    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }
    
    public String getMedicalHistory() {
        return medicalHistory;
    }
    
    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }
    
    public String getCurrentMedications() {
        return currentMedications;
    }
    
    public void setCurrentMedications(String currentMedications) {
        this.currentMedications = currentMedications;
    }
    
    public String getInsuranceProvider() {
        return insuranceProvider;
    }
    
    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }
    
    public String getInsuranceNumber() {
        return insuranceNumber;
    }
    
    public void setInsuranceNumber(String insuranceNumber) {
        this.insuranceNumber = insuranceNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public PatientStatus getStatus() {
        return status;
    }
    
    public void setStatus(PatientStatus status) {
        this.status = status;
    }
    
    public Long getAssignedDoctorId() {
        return assignedDoctorId;
    }
    
    public void setAssignedDoctorId(Long assignedDoctorId) {
        this.assignedDoctorId = assignedDoctorId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public int getAge() {
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }
    
    public boolean isActive() {
        return PatientStatus.ACTIVE.equals(status);
    }
    
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (this.address != null) address.append(this.address);
        if (this.city != null) address.append(", ").append(this.city);
        if (this.state != null) address.append(", ").append(this.state);
        if (this.zipCode != null) address.append(" ").append(this.zipCode);
        if (this.country != null) address.append(", ").append(this.country);
        return address.toString();
    }
    
    @Override
    public String toString() {
        return "PatientResponse{" +
                "id=" + id +
                ", patientNumber='" + patientNumber + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender=" + gender +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", emergencyContact='" + emergencyContact + '\'' +
                ", emergencyPhone='" + emergencyPhone + '\'' +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", allergies='" + allergies + '\'' +
                ", medicalHistory='" + medicalHistory + '\'' +
                ", currentMedications='" + currentMedications + '\'' +
                ", insuranceProvider='" + insuranceProvider + '\'' +
                ", insuranceNumber='" + insuranceNumber + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", zipCode='" + zipCode + '\'' +
                ", country='" + country + '\'' +
                ", status=" + status +
                ", assignedDoctorId=" + assignedDoctorId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 