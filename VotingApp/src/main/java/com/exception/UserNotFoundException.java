package com.exception;

public class UserNotFoundException extends VotingAppException {
    
    public UserNotFoundException(String message) {
        super(message, "USER_NOT_FOUND", 404);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, "USER_NOT_FOUND", 404, cause);
    }
} 