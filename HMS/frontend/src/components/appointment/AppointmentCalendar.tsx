import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';

interface AppointmentCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  appointments?: any[];
  disabledDates?: Date[];
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
  onDateSelect,
  appointments = [],
  disabledDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable specific disabled dates
    return disabledDates.some(disabledDate => 
      disabledDate.toDateString() === date.toDateString()
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getDateStatus = (date: Date) => {
    const dayAppointments = getAppointmentsForDate(date);
    const hasAppointments = dayAppointments.length > 0;
    const isDisabled = isDateDisabled(date);
    const isSelected = isDateSelected(date);

    if (isDisabled) return 'disabled';
    if (isSelected) return 'selected';
    if (hasAppointments) return 'has-appointments';
    return 'available';
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    days.push(
      <Grid container key="headers" sx={{ mb: 1 }}>
        {dayNames.map(day => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
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
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getDateStatus(date);
      const dayAppointments = getAppointmentsForDate(date);

      days.push(
        <Grid item xs key={day}>
          <Paper
            elevation={status === 'selected' ? 3 : 1}
            sx={{
              p: 1,
              minHeight: 80,
              cursor: status === 'disabled' ? 'not-allowed' : 'pointer',
              backgroundColor: status === 'selected' ? 'primary.light' : 'background.paper',
              border: status === 'selected' ? 2 : 1,
              borderColor: status === 'selected' ? 'primary.main' : 'divider',
              opacity: status === 'disabled' ? 0.5 : 1,
              '&:hover': status !== 'disabled' ? {
                backgroundColor: status === 'selected' ? 'primary.light' : 'action.hover',
              } : {},
            }}
            onClick={() => status !== 'disabled' && onDateSelect(date)}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: status === 'selected' ? 'bold' : 'normal',
                color: status === 'selected' ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {day}
            </Typography>
            
            {dayAppointments.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {dayAppointments.slice(0, 2).map((appointment, index) => (
                  <Chip
                    key={index}
                    label={appointment.type?.replace('_', ' ')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.6rem', height: 16, mb: 0.5 }}
                  />
                ))}
                {dayAppointments.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{dayAppointments.length - 2} more
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Previous Month">
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Today">
            <IconButton onClick={handleToday}>
              <Today />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next Month">
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {renderCalendar()}
      </Grid>

      {/* Calendar Legend */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<Event />}
            label="Available"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<CheckCircle />}
            label="Selected"
            size="small"
            color="primary"
          />
          <Chip
            icon={<Schedule />}
            label="Has Appointments"
            size="small"
            color="secondary"
          />
          <Chip
            icon={<Cancel />}
            label="Disabled"
            size="small"
            color="error"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentCalendar; 