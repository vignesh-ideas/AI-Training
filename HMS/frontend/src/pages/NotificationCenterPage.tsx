import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Badge,
  Button,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'event' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome',
    message: 'Welcome to the HMS system!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false
  },
  {
    id: '2',
    type: 'event',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Smith at 3:00 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Lab Result Pending',
    message: 'Your recent lab result is pending review.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    isRead: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Prescription Expired',
    message: 'Your prescription for Metformin has expired.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    message: 'Dr. Smith sent you a new message.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: true
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'info': return <InfoIcon color="info" />;
    case 'warning': return <WarningIcon color="warning" />;
    case 'error': return <ErrorIcon color="error" />;
    case 'event': return <EventIcon color="primary" />;
    case 'message': return <MessageIcon color="secondary" />;
    default: return <NotificationsIcon />;
  }
};

const NotificationCenterPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tab, setTab] = useState<string>('all');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications =
    tab === 'all'
      ? notifications
      : notifications.filter(n => n.type === tab);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
    setSnackbar({ open: true, message: 'Notification marked as read', severity: 'success' });
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setSnackbar({ open: true, message: 'Notification deleted', severity: 'info' });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setSnackbar({ open: true, message: 'All notifications marked as read', severity: 'success' });
  };

  const handleClearAll = () => {
    setNotifications([]);
    setSnackbar({ open: true, message: 'All notifications cleared', severity: 'info' });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
        </Badge>
        <Typography variant="h4">Notification Center</Typography>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} sx={{ mr: 1 }}>
          Mark all as read
        </Button>
        <Button onClick={handleClearAll} color="error" disabled={notifications.length === 0}>
          Clear all
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            <Tab label="All" value="all" />
            <Tab label="Info" value="info" />
            <Tab label="Warning" value="warning" />
            <Tab label="Error" value="error" />
            <Tab label="Event" value="event" />
            <Tab label="Message" value="message" />
          </Tabs>
          <List>
            {filteredNotifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
            {filteredNotifications.map(n => (
              <React.Fragment key={n.id}>
                <ListItem
                  sx={{ bgcolor: !n.isRead ? 'action.selected' : undefined, borderRadius: 1 }}
                  secondaryAction={
                    <Box>
                      {!n.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton onClick={() => handleMarkAsRead(n.id)} aria-label="mark as read">
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(n.id)} aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {getTypeIcon(n.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={n.title}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {n.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {n.timestamp.toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  {!n.isRead && <Chip label="Unread" color="primary" size="small" sx={{ ml: 1 }} />}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default NotificationCenterPage; 