import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday,
  MedicalServices,
  Assessment,
  CheckCircle,
  Schedule,
  Cancel,
  Visibility,
  Edit,
} from '@mui/icons-material';

interface RecentAppointmentsProps {
  appointments: any[];
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return <MedicalServices color="primary" />;
      case 'LAB_TEST':
        return <Assessment color="secondary" />;
      case 'FOLLOW_UP':
        return <CalendarToday color="info" />;
      case 'SURGERY':
        return <MedicalServices color="error" />;
      default:
        return <CalendarToday />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle color="success" />;
      case 'SCHEDULED':
        return <Schedule color="info" />;
      case 'CANCELLED':
        return <Cancel color="error" />;
      default:
        return <CalendarToday />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'SCHEDULED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewAppointment = (appointment: any) => {
    console.log('View appointment:', appointment);
  };

  const handleEditAppointment = (appointment: any) => {
    console.log('Edit appointment:', appointment);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday />
            Recent Appointments
          </Typography>
          <Button variant="outlined" size="small">
            View All
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {appointments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No recent appointments found.
            </Typography>
          </Box>
        ) : (
          <List>
            {appointments.map((appointment, index) => (
              <React.Fragment key={appointment.id}>
                <ListItem
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <ListItemIcon>
                    {getAppointmentIcon(appointment.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1">
                          {appointment.description}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.date} at {appointment.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.doctor}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getStatusIcon(appointment.status)}
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {appointment.status === 'SCHEDULED' && (
                      <Tooltip title="Edit Appointment">
                        <IconButton
                          size="small"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
                {index < appointments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Appointment Statistics */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Appointment Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={`${appointments.filter(a => a.status === 'COMPLETED').length} Completed`}
              color="success"
              size="small"
            />
            <Chip
              label={`${appointments.filter(a => a.status === 'SCHEDULED').length} Scheduled`}
              color="info"
              size="small"
            />
            <Chip
              label={`${appointments.filter(a => a.status === 'CANCELLED').length} Cancelled`}
              color="error"
              size="small"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments; 