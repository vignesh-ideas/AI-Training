package com.exception;

import lombok.Getter;

@Getter
public class VotingAppException extends RuntimeException {
    
    private final String errorCode;
    private final int httpStatus;
    
    public VotingAppException(String message, String errorCode, int httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
    
    public VotingAppException(String message, String errorCode, int httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
} 