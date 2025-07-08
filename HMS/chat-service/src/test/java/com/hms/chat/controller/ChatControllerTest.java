package com.hms.chat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.chat.dto.*;
import com.hms.chat.entity.ChatRoomType;
import com.hms.chat.entity.MessageType;
import com.hms.chat.entity.ParticipantRole;
import com.hms.chat.service.ChatService;
import com.hms.chat.exception.ChatRoomNotFoundException;
import com.hms.chat.exception.ChatMessageNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatController.class)
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChatService chatService;

    @Autowired
    private ObjectMapper objectMapper;

    private ChatRoomRequest chatRoomRequest;
    private ChatMessageRequest chatMessageRequest;
    private ChatRoomResponse chatRoomResponse;
    private ChatMessageResponse chatMessageResponse;
    private ChatRoomParticipantResponse participantResponse;

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

        // Setup ChatRoomResponse
        chatRoomResponse = new ChatRoomResponse();
        chatRoomResponse.setId(1L);
        chatRoomResponse.setName("Test Chat Room");
        chatRoomResponse.setType(ChatRoomType.PRIVATE);
        chatRoomResponse.setCreatedBy(1L);
        chatRoomResponse.setCreatedAt(LocalDateTime.now());

        // Setup ChatMessageResponse
        chatMessageResponse = new ChatMessageResponse();
        chatMessageResponse.setId(1L);
        chatMessageResponse.setChatRoomId(1L);
        chatMessageResponse.setSenderId(1L);
        chatMessageResponse.setContent("Hello, how are you?");
        chatMessageResponse.setMessageType(MessageType.TEXT);
        chatMessageResponse.setSentAt(LocalDateTime.now());

        // Setup ChatRoomParticipantResponse
        participantResponse = new ChatRoomParticipantResponse();
        participantResponse.setId(1L);
        participantResponse.setChatRoomId(1L);
        participantResponse.setUserId(1L);
        participantResponse.setRole(ParticipantRole.ADMIN);
        participantResponse.setJoinedAt(LocalDateTime.now());
        participantResponse.setIsActive(true);
    }

    @Test
    void createChatRoom_Success() throws Exception {
        // Arrange
        when(chatService.createChatRoom(any(ChatRoomRequest.class)))
            .thenReturn(chatRoomResponse);

        // Act & Assert
        mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Chat Room"))
            .andExpect(jsonPath("$.type").value("PRIVATE"));

        verify(chatService).createChatRoom(any(ChatRoomRequest.class));
    }

    @Test
    void createChatRoom_ValidationError() throws Exception {
        // Arrange
        chatRoomRequest.setName(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andExpect(status().isBadRequest());

        verify(chatService, never()).createChatRoom(any());
    }

    @Test
    void getChatRoomById_Success() throws Exception {
        // Arrange
        when(chatService.getChatRoomById(1L)).thenReturn(chatRoomResponse);

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Chat Room"));

        verify(chatService).getChatRoomById(1L);
    }

    @Test
    void getChatRoomById_NotFound() throws Exception {
        // Arrange
        when(chatService.getChatRoomById(999L))
            .thenThrow(new ChatRoomNotFoundException("Chat room not found"));

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/999"))
            .andExpect(status().isNotFound());

        verify(chatService).getChatRoomById(999L);
    }

    @Test
    void getChatRoomsByUserId_Success() throws Exception {
        // Arrange
        List<ChatRoomResponse> responses = Arrays.asList(chatRoomResponse);
        when(chatService.getChatRoomsByUserId(1L)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].name").value("Test Chat Room"));

        verify(chatService).getChatRoomsByUserId(1L);
    }

    @Test
    void sendMessage_Success() throws Exception {
        // Arrange
        when(chatService.sendMessage(any(ChatMessageRequest.class)))
            .thenReturn(chatMessageResponse);

        // Act & Assert
        mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.chatRoomId").value(1))
            .andExpect(jsonPath("$.senderId").value(1))
            .andExpect(jsonPath("$.content").value("Hello, how are you?"));

        verify(chatService).sendMessage(any(ChatMessageRequest.class));
    }

    @Test
    void sendMessage_ValidationError() throws Exception {
        // Arrange
        chatMessageRequest.setContent(null); // Invalid request

        // Act & Assert
        mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andExpect(status().isBadRequest());

        verify(chatService, never()).sendMessage(any());
    }

    @Test
    void getChatMessages_Success() throws Exception {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ChatMessageResponse> messagePage = new PageImpl<>(Arrays.asList(chatMessageResponse));
        when(chatService.getChatMessages(1L, pageable)).thenReturn(messagePage);

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/1/messages")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].id").value(1))
            .andExpect(jsonPath("$.content[0].chatRoomId").value(1));

        verify(chatService).getChatMessages(1L, pageable);
    }

    @Test
    void markMessageAsRead_Success() throws Exception {
        // Arrange
        when(chatService.markMessageAsRead(1L, 1L)).thenReturn(chatMessageResponse);

        // Act & Assert
        mockMvc.perform(put("/api/chat/messages/1/read")
                .param("userId", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));

        verify(chatService).markMessageAsRead(1L, 1L);
    }

    @Test
    void markMessageAsRead_NotFound() throws Exception {
        // Arrange
        when(chatService.markMessageAsRead(999L, 1L))
            .thenThrow(new ChatMessageNotFoundException("Message not found"));

        // Act & Assert
        mockMvc.perform(put("/api/chat/messages/999/read")
                .param("userId", "1"))
            .andExpect(status().isNotFound());

        verify(chatService).markMessageAsRead(999L, 1L);
    }

    @Test
    void deleteMessage_Success() throws Exception {
        // Arrange
        doNothing().when(chatService).deleteMessage(1L, 1L);

        // Act & Assert
        mockMvc.perform(delete("/api/chat/messages/1")
                .param("userId", "1"))
            .andExpect(status().isNoContent());

        verify(chatService).deleteMessage(1L, 1L);
    }

    @Test
    void deleteMessage_NotFound() throws Exception {
        // Arrange
        doThrow(new ChatMessageNotFoundException("Message not found"))
            .when(chatService).deleteMessage(999L, 1L);

        // Act & Assert
        mockMvc.perform(delete("/api/chat/messages/999")
                .param("userId", "1"))
            .andExpect(status().isNotFound());

        verify(chatService).deleteMessage(999L, 1L);
    }

    @Test
    void addParticipant_Success() throws Exception {
        // Arrange
        when(chatService.addParticipant(eq(1L), eq(2L), eq(ParticipantRole.PARTICIPANT)))
            .thenReturn(participantResponse);

        // Act & Assert
        mockMvc.perform(post("/api/chat/rooms/1/participants")
                .param("userId", "2")
                .param("role", "PARTICIPANT"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.chatRoomId").value(1))
            .andExpect(jsonPath("$.userId").value(1));

        verify(chatService).addParticipant(1L, 2L, ParticipantRole.PARTICIPANT);
    }

    @Test
    void removeParticipant_Success() throws Exception {
        // Arrange
        doNothing().when(chatService).removeParticipant(1L, 2L);

        // Act & Assert
        mockMvc.perform(delete("/api/chat/rooms/1/participants/2"))
            .andExpect(status().isNoContent());

        verify(chatService).removeParticipant(1L, 2L);
    }

    @Test
    void getUnreadMessageCount_Success() throws Exception {
        // Arrange
        when(chatService.getUnreadMessageCount(1L, 1L)).thenReturn(5L);

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/1/unread-count")
                .param("userId", "1"))
            .andExpect(status().isOk())
            .andExpect(content().string("5"));

        verify(chatService).getUnreadMessageCount(1L, 1L);
    }
} 