package com.hms.userservice.service;

import com.hms.userservice.dto.UserRegistrationRequest;
import com.hms.userservice.dto.UserResponse;
import com.hms.userservice.entity.User;
import com.hms.userservice.entity.UserRole;
import com.hms.userservice.entity.UserStatus;
import com.hms.userservice.exception.UserNotFoundException;
import com.hms.userservice.exception.UserRegistrationException;
import com.hms.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponse registerUser(UserRegistrationRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserRegistrationException("Username already exists: " + request.getUsername());
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserRegistrationException("Email already exists: " + request.getEmail());
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setPhoneNumber(request.getPhoneNumber());
        
        // Parse date of birth if provided
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            try {
                LocalDateTime dateOfBirth = LocalDateTime.parse(request.getDateOfBirth());
                user.setDateOfBirth(dateOfBirth);
            } catch (Exception e) {
                throw new UserRegistrationException("Invalid date of birth format");
            }
        }
        
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return convertToUserResponse(user);
    }
    
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return convertToUserResponse(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return convertToUserResponse(user);
    }
    
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::convertToUserResponse);
    }
    
    public Page<UserResponse> searchUsers(String searchTerm, Pageable pageable) {
        Page<User> users = userRepository.searchUsers(searchTerm, pageable);
        return users.map(this::convertToUserResponse);
    }
    
    public Page<UserResponse> searchUsersWithFilters(String searchTerm, UserRole role, UserStatus status, Pageable pageable) {
        Page<User> users = userRepository.searchUsersWithFilters(searchTerm, role, status, pageable);
        return users.map(this::convertToUserResponse);
    }
    
    public List<UserResponse> getUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream().map(this::convertToUserResponse).toList();
    }
    
    public List<UserResponse> getActiveUsersByRole(UserRole role) {
        List<User> users = userRepository.findActiveUsersByRole(role);
        return users.stream().map(this::convertToUserResponse).toList();
    }
    
    public UserResponse updateUser(Long id, UserRegistrationRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        // Check if new username or email conflicts with existing users
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new UserRegistrationException("Username already exists: " + request.getUsername());
        }
        
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new UserRegistrationException("Email already exists: " + request.getEmail());
        }
        
        // Update user fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Parse date of birth if provided
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            try {
                LocalDateTime dateOfBirth = LocalDateTime.parse(request.getDateOfBirth());
                user.setDateOfBirth(dateOfBirth);
            } catch (Exception e) {
                throw new UserRegistrationException("Invalid date of birth format");
            }
        }
        
        User updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }
    
    public UserResponse updateUserStatus(Long id, UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    public void updateLastLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public long getTotalUsers() {
        return userRepository.count();
    }
    
    public long getUsersCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.countUsersCreatedBetween(startDate, endDate);
    }
    
    public List<Object[]> getUsersByRoleCount() {
        return userRepository.countUsersByRole();
    }
    
    public List<UserResponse> getInactiveUsers(LocalDateTime inactiveThreshold) {
        List<User> users = userRepository.findInactiveUsers(inactiveThreshold);
        return users.stream().map(this::convertToUserResponse).toList();
    }
    
    public List<UserResponse> getUsersCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        List<User> users = userRepository.findUsersCreatedBetween(startDate, endDate);
        return users.stream().map(this::convertToUserResponse).toList();
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }
    
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getStatus(),
                user.getPhoneNumber(),
                user.getDateOfBirth(),
                user.getLastLogin(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
} 