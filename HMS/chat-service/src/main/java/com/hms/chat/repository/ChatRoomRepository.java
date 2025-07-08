package com.hms.chat.repository;

import com.hms.chat.entity.ChatRoom;
import com.hms.chat.entity.ChatRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    List<ChatRoom> findByType(ChatRoomType type);
    
    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p WHERE p.userId = :userId AND p.isActive = true")
    List<ChatRoom> findByParticipantId(@Param("userId") Long userId);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.createdBy = :userId")
    List<ChatRoom> findByCreatedBy(@Param("userId") Long userId);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.type = :type AND cr.createdBy = :userId")
    List<ChatRoom> findByTypeAndCreatedBy(@Param("type") ChatRoomType type, @Param("userId") Long userId);
    
    Optional<ChatRoom> findByName(String name);
} 