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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Update,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Info,
  Person,
  MedicalServices,
  CalendarToday,
  AccessTime,
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

interface AppointmentStatusUpdateProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (appointmentId: string, newStatus: string, notes: string) => Promise<void>;
  loading?: boolean;
}

const AppointmentStatusUpdate: React.FC<AppointmentStatusUpdateProps> = ({
  appointment,
  open,
  onClose,
  onUpdate,
  loading = false,
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled', color: 'info', icon: <Schedule /> },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'success', icon: <CheckCircle /> },
    { value: 'COMPLETED', label: 'Completed', color: 'primary', icon: <CheckCircle /> },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error', icon: <Cancel /> },
    { value: 'NO_SHOW', label: 'No Show', color: 'warning', icon: <Warning /> },
  ];

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || 'default';
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.icon || <Info />;
  };

  const handleSubmit = async () => {
    if (!appointment || !newStatus) {
      setError('Please select a new status');
      return;
    }

    try {
      await onUpdate(appointment.id, newStatus, notes);
      handleClose();
    } catch (error) {
      setError('Failed to update appointment status');
    }
  };

  const handleClose = () => {
    setNewStatus('');
    setNotes('');
    setError('');
    onClose();
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Update />
          Update Appointment Status
        </Box>
      </DialogTitle>
      <DialogContent>
        {appointment && (
          <>
            {/* Current Appointment Details */}
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
                    primary="Date"
                    secondary={new Date(appointment.date).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time"
                    secondary={appointment.time}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(appointment.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary="Current Status"
                    secondary={
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Status Update Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Update Status
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about the status change..."
                helperText="This will be recorded in the appointment history"
              />
            </Box>

            {/* Status Change Guidelines */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Status Guidelines
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scheduled"
                    secondary="Appointment is booked but not yet confirmed"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Confirmed"
                    secondary="Patient has confirmed they will attend"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Completed"
                    secondary="Appointment has been completed successfully"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Cancel color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cancelled"
                    secondary="Appointment has been cancelled by patient or doctor"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="No Show"
                    secondary="Patient did not attend the appointment"
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
            {newStatus && newStatus !== appointment.status && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You are about to change the status from{' '}
                <strong>{appointment.status}</strong> to{' '}
                <strong>{newStatus}</strong>. This action will be recorded in the appointment history.
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !newStatus || newStatus === appointment?.status}
          startIcon={loading ? <CircularProgress size={20} /> : <Update />}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentStatusUpdate; 