package com.hms.chat.controller;

import com.hms.chat.dto.*;
import com.hms.chat.entity.ParticipantRole;
import com.hms.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponse> createChatRoom(@Valid @RequestBody ChatRoomRequest request) {
        ChatRoomResponse response = chatService.createChatRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/rooms/{id}")
    public ResponseEntity<ChatRoomResponse> getChatRoomById(@PathVariable Long id) {
        ChatRoomResponse response = chatService.getChatRoomById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<List<ChatRoomResponse>> getChatRoomsByUserId(@PathVariable Long userId) {
        List<ChatRoomResponse> chatRooms = chatService.getChatRoomsByUserId(userId);
        return ResponseEntity.ok(chatRooms);
    }
    
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getChatMessages(
            @PathVariable Long chatRoomId, Pageable pageable) {
        Page<ChatMessageResponse> messages = chatService.getChatMessages(chatRoomId, pageable);
        return ResponseEntity.ok(messages);
    }
    
    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<ChatMessageResponse> markMessageAsRead(
            @PathVariable Long messageId, @RequestParam Long userId) {
        ChatMessageResponse response = chatService.markMessageAsRead(messageId, userId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId, @RequestParam Long userId) {
        chatService.deleteMessage(messageId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/rooms/{chatRoomId}/participants")
    public ResponseEntity<ChatRoomParticipantResponse> addParticipant(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "PARTICIPANT") ParticipantRole role) {
        ChatRoomParticipantResponse response = chatService.addParticipant(chatRoomId, userId, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @DeleteMapping("/rooms/{chatRoomId}/participants/{userId}")
    public ResponseEntity<Void> removeParticipant(
            @PathVariable Long chatRoomId, @PathVariable Long userId) {
        chatService.removeParticipant(chatRoomId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/rooms/{chatRoomId}/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(
            @PathVariable Long chatRoomId, @RequestParam Long userId) {
        Long count = chatService.getUnreadMessageCount(chatRoomId, userId);
        return ResponseEntity.ok(count);
    }
} 