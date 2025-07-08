package com.hms.chat.repository;

import com.hms.chat.entity.ChatRoomParticipant;
import com.hms.chat.entity.ParticipantRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomParticipantRepository extends JpaRepository<ChatRoomParticipant, Long> {
    
    List<ChatRoomParticipant> findByChatRoomId(Long chatRoomId);
    
    List<ChatRoomParticipant> findByUserId(Long userId);
    
    @Query("SELECT crp FROM ChatRoomParticipant crp WHERE crp.chatRoom.id = :chatRoomId AND crp.userId = :userId AND crp.isActive = true")
    Optional<ChatRoomParticipant> findByChatRoomIdAndUserId(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
    
    @Query("SELECT crp FROM ChatRoomParticipant crp WHERE crp.chatRoom.id = :chatRoomId AND crp.role = :role")
    List<ChatRoomParticipant> findByChatRoomIdAndRole(@Param("chatRoomId") Long chatRoomId, @Param("role") ParticipantRole role);
    
    @Query("SELECT COUNT(crp) FROM ChatRoomParticipant crp WHERE crp.chatRoom.id = :chatRoomId AND crp.isActive = true")
    Long countActiveParticipantsByChatRoomId(@Param("chatRoomId") Long chatRoomId);
} 