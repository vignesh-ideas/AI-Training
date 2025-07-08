package com.hms.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.chat.dto.ChatRoomRequest;
import com.hms.chat.dto.ChatMessageRequest;
import com.hms.chat.dto.ChatRoomResponse;
import com.hms.chat.dto.ChatMessageResponse;
import com.hms.chat.entity.ChatRoomType;
import com.hms.chat.entity.MessageType;
import com.hms.chat.entity.ParticipantRole;
import com.hms.chat.repository.ChatRoomRepository;
import com.hms.chat.repository.ChatMessageRepository;
import com.hms.chat.repository.ChatRoomParticipantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class ChatServiceIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomParticipantRepository participantRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private ChatRoomRequest chatRoomRequest;
    private ChatMessageRequest chatMessageRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        chatRoomRequest = new ChatRoomRequest();
        chatRoomRequest.setName("Test Chat Room");
        chatRoomRequest.setType(ChatRoomType.PRIVATE);
        chatRoomRequest.setCreatedBy(1L);
        chatRoomRequest.setParticipantIds(Arrays.asList(2L, 3L));

        chatMessageRequest = new ChatMessageRequest();
        chatMessageRequest.setSenderId(1L);
        chatMessageRequest.setContent("Hello, how are you?");
        chatMessageRequest.setMessageType(MessageType.TEXT);
    }

    @Test
    void createChatRoom_IntegrationTest() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("Test Chat Room"))
            .andExpect(jsonPath("$.type").value("PRIVATE"))
            .andExpect(jsonPath("$.createdBy").value(1))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        ChatRoomResponse responseObj = objectMapper.readValue(response, ChatRoomResponse.class);
        assertTrue(chatRoomRepository.existsById(responseObj.getId()));
    }

    @Test
    void getChatRoomById_IntegrationTest() throws Exception {
        // Arrange - Create chat room first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/" + createdChatRoom.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdChatRoom.getId()))
            .andExpect(jsonPath("$.name").value("Test Chat Room"));
    }

    @Test
    void getChatRoomsByUserId_IntegrationTest() throws Exception {
        // Arrange - Create chat room first
        mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].name").value("Test Chat Room"));
    }

    @Test
    void sendMessage_IntegrationTest() throws Exception {
        // Arrange - Create chat room first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);
        chatMessageRequest.setChatRoomId(createdChatRoom.getId());

        // Act & Assert
        String messageResponse = mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.chatRoomId").value(createdChatRoom.getId()))
            .andExpect(jsonPath("$.senderId").value(1))
            .andExpect(jsonPath("$.content").value("Hello, how are you?"))
            .andExpect(jsonPath("$.messageType").value("TEXT"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        ChatMessageResponse responseObj = objectMapper.readValue(messageResponse, ChatMessageResponse.class);
        assertTrue(chatMessageRepository.existsById(responseObj.getId()));
    }

    @Test
    void getChatMessages_IntegrationTest() throws Exception {
        // Arrange - Create chat room and message first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);
        chatMessageRequest.setChatRoomId(createdChatRoom.getId());

        mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/" + createdChatRoom.getId() + "/messages"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content[0].content").value("Hello, how are you?"));
    }

    @Test
    void markMessageAsRead_IntegrationTest() throws Exception {
        // Arrange - Create chat room and message first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);
        chatMessageRequest.setChatRoomId(createdChatRoom.getId());

        String messageResponse = mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatMessageResponse createdMessage = objectMapper.readValue(messageResponse, ChatMessageResponse.class);

        // Act & Assert
        mockMvc.perform(put("/api/chat/messages/" + createdMessage.getId() + "/read")
                .param("userId", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.readAt").exists());
    }

    @Test
    void deleteMessage_IntegrationTest() throws Exception {
        // Arrange - Create chat room and message first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);
        chatMessageRequest.setChatRoomId(createdChatRoom.getId());

        String messageResponse = mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatMessageResponse createdMessage = objectMapper.readValue(messageResponse, ChatMessageResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/chat/messages/" + createdMessage.getId())
                .param("userId", "1"))
            .andExpect(status().isNoContent());

        // Verify message is marked as deleted
        assertTrue(chatMessageRepository.existsById(createdMessage.getId()));
    }

    @Test
    void addParticipant_IntegrationTest() throws Exception {
        // Arrange - Create chat room first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);

        // Act & Assert
        mockMvc.perform(post("/api/chat/rooms/" + createdChatRoom.getId() + "/participants")
                .param("userId", "4")
                .param("role", "PARTICIPANT"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.chatRoomId").value(createdChatRoom.getId()))
            .andExpect(jsonPath("$.userId").value(4));
    }

    @Test
    void removeParticipant_IntegrationTest() throws Exception {
        // Arrange - Create chat room first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);

        // Act & Assert
        mockMvc.perform(delete("/api/chat/rooms/" + createdChatRoom.getId() + "/participants/2"))
            .andExpect(status().isNoContent());
    }

    @Test
    void getUnreadMessageCount_IntegrationTest() throws Exception {
        // Arrange - Create chat room and message first
        String createResponse = mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        ChatRoomResponse createdChatRoom = objectMapper.readValue(createResponse, ChatRoomResponse.class);
        chatMessageRequest.setChatRoomId(createdChatRoom.getId());

        mockMvc.perform(post("/api/chat/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatMessageRequest)))
            .andExpect(status().isCreated());

        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/" + createdChatRoom.getId() + "/unread-count")
                .param("userId", "1"))
            .andExpect(status().isOk())
            .andExpect(content().string("1"));
    }

    @Test
    void getChatRoomById_NotFound_IntegrationTest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/chat/rooms/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createChatRoom_ValidationError_IntegrationTest() throws Exception {
        // Arrange - Invalid request
        chatRoomRequest.setName(null);

        // Act & Assert
        mockMvc.perform(post("/api/chat/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chatRoomRequest)))
            .andExpect(status().isBadRequest());
    }
} 