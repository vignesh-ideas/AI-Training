package com.exception;

public class CandidateNotFoundException extends VotingAppException {
    
    public CandidateNotFoundException(String message) {
        super(message, "CANDIDATE_NOT_FOUND", 404);
    }
    
    public CandidateNotFoundException(String message, Throwable cause) {
        super(message, "CANDIDATE_NOT_FOUND", 404, cause);
    }
} 