package com.exception;

public class DuplicateUserException extends VotingAppException {
    
    public DuplicateUserException(String message) {
        super(message, "DUPLICATE_USER", 409);
    }
    
    public DuplicateUserException(String message, Throwable cause) {
        super(message, "DUPLICATE_USER", 409, cause);
    }
} 