package com.hms.userservice.dto;

import com.hms.userservice.entity.UserRole;
import com.hms.userservice.entity.UserStatus;

import java.time.LocalDateTime;

public class UserLoginResponse {
    
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserInfo userInfo;
    
    // Constructors
    public UserLoginResponse() {}
    
    public UserLoginResponse(String token, String refreshToken, long expiresIn, UserInfo userInfo) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.userInfo = userInfo;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public UserInfo getUserInfo() {
        return userInfo;
    }
    
    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private UserRole role;
        private UserStatus status;
        private String phoneNumber;
        private LocalDateTime lastLogin;
        
        // Constructors
        public UserInfo() {}
        
        public UserInfo(Long id, String username, String email, String firstName, String lastName, 
                       UserRole role, UserStatus status, String phoneNumber, LocalDateTime lastLogin) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
            this.status = status;
            this.phoneNumber = phoneNumber;
            this.lastLogin = lastLogin;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public UserRole getRole() {
            return role;
        }
        
        public void setRole(UserRole role) {
            this.role = role;
        }
        
        public UserStatus getStatus() {
            return status;
        }
        
        public void setStatus(UserStatus status) {
            this.status = status;
        }
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public LocalDateTime getLastLogin() {
            return lastLogin;
        }
        
        public void setLastLogin(LocalDateTime lastLogin) {
            this.lastLogin = lastLogin;
        }
        
        public String getFullName() {
            return firstName + " " + lastName;
        }
        
        @Override
        public String toString() {
            return "UserInfo{" +
                    "id=" + id +
                    ", username='" + username + '\'' +
                    ", email='" + email + '\'' +
                    ", firstName='" + firstName + '\'' +
                    ", lastName='" + lastName + '\'' +
                    ", role=" + role +
                    ", status=" + status +
                    ", phoneNumber='" + phoneNumber + '\'' +
                    ", lastLogin=" + lastLogin +
                    '}';
        }
    }
    
    @Override
    public String toString() {
        return "UserLoginResponse{" +
                "token='" + token + '\'' +
                ", refreshToken='" + refreshToken + '\'' +
                ", tokenType='" + tokenType + '\'' +
                ", expiresIn=" + expiresIn +
                ", userInfo=" + userInfo +
                '}';
    }
} 