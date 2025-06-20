package com.loanoptimizer.service;

import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.UserRegistrationRequest;
import com.loanoptimizer.dto.UserProfileResponse;
import com.loanoptimizer.dto.UserProfileUpdateRequest;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Ensure notificationSettings is always valid JSON for PostgreSQL
        if (user.getNotificationSettings() == null || user.getNotificationSettings().isBlank()) {
            user.setNotificationSettings("{}");
        }
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public UserProfileResponse getCurrentUserProfile() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toUserProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UserProfileUpdateRequest request) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getIncome() != null) user.setIncome(request.getIncome());
        if (request.getBudget() != null) user.setBudget(request.getBudget());
        if (request.getEmergencyFund() != null) user.setEmergencyFund(request.getEmergencyFund());
        if (request.getStrategyPref() != null) user.setStrategyPref(request.getStrategyPref());
        if (request.getNotificationSettings() != null) user.setNotificationSettings(request.getNotificationSettings());
        userRepository.save(user);
        return toUserProfileResponse(user);
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    private UserProfileResponse toUserProfileResponse(User user) {
        UserProfileResponse resp = new UserProfileResponse();
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setIncome(user.getIncome());
        resp.setBudget(user.getBudget());
        resp.setEmergencyFund(user.getEmergencyFund());
        resp.setStrategyPref(user.getStrategyPref());
        resp.setNotificationSettings(user.getNotificationSettings());
        return resp;
    }
} 