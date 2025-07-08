import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Cancel,
  Warning,
  Info,
  Person,
  MedicalServices,
  CalendarToday,
  AccessTime,
  Schedule,
} from '@mui/icons-material';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason: string;
}

interface AppointmentCancellationProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onCancel: (appointmentId: string, cancellationReason: string, notes: string) => Promise<void>;
  loading?: boolean;
}

const AppointmentCancellation: React.FC<AppointmentCancellationProps> = ({
  appointment,
  open,
  onClose,
  onCancel,
  loading = false,
}) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const cancellationReasons = [
    { value: 'patient_request', label: 'Patient Request' },
    { value: 'doctor_unavailable', label: 'Doctor Unavailable' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'weather', label: 'Weather Conditions' },
    { value: 'technical_issue', label: 'Technical Issue' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'no_show', label: 'No Show' },
    { value: 'custom', label: 'Other (Custom)' },
  ];

  const handleSubmit = async () => {
    if (!appointment) {
      setError('No appointment selected');
      return;
    }

    if (!cancellationReason) {
      setError('Please select a cancellation reason');
      return;
    }

    if (cancellationReason === 'custom' && !customReason.trim()) {
      setError('Please provide a custom cancellation reason');
      return;
    }

    try {
      const finalReason = cancellationReason === 'custom' ? customReason : cancellationReason;
      await onCancel(appointment.id, finalReason, notes);
      handleClose();
    } catch (error) {
      setError('Failed to cancel appointment');
    }
  };

  const handleClose = () => {
    setCancellationReason('');
    setCustomReason('');
    setNotes('');
    setError('');
    onClose();
  };

  const handleReasonChange = (reason: string) => {
    setCancellationReason(reason);
    setError('');
  };

  const getTimeUntilAppointment = () => {
    if (!appointment) return '';
    
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs < 0) return 'Past appointment';
    if (diffDays > 0) return `${diffDays} day(s) away`;
    if (diffHours > 0) return `${diffHours} hour(s) away`;
    return 'Less than 1 hour away';
  };

  const getCancellationPolicy = () => {
    const timeUntil = getTimeUntilAppointment();
    
    if (timeUntil.includes('day') && parseInt(timeUntil) >= 1) {
      return 'No cancellation fee - more than 24 hours notice';
    } else if (timeUntil.includes('hour') && parseInt(timeUntil) >= 2) {
      return '50% cancellation fee - less than 24 hours notice';
    } else {
      return 'Full cancellation fee - less than 2 hours notice';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cancel color="error" />
          Cancel Appointment
        </Box>
      </DialogTitle>
      <DialogContent>
        {appointment && (
          <>
            {/* Warning Alert */}
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cancellation Warning
              </Typography>
              <Typography variant="body2">
                Cancelling this appointment will free up the time slot for other patients. 
                This action cannot be undone.
              </Typography>
            </Alert>

            {/* Appointment Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Patient"
                    secondary={appointment.patientName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MedicalServices />
                  </ListItemIcon>
                  <ListItemText
                    primary="Doctor"
                    secondary={appointment.doctorName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date & Time"
                    secondary={`${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time Until Appointment"
                    secondary={getTimeUntilAppointment()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cancellation Policy"
                    secondary={getCancellationPolicy()}
                  />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Cancellation Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cancellation Details
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Reason for Cancellation</InputLabel>
                <Select
                  value={cancellationReason}
                  label="Reason for Cancellation"
                  onChange={(e) => handleReasonChange(e.target.value)}
                >
                  {cancellationReasons.map((reason) => (
                    <MenuItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {cancellationReason === 'custom' && (
                <TextField
                  fullWidth
                  label="Custom Reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify the cancellation reason..."
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about the cancellation..."
                helperText="This will be recorded in the appointment history"
              />
            </Box>

            {/* Cancellation Impact */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cancellation Impact
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time Slot"
                    secondary="This time slot will be made available for other patients"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Patient Notification"
                    secondary="Patient will receive a cancellation notification"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rescheduling"
                    secondary="Patient can reschedule through the patient portal"
                  />
                </ListItem>
              </List>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Confirmation Alert */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Confirmation Required
              </Typography>
              <Typography variant="body2">
                By confirming this cancellation, you acknowledge that this action cannot be undone 
                and the patient will be notified of the cancellation.
              </Typography>
            </Alert>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Keep Appointment
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading || !cancellationReason || (cancellationReason === 'custom' && !customReason.trim())}
          startIcon={loading ? <CircularProgress size={20} /> : <Cancel />}
        >
          {loading ? 'Cancelling...' : 'Confirm Cancellation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentCancellation; 