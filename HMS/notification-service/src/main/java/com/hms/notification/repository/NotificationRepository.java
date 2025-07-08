package com.hms.notification.repository;

import com.hms.notification.entity.Notification;
import com.hms.notification.entity.NotificationStatus;
import com.hms.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserId(Long userId, Pageable pageable);
    
    List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
    
    List<Notification> findByUserIdAndType(Long userId, NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.status = :status AND n.createdAt >= :since")
    List<Notification> findByUserIdAndStatusAndCreatedAfter(
        @Param("userId") Long userId, 
        @Param("status") NotificationStatus status,
        @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.relatedEntityType = :entityType AND n.relatedEntityId = :entityId")
    List<Notification> findByRelatedEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);
    
    @Query("SELECT n FROM Notification n WHERE n.status = :status AND n.createdAt < :before")
    List<Notification> findOldNotifications(@Param("status") NotificationStatus status, @Param("before") LocalDateTime before);
} 