package com.loanoptimizer.service;

import com.loanoptimizer.domain.ProgressMetric;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.ProgressMetricResponse;
import com.loanoptimizer.repository.ProgressMetricRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressMetricService {
    private final ProgressMetricRepository progressMetricRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgressMetricService(ProgressMetricRepository progressMetricRepository, UserRepository userRepository) {
        this.progressMetricRepository = progressMetricRepository;
        this.userRepository = userRepository;
    }

    public List<ProgressMetricResponse> getMetrics(String type, LocalDateTime from, LocalDateTime to) {
        // Get authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails)
                ? ((UserDetails) principal).getUsername()
                : principal.toString();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<ProgressMetric> metrics = progressMetricRepository.findAll().stream()
                .filter(m -> m.getUser().getId().equals(user.getId()))
                .filter(m -> type == null || m.getMetricType().equalsIgnoreCase(type))
                .filter(m -> (from == null || !m.getRecordedAt().isBefore(from)))
                .filter(m -> (to == null || !m.getRecordedAt().isAfter(to)))
                .collect(Collectors.toList());
        return metrics.stream().map(ProgressMetricResponse::fromEntity).collect(Collectors.toList());
    }
} 