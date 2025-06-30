package com.exception;

public class VotingException extends VotingAppException {
    
    public VotingException(String message) {
        super(message, "VOTING_ERROR", 400);
    }
    
    public VotingException(String message, Throwable cause) {
        super(message, "VOTING_ERROR", 400, cause);
    }
} 