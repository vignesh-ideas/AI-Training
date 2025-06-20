package com.loanoptimizer.service;

import com.loanoptimizer.domain.Notification;
import com.loanoptimizer.domain.User;
import com.loanoptimizer.dto.NotificationResponse;
import com.loanoptimizer.repository.NotificationRepository;
import com.loanoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (principal instanceof UserDetails)
                ? ((UserDetails) principal).getUsername()
                : principal.toString();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<NotificationResponse> listNotifications(Optional<String> status) {
        User user = getCurrentUser();
        List<Notification> notifications = status.isPresent()
                ? notificationRepository.findByUserAndStatus(user, status.get())
                : notificationRepository.findByUser(user);
        return notifications.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found or forbidden"));
        notification.setStatus("read");
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
        return toResponse(notification);
    }

    private NotificationResponse toResponse(Notification n) {
        NotificationResponse resp = new NotificationResponse();
        resp.setId(n.getId());
        resp.setType(n.getType());
        resp.setMessage(n.getMessage());
        resp.setDeliveryMethod(n.getDeliveryMethod());
        resp.setStatus(n.getStatus());
        resp.setSentAt(n.getSentAt());
        resp.setReadAt(n.getReadAt());
        resp.setCreatedAt(n.getCreatedAt());
        return resp;
    }
} 