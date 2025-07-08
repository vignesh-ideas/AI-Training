package com.hms.patientservice.dto;

import com.hms.patientservice.entity.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class PatientRegistrationRequest {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name can only contain letters and spaces")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name can only contain letters and spaces")
    private String lastName;
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    @Email(message = "Email should be valid")
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    private String emergencyContact;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Emergency phone number should be valid")
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
    
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "ZIP code should be valid")
    private String zipCode;
    
    private String country;
    
    private Long assignedDoctorId;
    
    // Constructors
    public PatientRegistrationRequest() {}
    
    public PatientRegistrationRequest(String firstName, String lastName, LocalDate dateOfBirth, Gender gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
    }
    
    // Getters and Setters
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
    
    public Long getAssignedDoctorId() {
        return assignedDoctorId;
    }
    
    public void setAssignedDoctorId(Long assignedDoctorId) {
        this.assignedDoctorId = assignedDoctorId;
    }
    
    @Override
    public String toString() {
        return "PatientRegistrationRequest{" +
                "firstName='" + firstName + '\'' +
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
                ", assignedDoctorId=" + assignedDoctorId +
                '}';
    }
} 