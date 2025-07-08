package com.hms.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.userservice.dto.UserLoginRequest;
import com.hms.userservice.dto.UserLoginResponse;
import com.hms.userservice.entity.UserRole;
import com.hms.userservice.service.AuthenticationService;
import com.hms.userservice.exception.AuthenticationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserLoginRequest loginRequest;
    private UserLoginResponse loginResponse;

    @BeforeEach
    void setUp() {
        // Setup UserLoginRequest
        loginRequest = new UserLoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        // Setup UserLoginResponse
        loginResponse = new UserLoginResponse();
        loginResponse.setToken("jwtToken123");
        loginResponse.setUsername("testuser");
        loginResponse.setRole(UserRole.PATIENT);
        loginResponse.setMessage("Login successful");
    }

    @Test
    void login_Success() throws Exception {
        // Arrange
        when(authenticationService.authenticateUser(any(UserLoginRequest.class)))
            .thenReturn(loginResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwtToken123"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.role").value("PATIENT"))
            .andExpect(jsonPath("$.message").value("Login successful"));

        verify(authenticationService).authenticateUser(any(UserLoginRequest.class));
    }

    @Test
    void login_ValidationError() throws Exception {
        // Arrange
        loginRequest.setUsername(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest());

        verify(authenticationService, never()).authenticateUser(any());
    }

    @Test
    void login_AuthenticationException() throws Exception {
        // Arrange
        when(authenticationService.authenticateUser(any(UserLoginRequest.class)))
            .thenThrow(new AuthenticationException("Invalid credentials"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized());

        verify(authenticationService).authenticateUser(any(UserLoginRequest.class));
    }

    @Test
    void logout_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void validateToken_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer jwtToken123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    void validateToken_NoToken() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/validate"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void validateToken_InvalidToken() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer invalidToken"))
            .andExpect(status().isUnauthorized());
    }
} 