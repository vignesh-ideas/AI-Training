package com.hms.chat.repository;

import com.hms.chat.entity.ChatMessage;
import com.hms.chat.entity.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByChatRoomIdOrderBySentAtDesc(Long chatRoomId, Pageable pageable);
    
    List<ChatMessage> findByChatRoomIdAndSentAtAfter(Long chatRoomId, LocalDateTime after);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.senderId = :senderId AND cm.isDeleted = false")
    List<ChatMessage> findByChatRoomIdAndSenderId(@Param("chatRoomId") Long chatRoomId, @Param("senderId") Long senderId);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.readAt IS NULL AND cm.senderId != :userId")
    Long countUnreadMessages(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.messageType = :messageType")
    List<ChatMessage> findByChatRoomIdAndMessageType(@Param("chatRoomId") Long chatRoomId, @Param("messageType") MessageType messageType);
} 