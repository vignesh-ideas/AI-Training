import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  Person,
  MedicalServices,
  CalendarToday,
  AccessTime,
  Event,
  Description,
  ConfirmationNumber,
  LocationOn,
  Phone,
  Email,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

interface AppointmentData {
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  time: Date;
  type: string;
  reason: string;
  appointmentId: string;
}

interface AppointmentConfirmationProps {
  appointmentData: AppointmentData;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointmentData,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'primary';
      case 'FOLLOW_UP':
        return 'info';
      case 'LAB_TEST':
        return 'secondary';
      case 'PHYSICAL_EXAMINATION':
        return 'success';
      case 'SPECIALIST_CONSULTATION':
        return 'warning';
      case 'EMERGENCY':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return <MedicalServices />;
      case 'FOLLOW_UP':
        return <CalendarToday />;
      case 'LAB_TEST':
        return <MedicalServices />;
      case 'PHYSICAL_EXAMINATION':
        return <MedicalServices />;
      case 'SPECIALIST_CONSULTATION':
        return <Person />;
      case 'EMERGENCY':
        return <Warning />;
      default:
        return <Event />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle color="success" />
        Confirm Appointment
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please review your appointment details carefully before confirming. You will receive a confirmation email once the booking is complete.
      </Alert>

      <Grid container spacing={3}>
        {/* Appointment Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ConfirmationNumber />
                  </ListItemIcon>
                  <ListItemText
                    primary="Appointment ID"
                    secondary={appointmentData.appointmentId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Doctor"
                    secondary={appointmentData.doctorName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MedicalServices />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={appointmentData.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary={appointmentData.date.toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time"
                    secondary={appointmentData.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {getAppointmentTypeIcon(appointmentData.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary="Appointment Type"
                    secondary={
                      <Chip
                        label={appointmentData.type.replace('_', ' ')}
                        color={getAppointmentTypeColor(appointmentData.type) as any}
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary="Reason for Visit"
                    secondary={appointmentData.reason}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Important Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Important Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Arrival Time"
                    secondary="Please arrive 15 minutes before your appointment"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cancellation Policy"
                    secondary="Cancel at least 24 hours in advance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Confirmation"
                    secondary="You'll receive an email confirmation"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hospital Address"
                    secondary="123 Medical Center Dr, City, State 12345"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary="(555) 123-4567"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary="appointments@hms.com"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? undefined : <CheckCircle />}
        >
          {loading ? 'Confirming...' : 'Confirm Appointment'}
        </Button>
      </Box>

      {/* Terms and Conditions */}
      <Paper sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By confirming this appointment, you agree to our cancellation policy and understand that failure to show up may result in a no-show fee. 
          Please bring a valid ID and insurance information to your appointment.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AppointmentConfirmation; 