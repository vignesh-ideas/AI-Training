import React, { useState } from 'react';
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
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  CalendarToday,
  MedicalServices,
  Assessment,
  Schedule,
  Edit,
  Cancel,
  Add,
  Today,
  Event,
} from '@mui/icons-material';

interface UpcomingCalendarProps {
  appointments: any[];
}

const UpcomingCalendar: React.FC<UpcomingCalendarProps> = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
        return <Event />;
    }
  };

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'primary';
      case 'LAB_TEST':
        return 'secondary';
      case 'FOLLOW_UP':
        return 'info';
      case 'SURGERY':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEditAppointment = (appointment: any) => {
    console.log('Edit appointment:', appointment);
  };

  const handleCancelAppointment = (appointment: any) => {
    console.log('Cancel appointment:', appointment);
  };

  const handleAddAppointment = () => {
    console.log('Add new appointment');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getAppointmentsForDate = (date: number) => {
    const targetDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date);
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === targetDate.toDateString();
    });
  };

  const { daysInMonth, startingDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    days.push(
      <Grid container key="headers" sx={{ mb: 1 }}>
        {dayNames.map(day => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<Grid item xs key={`empty-${i}`} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day);
      const isToday = day === new Date().getDate() && 
                     selectedDate.getMonth() === new Date().getMonth() &&
                     selectedDate.getFullYear() === new Date().getFullYear();

      days.push(
        <Grid item xs key={day}>
          <Paper
            elevation={isToday ? 3 : 1}
            sx={{
              p: 1,
              minHeight: 80,
              backgroundColor: isToday ? 'primary.light' : 'background.paper',
              border: isToday ? 2 : 1,
              borderColor: isToday ? 'primary.main' : 'divider',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: isToday ? 'bold' : 'normal',
                color: isToday ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {day}
            </Typography>
            {dayAppointments.map((appointment, index) => (
              <Chip
                key={index}
                label={appointment.type.replace('_', ' ')}
                size="small"
                color={getAppointmentColor(appointment.type) as any}
                sx={{ fontSize: '0.6rem', height: 16, mt: 0.5 }}
              />
            ))}
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday />
            Upcoming Calendar
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Add Appointment">
              <IconButton size="small" onClick={handleAddAppointment}>
                <Add />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Calendar Grid */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1}>
            {renderCalendar()}
          </Grid>
        </Box>

        {/* Upcoming Appointments List */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Upcoming Appointments
          </Typography>
          {appointments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No upcoming appointments scheduled.
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
                            label={appointment.type.replace('_', ' ')}
                            color={getAppointmentColor(appointment.type) as any}
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
                      <Tooltip title="Edit Appointment">
                        <IconButton
                          size="small"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel Appointment">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancelAppointment(appointment)}
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Calendar Legend */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Consultation" size="small" color="primary" />
            <Chip label="Lab Test" size="small" color="secondary" />
            <Chip label="Follow-up" size="small" color="info" />
            <Chip label="Surgery" size="small" color="error" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpcomingCalendar; 