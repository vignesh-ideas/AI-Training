import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Button,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

interface ChatUser {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

// Mock users and messages for demonstration
const mockUsers: ChatUser[] = [
  { id: 'D001', name: 'Dr. Smith', role: 'doctor' },
  { id: 'P001', name: 'John Doe', role: 'patient' },
  { id: 'P002', name: 'Jane Smith', role: 'patient' }
];

const mockMessages: ChatMessage[] = [
  { id: '1', senderId: 'D001', receiverId: 'P001', content: 'Hello John, how are you feeling today?', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '2', senderId: 'P001', receiverId: 'D001', content: 'I am feeling better, thank you doctor.', timestamp: new Date(Date.now() - 1000 * 60 * 55) },
  { id: '3', senderId: 'D001', receiverId: 'P001', content: 'Great! Remember to take your medication.', timestamp: new Date(Date.now() - 1000 * 60 * 50) },
  { id: '4', senderId: 'D001', receiverId: 'P002', content: 'Hi Jane, did you get your lab results?', timestamp: new Date(Date.now() - 1000 * 60 * 40) },
  { id: '5', senderId: 'P002', receiverId: 'D001', content: 'Yes, I saw them. Thank you!', timestamp: new Date(Date.now() - 1000 * 60 * 35) }
];

const currentUserId = 'D001'; // Assume doctor is logged in

const RealTimeChatPage: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>(mockUsers);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [selectedUserId, setSelectedUserId] = useState<string>('P001');
  const [messageInput, setMessageInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for the selected conversation
  const conversationMessages = messages.filter(
    m => (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
         (m.senderId === selectedUserId && m.receiverId === currentUserId)
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage: ChatMessage = {
      id: (messages.length + 1).toString(),
      senderId: currentUserId,
      receiverId: selectedUserId,
      content: messageInput,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <Box sx={{ p: 3, height: '80vh' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Real-time Chat</Typography>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Chat List */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <List>
                {users.filter(u => u.id !== currentUserId).map(user => (
                  <React.Fragment key={user.id}>
                    <ListItem
                      button
                      selected={user.id === selectedUserId}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={user.role === 'doctor' ? 'Doctor' : 'Patient'}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Chat Window */}
        <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ flex: 1, p: 2, mb: 1, overflowY: 'auto', maxHeight: '60vh' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a conversation'}
            </Typography>
            <Box>
              {conversationMessages.map(msg => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: msg.senderId === currentUserId ? 'row-reverse' : 'row',
                    mb: 1
                  }}
                >
                  <Avatar sx={{ ml: msg.senderId === currentUserId ? 2 : 0, mr: msg.senderId !== currentUserId ? 2 : 0 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box
                    sx={{
                      bgcolor: msg.senderId === currentUserId ? 'primary.light' : 'grey.200',
                      color: msg.senderId === currentUserId ? 'primary.contrastText' : 'text.primary',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '70%',
                      minWidth: '60px',
                      wordBreak: 'break-word',
                      boxShadow: 1
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          </Paper>
          {/* Message Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              size="small"
            />
            <IconButton color="primary" onClick={handleSendMessage} aria-label="send">
              <SendIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeChatPage; 