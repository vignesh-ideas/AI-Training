package com.hms.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.userservice.dto.UserRegistrationRequest;
import com.hms.userservice.dto.UserResponse;
import com.hms.userservice.entity.UserRole;
import com.hms.userservice.service.UserService;
import com.hms.userservice.exception.UserRegistrationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserRegistrationRequest registrationRequest;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        // Setup UserRegistrationRequest
        registrationRequest = new UserRegistrationRequest();
        registrationRequest.setUsername("testuser");
        registrationRequest.setEmail("test@example.com");
        registrationRequest.setPassword("password123");
        registrationRequest.setFirstName("John");
        registrationRequest.setLastName("Doe");
        registrationRequest.setPhoneNumber("1234567890");
        registrationRequest.setRole(UserRole.PATIENT);

        // Setup UserResponse
        userResponse = new UserResponse();
        userResponse.setId(1L);
        userResponse.setUsername("testuser");
        userResponse.setEmail("test@example.com");
        userResponse.setFirstName("John");
        userResponse.setLastName("Doe");
        userResponse.setPhoneNumber("1234567890");
        userResponse.setRole(UserRole.PATIENT);
    }

    @Test
    void registerUser_Success() throws Exception {
        // Arrange
        when(userService.registerUser(any(UserRegistrationRequest.class)))
            .thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.role").value("PATIENT"));

        verify(userService).registerUser(any(UserRegistrationRequest.class));
    }

    @Test
    void registerUser_ValidationError() throws Exception {
        // Arrange
        registrationRequest.setUsername(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());

        verify(userService, never()).registerUser(any());
    }

    @Test
    void registerUser_RegistrationException() throws Exception {
        // Arrange
        when(userService.registerUser(any(UserRegistrationRequest.class)))
            .thenThrow(new UserRegistrationException("Username already exists"));

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());

        verify(userService).registerUser(any(UserRegistrationRequest.class));
    }

    @Test
    void getUserById_Success() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserById(1L);
    }

    @Test
    void getUserById_NotFound() throws Exception {
        // Arrange
        when(userService.getUserById(999L))
            .thenThrow(new RuntimeException("User not found"));

        // Act & Assert
        mockMvc.perform(get("/api/users/999"))
            .andExpect(status().isNotFound());

        verify(userService).getUserById(999L);
    }

    @Test
    void getUserByUsername_Success() throws Exception {
        // Arrange
        when(userService.getUserByUsername("testuser")).thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(get("/api/users/username/testuser"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserByUsername("testuser");
    }

    @Test
    void getUserByUsername_NotFound() throws Exception {
        // Arrange
        when(userService.getUserByUsername("nonexistent"))
            .thenThrow(new RuntimeException("User not found"));

        // Act & Assert
        mockMvc.perform(get("/api/users/username/nonexistent"))
            .andExpect(status().isNotFound());

        verify(userService).getUserByUsername("nonexistent");
    }

    @Test
    void getAllUsers_Success() throws Exception {
        // Arrange
        List<UserResponse> users = Arrays.asList(userResponse);
        when(userService.getAllUsers()).thenReturn(users);

        // Act & Assert
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].username").value("testuser"));

        verify(userService).getAllUsers();
    }

    @Test
    void updateUser_Success() throws Exception {
        // Arrange
        when(userService.updateUser(eq(1L), any(UserRegistrationRequest.class)))
            .thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).updateUser(eq(1L), any(UserRegistrationRequest.class));
    }

    @Test
    void updateUser_NotFound() throws Exception {
        // Arrange
        when(userService.updateUser(eq(999L), any(UserRegistrationRequest.class)))
            .thenThrow(new RuntimeException("User not found"));

        // Act & Assert
        mockMvc.perform(put("/api/users/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isNotFound());

        verify(userService).updateUser(eq(999L), any(UserRegistrationRequest.class));
    }

    @Test
    void deleteUser_Success() throws Exception {
        // Arrange
        doNothing().when(userService).deleteUser(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/1"))
            .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    void deleteUser_NotFound() throws Exception {
        // Arrange
        doThrow(new RuntimeException("User not found"))
            .when(userService).deleteUser(999L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/999"))
            .andExpect(status().isNotFound());

        verify(userService).deleteUser(999L);
    }
} 