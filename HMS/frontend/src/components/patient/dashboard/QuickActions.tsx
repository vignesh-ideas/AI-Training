import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  MedicalServices,
  Description,
  Chat,
  Notifications,
  Download,
  Print,
  Share,
  Add,
  Schedule,
  Assessment,
  Medication,
} from '@mui/icons-material';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const quickActions = [
    {
      id: 'schedule_appointment',
      title: 'Schedule Appointment',
      description: 'Book a new appointment',
      icon: <CalendarToday />,
      color: 'primary',
    },
    {
      id: 'view_medical_records',
      title: 'View Medical Records',
      description: 'Access your health records',
      icon: <Description />,
      color: 'info',
    },
    {
      id: 'request_prescription',
      title: 'Request Prescription',
      description: 'Request medication refill',
      icon: <Medication />,
      color: 'secondary',
    },
    {
      id: 'contact_doctor',
      title: 'Contact Doctor',
      description: 'Send message to doctor',
      icon: <Chat />,
      color: 'success',
    },
    {
      id: 'lab_results',
      title: 'Lab Results',
      description: 'View test results',
      icon: <Assessment />,
      color: 'warning',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notifications',
      icon: <Notifications />,
      color: 'error',
    },
  ];

  const recentActions = [
    {
      id: 'download_records',
      title: 'Download Records',
      description: 'Export medical history',
      icon: <Download />,
      date: '2 hours ago',
    },
    {
      id: 'print_prescription',
      title: 'Print Prescription',
      description: 'Print current prescription',
      icon: <Print />,
      date: '1 day ago',
    },
    {
      id: 'share_records',
      title: 'Share Records',
      description: 'Share with specialist',
      icon: <Share />,
      date: '3 days ago',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Add />
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Quick Action Buttons */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {quickActions.map((action) => (
            <Grid item xs={6} key={action.id}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={() => onAction(action.id)}
                sx={{
                  height: 80,
                  flexDirection: 'column',
                  gap: 0.5,
                  textTransform: 'none',
                  borderColor: `${action.color}.main`,
                  color: `${action.color}.main`,
                  '&:hover': {
                    borderColor: `${action.color}.dark`,
                    backgroundColor: `${action.color}.light`,
                  },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Recent Actions */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Recent Actions
          </Typography>
          <List dense>
            {recentActions.map((action, index) => (
              <React.Fragment key={action.id}>
                <ListItem
                  sx={{
                    px: 0,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => onAction(action.id)}
                >
                  <ListItemIcon>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={action.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentActions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Emergency Actions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom color="error">
            Emergency Actions
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                size="small"
                startIcon={<MedicalServices />}
                onClick={() => onAction('emergency_contact')}
              >
                Emergency Contact
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                size="small"
                startIcon={<Schedule />}
                onClick={() => onAction('urgent_appointment')}
              >
                Urgent Appointment
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Help & Support */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Help & Support
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Chat />
              </ListItemIcon>
              <ListItemText
                primary="Live Chat Support"
                secondary="Get instant help"
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="System Status"
                secondary="Check service availability"
              />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 