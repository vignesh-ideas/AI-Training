package com.hms.vitalsservice.exception;

public class VitalSignsNotFoundException extends RuntimeException {
    
    public VitalSignsNotFoundException(String message) {
        super(message);
    }
    
    public VitalSignsNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 