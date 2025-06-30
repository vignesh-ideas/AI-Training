package com.exception;

import java.util.List;
import java.util.Map;

public class ValidationException extends VotingAppException {
    
    private final Map<String, List<String>> fieldErrors;
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", 400);
        this.fieldErrors = null;
    }
    
    public ValidationException(String message, Map<String, List<String>> fieldErrors) {
        super(message, "VALIDATION_ERROR", 400);
        this.fieldErrors = fieldErrors;
    }
    
    public ValidationException(String message, Map<String, List<String>> fieldErrors, Throwable cause) {
        super(message, "VALIDATION_ERROR", 400, cause);
        this.fieldErrors = fieldErrors;
    }
    
    public Map<String, List<String>> getFieldErrors() {
        return fieldErrors;
    }
} 