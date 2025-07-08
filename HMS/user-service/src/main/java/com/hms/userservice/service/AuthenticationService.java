package com.hms.userservice.service;

import com.hms.userservice.dto.UserLoginRequest;
import com.hms.userservice.dto.UserLoginResponse;
import com.hms.userservice.entity.User;
import com.hms.userservice.entity.UserStatus;
import com.hms.userservice.exception.AuthenticationException;
import com.hms.userservice.repository.UserRepository;
import com.hms.userservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;
    
    public UserLoginResponse authenticateUser(UserLoginRequest request) {
        // Find user by username or email
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail());
        
        if (userOpt.isEmpty()) {
            throw new AuthenticationException("Invalid username/email or password");
        }
        
        User user = userOpt.get();
        
        // Check if user is active
        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AuthenticationException("User account is not active");
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid username/email or password");
        }
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        long expiresIn = jwtUtil.getExpirationTime();
        
        // Create user info for response
        UserLoginResponse.UserInfo userInfo = new UserLoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getStatus(),
                user.getPhoneNumber(),
                user.getLastLogin()
        );
        
        return new UserLoginResponse(token, refreshToken, expiresIn, userInfo);
    }
    
    public UserLoginResponse refreshToken(String refreshToken) {
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                throw new AuthenticationException("Invalid refresh token");
            }
            
            User user = userOpt.get();
            
            if (!UserStatus.ACTIVE.equals(user.getStatus())) {
                throw new AuthenticationException("User account is not active");
            }
            
            // Validate refresh token
            if (!jwtUtil.validateRefreshToken(refreshToken, user)) {
                throw new AuthenticationException("Invalid refresh token");
            }
            
            // Generate new tokens
            String newToken = jwtUtil.generateToken(user);
            String newRefreshToken = jwtUtil.generateRefreshToken(user);
            long expiresIn = jwtUtil.getExpirationTime();
            
            // Create user info for response
            UserLoginResponse.UserInfo userInfo = new UserLoginResponse.UserInfo(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole(),
                    user.getStatus(),
                    user.getPhoneNumber(),
                    user.getLastLogin()
            );
            
            return new UserLoginResponse(newToken, newRefreshToken, expiresIn, userInfo);
            
        } catch (Exception e) {
            throw new AuthenticationException("Invalid refresh token");
        }
    }
    
    public void logout(String token) {
        // In a real implementation, you might want to blacklist the token
        // For now, we'll just validate the token to ensure it's valid
        try {
            String username = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (!jwtUtil.validateToken(token, user)) {
                    throw new AuthenticationException("Invalid token");
                }
                // Token is valid, logout successful
            }
        } catch (Exception e) {
            throw new AuthenticationException("Invalid token");
        }
    }
    
    public boolean validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return false;
            }
            
            User user = userOpt.get();
            return jwtUtil.validateToken(token, user) && UserStatus.ACTIVE.equals(user.getStatus());
            
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getUsernameFromToken(String token) {
        return jwtUtil.extractUsername(token);
    }
} 