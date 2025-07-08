package com.hms.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import com.hms.chat.entity.ChatRoomType;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomRequest {
    
    @NotBlank(message = "Chat room name is required")
    private String name;
    
    @NotNull(message = "Chat room type is required")
    private ChatRoomType type;
    
    @NotNull(message = "Created by user ID is required")
    private Long createdBy;
    
    private List<Long> participantIds;
} 