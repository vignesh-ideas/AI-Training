package com.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.dto.ErrorResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    // Custom Exceptions
    @ExceptionHandler(VotingAppException.class)
    public ResponseEntity<ErrorResponse> handleVotingAppException(VotingAppException ex, WebRequest request) {
        logger.error("VotingApp Exception: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            ex.getErrorCode(),
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.valueOf(ex.getHttpStatus()));
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        logger.warn("User not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "USER_NOT_FOUND",
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(CandidateNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCandidateNotFoundException(CandidateNotFoundException ex, WebRequest request) {
        logger.warn("Candidate not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "CANDIDATE_NOT_FOUND",
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUserException(DuplicateUserException ex, WebRequest request) {
        logger.warn("Duplicate user: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "DUPLICATE_USER",
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(VotingException.class)
    public ResponseEntity<ErrorResponse> handleVotingException(VotingException ex, WebRequest request) {
        logger.error("Voting error: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "VOTING_ERROR",
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex, WebRequest request) {
        logger.warn("Validation error: {}", ex.getMessage());

        Map<String, Object> fieldErrors = null;
        if (ex.getFieldErrors() != null) {
            fieldErrors = new HashMap<>();
            for (Map.Entry<String, java.util.List<String>> entry : ex.getFieldErrors().entrySet()) {
                fieldErrors.put(entry.getKey(), entry.getValue());
            }
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("VALIDATION_ERROR")
            .message(ex.getMessage())
            .path(request.getDescription(false))
            .method(request.getDescription(false))
            .timestamp(java.time.LocalDateTime.now())
            .fieldErrors(fieldErrors)
            .build();

        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // Spring Framework Exceptions
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        logger.warn("Validation error: {}", ex.getMessage());
        
        Map<String, Object> localFieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.groupingBy(
                FieldError::getField,
                Collectors.mapping(FieldError::getDefaultMessage, Collectors.collectingAndThen(Collectors.toList(), list -> (Object) list))
            ));
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("VALIDATION_ERROR")
            .message("Validation failed")
            .path(request.getDescription(false))
            .method(request.getDescription(false))
            .timestamp(java.time.LocalDateTime.now())
            .fieldErrors(localFieldErrors)
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        logger.warn("Type mismatch: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "TYPE_MISMATCH",
            "Invalid parameter type for: " + ex.getName(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // Security Exceptions
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        logger.warn("Access denied: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "ACCESS_DENIED",
            "Access denied. You don't have permission to perform this action.",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        logger.warn("Bad credentials: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "BAD_CREDENTIALS",
            "Invalid username or password",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException ex, WebRequest request) {
        logger.warn("Username not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "USERNAME_NOT_FOUND",
            "User not found with the provided credentials",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    // Database Exceptions
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        logger.error("Data integrity violation: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "DATA_INTEGRITY_VIOLATION",
            "Data integrity constraint violation",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        logger.warn("Entity not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "ENTITY_NOT_FOUND",
            ex.getMessage(),
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
        logger.warn("Constraint violation: {}", ex.getMessage());
        
        Map<String, Object> fieldErrors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            fieldErrors.put(fieldName, java.util.List.of(message));
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("CONSTRAINT_VIOLATION")
            .message("Constraint violation")
            .path(request.getDescription(false))
            .method(request.getDescription(false))
            .timestamp(java.time.LocalDateTime.now())
            .fieldErrors(fieldErrors)
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // Generic Exception Handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred. Please try again later.",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // Async Exception Handler
    @ExceptionHandler(java.util.concurrent.CompletionException.class)
    public ResponseEntity<ErrorResponse> handleCompletionException(java.util.concurrent.CompletionException ex, WebRequest request) {
        logger.error("Async operation failed: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "ASYNC_OPERATION_FAILED",
            "Asynchronous operation failed",
            request.getDescription(false),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 