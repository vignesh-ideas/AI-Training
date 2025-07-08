package com.hms.userservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.userservice.dto.UserRegistrationRequest;
import com.hms.userservice.dto.UserResponse;
import com.hms.userservice.dto.UserLoginRequest;
import com.hms.userservice.dto.UserLoginResponse;
import com.hms.userservice.entity.UserRole;
import com.hms.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class UserServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private UserRegistrationRequest registrationRequest;
    private UserLoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        registrationRequest = new UserRegistrationRequest();
        registrationRequest.setUsername("testuser");
        registrationRequest.setEmail("test@example.com");
        registrationRequest.setPassword("password123");
        registrationRequest.setFirstName("John");
        registrationRequest.setLastName("Doe");
        registrationRequest.setPhoneNumber("1234567890");
        registrationRequest.setRole(UserRole.PATIENT);

        loginRequest = new UserLoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }

    @Test
    void registerUser_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.role").value("PATIENT"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        UserResponse responseObj = objectMapper.readValue(response, UserResponse.class);
        assertTrue(userRepository.existsById(responseObj.getId()));
    }

    @Test
    void getUserById_IntegrationTest() throws Exception {
        // Arrange - Create user first
        String createResponse = mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        UserResponse createdUser = objectMapper.readValue(createResponse, UserResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/users/" + createdUser.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdUser.getId()))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void getUserByUsername_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/users/username/testuser"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void getAllUsers_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void updateUser_IntegrationTest() throws Exception {
        // Arrange - Create user first
        String createResponse = mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        UserResponse createdUser = objectMapper.readValue(createResponse, UserResponse.class);

        // Update user data
        registrationRequest.setFirstName("Jane");
        registrationRequest.setLastName("Smith");

        // Act & Assert
        mockMvc.perform(put("/api/users/" + createdUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.lastName").value("Smith"));
    }

    @Test
    void deleteUser_IntegrationTest() throws Exception {
        // Arrange - Create user first
        String createResponse = mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        UserResponse createdUser = objectMapper.readValue(createResponse, UserResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/users/" + createdUser.getId()))
            .andExpect(status().isNoContent());

        // Verify user is deleted
        assertFalse(userRepository.existsById(createdUser.getId()));
    }

    @Test
    void login_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.role").value("PATIENT"));
    }

    @Test
    void login_InvalidCredentials_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert - Wrong password
        loginRequest.setPassword("wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void registerUser_DuplicateUsername_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert - Try to register with same username
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void registerUser_DuplicateEmail_IntegrationTest() throws Exception {
        // Arrange - Create user first
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isCreated());

        // Act & Assert - Try to register with same email but different username
        registrationRequest.setUsername("differentuser");
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getUserById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/users/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void registerUser_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        registrationRequest.setUsername(null);

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void logout_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Logout successful"));
    }
} 