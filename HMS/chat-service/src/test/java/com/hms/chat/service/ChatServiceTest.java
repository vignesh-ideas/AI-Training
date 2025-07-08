package com.hms.chat.service;

import com.hms.chat.dto.*;
import com.hms.chat.entity.*;
import com.hms.chat.exception.ChatRoomNotFoundException;
import com.hms.chat.exception.ChatMessageNotFoundException;
import com.hms.chat.repository.ChatRoomRepository;
import com.hms.chat.repository.ChatMessageRepository;
import com.hms.chat.repository.ChatRoomParticipantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRoomRepository chatRoomRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private ChatRoomParticipantRepository participantRepository;

    @InjectMocks
    private ChatService chatService;

    private ChatRoomRequest chatRoomRequest;
    private ChatMessageRequest chatMessageRequest;
    private ChatRoom chatRoom;
    private ChatMessage chatMessage;
    private ChatRoomParticipant participant;

    @BeforeEach
    void setUp() {
        // Setup ChatRoomRequest
        chatRoomRequest = new ChatRoomRequest();
        chatRoomRequest.setName("Test Chat Room");
        chatRoomRequest.setType(ChatRoomType.PRIVATE);
        chatRoomRequest.setCreatedBy(1L);
        chatRoomRequest.setParticipantIds(Arrays.asList(2L, 3L));

        // Setup ChatMessageRequest
        chatMessageRequest = new ChatMessageRequest();
        chatMessageRequest.setChatRoomId(1L);
        chatMessageRequest.setSenderId(1L);
        chatMessageRequest.setContent("Hello, how are you?");
        chatMessageRequest.setMessageType(MessageType.TEXT);

        // Setup ChatRoom entity
        chatRoom = new ChatRoom();
        chatRoom.setId(1L);
        chatRoom.setName("Test Chat Room");
        chatRoom.setType(ChatRoomType.PRIVATE);
        chatRoom.setCreatedBy(1L);
        chatRoom.setCreatedAt(LocalDateTime.now());

        // Setup ChatMessage entity
        chatMessage = new ChatMessage();
        chatMessage.setId(1L);
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setSenderId(1L);
        chatMessage.setContent("Hello, how are you?");
        chatMessage.setMessageType(MessageType.TEXT);
        chatMessage.setSentAt(LocalDateTime.now());

        // Setup ChatRoomParticipant entity
        participant = new ChatRoomParticipant();
        participant.setId(1L);
        participant.setChatRoom(chatRoom);
        participant.setUserId(1L);
        participant.setRole(ParticipantRole.ADMIN);
        participant.setJoinedAt(LocalDateTime.now());
        participant.setIsActive(true);
    }

    @Test
    void createChatRoom_Success() {
        // Arrange
        when(chatRoomRepository.save(any(ChatRoom.class))).thenReturn(chatRoom);
        when(participantRepository.saveAll(any())).thenReturn(Arrays.asList(participant));

        // Act
        ChatRoomResponse response = chatService.createChatRoom(chatRoomRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Chat Room", response.getName());
        assertEquals(ChatRoomType.PRIVATE, response.getType());
        assertEquals(1L, response.getCreatedBy());

        verify(chatRoomRepository).save(any(ChatRoom.class));
        verify(participantRepository).saveAll(any());
    }

    @Test
    void getChatRoomById_Success() {
        // Arrange
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));

        // Act
        ChatRoomResponse response = chatService.getChatRoomById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Chat Room", response.getName());

        verify(chatRoomRepository).findById(1L);
    }

    @Test
    void getChatRoomById_NotFound() {
        // Arrange
        when(chatRoomRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ChatRoomNotFoundException.class, () -> {
            chatService.getChatRoomById(999L);
        });

        verify(chatRoomRepository).findById(999L);
    }

    @Test
    void getChatRoomsByUserId_Success() {
        // Arrange
        List<ChatRoom> chatRooms = Arrays.asList(chatRoom);
        when(chatRoomRepository.findByParticipantId(1L)).thenReturn(chatRooms);

        // Act
        List<ChatRoomResponse> responses = chatService.getChatRoomsByUserId(1L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());

        verify(chatRoomRepository).findByParticipantId(1L);
    }

    @Test
    void sendMessage_Success() {
        // Arrange
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);

        // Act
        ChatMessageResponse response = chatService.sendMessage(chatMessageRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getChatRoomId());
        assertEquals(1L, response.getSenderId());
        assertEquals("Hello, how are you?", response.getContent());
        assertEquals(MessageType.TEXT, response.getMessageType());

        verify(chatRoomRepository).findById(1L);
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void sendMessage_ChatRoomNotFound() {
        // Arrange
        when(chatRoomRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        chatMessageRequest.setChatRoomId(999L);
        assertThrows(ChatRoomNotFoundException.class, () -> {
            chatService.sendMessage(chatMessageRequest);
        });

        verify(chatRoomRepository).findById(999L);
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void getChatMessages_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ChatMessage> messagePage = new PageImpl<>(Arrays.asList(chatMessage));
        when(chatMessageRepository.findByChatRoomIdOrderBySentAtDesc(1L, pageable))
            .thenReturn(messagePage);

        // Act
        Page<ChatMessageResponse> response = chatService.getChatMessages(1L, pageable);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1L, response.getContent().get(0).getId());

        verify(chatMessageRepository).findByChatRoomIdOrderBySentAtDesc(1L, pageable);
    }

    @Test
    void markMessageAsRead_Success() {
        // Arrange
        when(chatMessageRepository.findById(1L)).thenReturn(Optional.of(chatMessage));
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);

        // Act
        ChatMessageResponse response = chatService.markMessageAsRead(1L, 1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertNotNull(response.getReadAt());

        verify(chatMessageRepository).findById(1L);
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void markMessageAsRead_NotFound() {
        // Arrange
        when(chatMessageRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ChatMessageNotFoundException.class, () -> {
            chatService.markMessageAsRead(999L, 1L);
        });

        verify(chatMessageRepository).findById(999L);
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void deleteMessage_Success() {
        // Arrange
        when(chatMessageRepository.findById(1L)).thenReturn(Optional.of(chatMessage));
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);

        // Act
        chatService.deleteMessage(1L, 1L);

        // Assert
        verify(chatMessageRepository).findById(1L);
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void deleteMessage_NotFound() {
        // Arrange
        when(chatMessageRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ChatMessageNotFoundException.class, () -> {
            chatService.deleteMessage(999L, 1L);
        });

        verify(chatMessageRepository).findById(999L);
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void deleteMessage_Unauthorized() {
        // Arrange
        when(chatMessageRepository.findById(1L)).thenReturn(Optional.of(chatMessage));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            chatService.deleteMessage(1L, 999L); // Different user ID
        });

        verify(chatMessageRepository).findById(1L);
        verify(chatMessageRepository, never()).save(any());
    }

    @Test
    void addParticipant_Success() {
        // Arrange
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(participantRepository.save(any(ChatRoomParticipant.class))).thenReturn(participant);

        // Act
        ChatRoomParticipantResponse response = chatService.addParticipant(1L, 2L, ParticipantRole.PARTICIPANT);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getChatRoomId());
        assertEquals(1L, response.getUserId());

        verify(chatRoomRepository).findById(1L);
        verify(participantRepository).save(any(ChatRoomParticipant.class));
    }

    @Test
    void addParticipant_ChatRoomNotFound() {
        // Arrange
        when(chatRoomRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ChatRoomNotFoundException.class, () -> {
            chatService.addParticipant(999L, 2L, ParticipantRole.PARTICIPANT);
        });

        verify(chatRoomRepository).findById(999L);
        verify(participantRepository, never()).save(any());
    }

    @Test
    void removeParticipant_Success() {
        // Arrange
        when(participantRepository.findByChatRoomIdAndUserId(1L, 2L))
            .thenReturn(Optional.of(participant));
        when(participantRepository.save(any(ChatRoomParticipant.class))).thenReturn(participant);

        // Act
        chatService.removeParticipant(1L, 2L);

        // Assert
        verify(participantRepository).findByChatRoomIdAndUserId(1L, 2L);
        verify(participantRepository).save(any(ChatRoomParticipant.class));
    }

    @Test
    void removeParticipant_ParticipantNotFound() {
        // Arrange
        when(participantRepository.findByChatRoomIdAndUserId(1L, 999L))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            chatService.removeParticipant(1L, 999L);
        });

        verify(participantRepository).findByChatRoomIdAndUserId(1L, 999L);
        verify(participantRepository, never()).save(any());
    }

    @Test
    void getUnreadMessageCount_Success() {
        // Arrange
        when(chatMessageRepository.countUnreadMessages(1L, 1L)).thenReturn(5L);

        // Act
        Long count = chatService.getUnreadMessageCount(1L, 1L);

        // Assert
        assertEquals(5L, count);

        verify(chatMessageRepository).countUnreadMessages(1L, 1L);
    }
} 