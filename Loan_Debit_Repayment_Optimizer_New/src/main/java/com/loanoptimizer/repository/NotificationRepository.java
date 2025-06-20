package com.loanoptimizer.repository;

import com.loanoptimizer.domain.Notification;
import com.loanoptimizer.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findByUserAndStatus(User user, String status);
    Optional<Notification> findByIdAndUser(Long id, User user);
} 