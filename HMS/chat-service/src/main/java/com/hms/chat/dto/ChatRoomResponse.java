package com.hms.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.chat.entity.ChatRoomType;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    
    private Long id;
    private String name;
    private ChatRoomType type;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChatMessageResponse> messages;
    private List<ChatRoomParticipantResponse> participants;
    private Long unreadMessageCount;
} 