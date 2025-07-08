package com.hms.chat.service;

import com.hms.chat.dto.*;
import com.hms.chat.entity.*;
import com.hms.chat.exception.ChatRoomNotFoundException;
import com.hms.chat.exception.ChatMessageNotFoundException;
import com.hms.chat.repository.ChatRoomRepository;
import com.hms.chat.repository.ChatMessageRepository;
import com.hms.chat.repository.ChatRoomParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomParticipantRepository participantRepository;
    
    @Transactional
    public ChatRoomResponse createChatRoom(ChatRoomRequest request) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(request.getName());
        chatRoom.setType(request.getType());
        chatRoom.setCreatedBy(request.getCreatedBy());
        
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        
        // Add participants
        if (request.getParticipantIds() != null) {
            List<ChatRoomParticipant> participants = request.getParticipantIds().stream()
                .map(userId -> {
                    ChatRoomParticipant participant = new ChatRoomParticipant();
                    participant.setChatRoom(savedChatRoom);
                    participant.setUserId(userId);
                    participant.setRole(ParticipantRole.PARTICIPANT);
                    return participant;
                })
                .collect(Collectors.toList());
            
            // Add creator as admin
            ChatRoomParticipant creator = new ChatRoomParticipant();
            creator.setChatRoom(savedChatRoom);
            creator.setUserId(request.getCreatedBy());
            creator.setRole(ParticipantRole.ADMIN);
            participants.add(creator);
            
            participantRepository.saveAll(participants);
        }
        
        return mapToChatRoomResponse(savedChatRoom);
    }
    
    public ChatRoomResponse getChatRoomById(Long id) {
        ChatRoom chatRoom = chatRoomRepository.findById(id)
            .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found with id: " + id));
        return mapToChatRoomResponse(chatRoom);
    }
    
    public List<ChatRoomResponse> getChatRoomsByUserId(Long userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByParticipantId(userId);
        return chatRooms.stream()
            .map(this::mapToChatRoomResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
            .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found with id: " + request.getChatRoomId()));
        
        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSenderId(request.getSenderId());
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType());
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        return mapToMessageResponse(savedMessage);
    }
    
    public Page<ChatMessageResponse> getChatMessages(Long chatRoomId, Pageable pageable) {
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderBySentAtDesc(chatRoomId, pageable);
        return messages.map(this::mapToMessageResponse);
    }
    
    @Transactional
    public ChatMessageResponse markMessageAsRead(Long messageId, Long userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
            .orElseThrow(() -> new ChatMessageNotFoundException("Message not found with id: " + messageId));
        
        message.setReadAt(LocalDateTime.now());
        ChatMessage updatedMessage = chatMessageRepository.save(message);
        return mapToMessageResponse(updatedMessage);
    }
    
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
            .orElseThrow(() -> new ChatMessageNotFoundException("Message not found with id: " + messageId));
        
        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("User can only delete their own messages");
        }
        
        message.setIsDeleted(true);
        chatMessageRepository.save(message);
    }
    
    @Transactional
    public ChatRoomParticipantResponse addParticipant(Long chatRoomId, Long userId, ParticipantRole role) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found with id: " + chatRoomId));
        
        ChatRoomParticipant participant = new ChatRoomParticipant();
        participant.setChatRoom(chatRoom);
        participant.setUserId(userId);
        participant.setRole(role);
        
        ChatRoomParticipant savedParticipant = participantRepository.save(participant);
        return mapToParticipantResponse(savedParticipant);
    }
    
    @Transactional
    public void removeParticipant(Long chatRoomId, Long userId) {
        ChatRoomParticipant participant = participantRepository.findByChatRoomIdAndUserId(chatRoomId, userId)
            .orElseThrow(() -> new RuntimeException("Participant not found"));
        
        participant.setIsActive(false);
        participant.setLeftAt(LocalDateTime.now());
        participantRepository.save(participant);
    }
    
    public Long getUnreadMessageCount(Long chatRoomId, Long userId) {
        return chatMessageRepository.countUnreadMessages(chatRoomId, userId);
    }
    
    private ChatRoomResponse mapToChatRoomResponse(ChatRoom chatRoom) {
        ChatRoomResponse response = new ChatRoomResponse();
        response.setId(chatRoom.getId());
        response.setName(chatRoom.getName());
        response.setType(chatRoom.getType());
        response.setCreatedBy(chatRoom.getCreatedBy());
        response.setCreatedAt(chatRoom.getCreatedAt());
        response.setUpdatedAt(chatRoom.getUpdatedAt());
        
        if (chatRoom.getMessages() != null) {
            response.setMessages(chatRoom.getMessages().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList()));
        }
        
        if (chatRoom.getParticipants() != null) {
            response.setParticipants(chatRoom.getParticipants().stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    private ChatMessageResponse mapToMessageResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setChatRoomId(message.getChatRoom().getId());
        response.setSenderId(message.getSenderId());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setSentAt(message.getSentAt());
        response.setReadAt(message.getReadAt());
        response.setIsDeleted(message.getIsDeleted());
        return response;
    }
    
    private ChatRoomParticipantResponse mapToParticipantResponse(ChatRoomParticipant participant) {
        ChatRoomParticipantResponse response = new ChatRoomParticipantResponse();
        response.setId(participant.getId());
        response.setChatRoomId(participant.getChatRoom().getId());
        response.setUserId(participant.getUserId());
        response.setRole(participant.getRole());
        response.setJoinedAt(participant.getJoinedAt());
        response.setLeftAt(participant.getLeftAt());
        response.setIsActive(participant.getIsActive());
        return response;
    }
} 