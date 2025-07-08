package com.hms.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hms.chat.entity.ParticipantRole;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomParticipantResponse {
    
    private Long id;
    private Long chatRoomId;
    private Long userId;
    private ParticipantRole role;
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
    private Boolean isActive;
} 