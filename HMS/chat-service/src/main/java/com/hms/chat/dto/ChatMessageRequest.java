package com.hms.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import com.hms.chat.entity.MessageType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    
    @NotNull(message = "Chat room ID is required")
    private Long chatRoomId;
    
    @NotNull(message = "Sender ID is required")
    private Long senderId;
    
    @NotBlank(message = "Message content is required")
    private String content;
    
    private MessageType messageType = MessageType.TEXT;
} 