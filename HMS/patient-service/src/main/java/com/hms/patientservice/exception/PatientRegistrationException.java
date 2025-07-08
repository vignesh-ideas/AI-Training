package com.hms.patientservice.exception;

public class PatientRegistrationException extends RuntimeException {
    
    public PatientRegistrationException(String message) {
        super(message);
    }
    
    public PatientRegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
} 