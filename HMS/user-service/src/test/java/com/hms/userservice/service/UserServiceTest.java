package com.hms.userservice.service;

import com.hms.userservice.dto.UserRegistrationRequest;
import com.hms.userservice.dto.UserResponse;
import com.hms.userservice.dto.UserLoginRequest;
import com.hms.userservice.dto.UserLoginResponse;
import com.hms.userservice.entity.User;
import com.hms.userservice.entity.UserRole;
import com.hms.userservice.entity.UserStatus;
import com.hms.userservice.exception.UserRegistrationException;
import com.hms.userservice.exception.AuthenticationException;
import com.hms.userservice.repository.UserRepository;
import com.hms.userservice.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private UserRegistrationRequest registrationRequest;
    private UserLoginRequest loginRequest;
    private User user;
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

        // Setup UserLoginRequest
        loginRequest = new UserLoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        // Setup User entity
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPhoneNumber("1234567890");
        user.setRole(UserRole.PATIENT);
        user.setStatus(UserStatus.ACTIVE);

        // Setup UserResponse
        userResponse = new UserResponse();
        userResponse.setId(1L);
        userResponse.setUsername("testuser");
        userResponse.setEmail("test@example.com");
        userResponse.setFirstName("John");
        userResponse.setLastName("Doe");
        userResponse.setPhoneNumber("1234567890");
        userResponse.setRole(UserRole.PATIENT);
        userResponse.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void registerUser_Success() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserResponse response = userService.registerUser(registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(UserRole.PATIENT, response.getRole());
        assertEquals(UserStatus.ACTIVE, response.getStatus());

        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UsernameAlreadyExists() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThrows(UserRegistrationException.class, () -> {
            userService.registerUser(registrationRequest);
        });

        verify(userRepository).existsByUsername("testuser");
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerUser_EmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(UserRegistrationException.class, () -> {
            userService.registerUser(registrationRequest);
        });

        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        UserResponse response = userService.getUserById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());

        verify(userRepository).findById(1L);
    }

    @Test
    void getUserById_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserById(999L);
        });

        verify(userRepository).findById(999L);
    }

    @Test
    void getUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act
        UserResponse response = userService.getUserByUsername("testuser");

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());

        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void getUserByUsername_NotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserByUsername("nonexistent");
        });

        verify(userRepository).findByUsername("nonexistent");
    }

    @Test
    void getAllUsers_Success() {
        // Arrange
        List<User> users = Arrays.asList(user);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<UserResponse> responses = userService.getAllUsers();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(userRepository).findAll();
    }

    @Test
    void updateUser_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserResponse response = userService.updateUser(1L, registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());

        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.updateUser(999L, registrationRequest);
        });

        verify(userRepository).findById(999L);
        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);

        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_NotFound() {
        // Arrange
        when(userRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(999L);
        });

        verify(userRepository).existsById(999L);
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void authenticateUser_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("testuser")).thenReturn("jwtToken");

        // Act
        UserLoginResponse response = authenticationService.authenticateUser(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertEquals("testuser", response.getUsername());
        assertEquals(UserRole.PATIENT, response.getRole());

        verify(userRepository).findByUsername("testuser");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtUtil).generateToken("testuser");
    }

    @Test
    void authenticateUser_UserNotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(AuthenticationException.class, () -> {
            authenticationService.authenticateUser(loginRequest);
        });

        verify(userRepository).findByUsername("nonexistent");
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void authenticateUser_InvalidPassword() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        // Act & Assert
        loginRequest.setPassword("wrongpassword");
        assertThrows(AuthenticationException.class, () -> {
            authenticationService.authenticateUser(loginRequest);
        });

        verify(userRepository).findByUsername("testuser");
        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void authenticateUser_InactiveUser() {
        // Arrange
        user.setStatus(UserStatus.INACTIVE);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(AuthenticationException.class, () -> {
            authenticationService.authenticateUser(loginRequest);
        });

        verify(userRepository).findByUsername("testuser");
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());
    }
} 