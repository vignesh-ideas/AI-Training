package com.hms.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.chat.entity.MessageType;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private MessageType messageType;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private Boolean isDeleted;
} 