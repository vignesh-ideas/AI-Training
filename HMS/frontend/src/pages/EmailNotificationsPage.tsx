import React, { useState } from 'react';
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
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';

interface EmailNotification {
  id: string;
  subject: string;
  recipient: string;
  sentAt: Date;
  status: 'sent' | 'failed';
  error?: string;
}

const mockEmails: EmailNotification[] = [
  {
    id: '1',
    subject: 'Appointment Confirmation',
    recipient: 'john.doe@example.com',
    sentAt: new Date(Date.now() - 1000 * 60 * 60),
    status: 'sent'
  },
  {
    id: '2',
    subject: 'Lab Results Ready',
    recipient: 'jane.smith@example.com',
    sentAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'sent'
  },
  {
    id: '3',
    subject: 'Prescription Expiry Alert',
    recipient: 'mike.johnson@example.com',
    sentAt: new Date(Date.now() - 1000 * 60 * 20),
    status: 'failed',
    error: 'Mailbox full'
  },
  {
    id: '4',
    subject: 'Welcome to HMS',
    recipient: 'new.user@example.com',
    sentAt: new Date(Date.now() - 1000 * 60 * 10),
    status: 'sent'
  }
];

const EmailNotificationsPage: React.FC = () => {
  const [emails, setEmails] = useState<EmailNotification[]>(mockEmails);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSendTestEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmails([
        {
          id: (emails.length + 1).toString(),
          subject: 'Test Email',
          recipient: 'test.user@example.com',
          sentAt: new Date(),
          status: 'sent'
        },
        ...emails
      ]);
      setSnackbar({
        open: true,
        message: 'Test email sent successfully',
        severity: 'success'
      });
    }, 1500);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Email notifications refreshed',
        severity: 'success'
      });
    }, 1000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <EmailIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
        <Typography variant="h4">Email Notifications</Typography>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Send Test Email">
          <span>
            <Button
              onClick={handleSendTestEmail}
              startIcon={<SendIcon />}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Send Test Email
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Card>
        <CardContent>
          <List>
            {emails.length === 0 && (
              <ListItem>
                <ListItemText primary="No email notifications" />
              </ListItem>
            )}
            {emails.map(email => (
              <React.Fragment key={email.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={email.subject}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {email.recipient}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {email.sentAt.toLocaleString()}
                        </Typography>
                        {email.status === 'failed' && (
                          <Typography variant="caption" color="error">
                            Error: {email.error}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  {email.status === 'sent' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Tooltip title={email.error || 'Failed'}>
                      <ErrorIcon color="error" />
                    </Tooltip>
                  )}
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
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailNotificationsPage; 