package com.hms.userservice.exception;

public class UserRegistrationException extends RuntimeException {
    
    public UserRegistrationException(String message) {
        super(message);
    }
    
    public UserRegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
} 