import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Info,
} from '@mui/icons-material';

interface TimeSlot {
  id: string;
  time: Date;
  available: boolean;
  duration: number;
  doctor?: string;
  department?: string;
}

interface TimeSlotSelectorProps {
  selectedDate: Date | null;
  selectedDoctor: string;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
  loading?: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedDoctor,
  onSlotSelect,
  selectedSlot,
  loading = false,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'booked'>('all');

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      generateTimeSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const generateTimeSlots = () => {
    if (!selectedDate) return;

    const slots: TimeSlot[] = [];
    const baseTime = new Date(selectedDate);
    baseTime.setHours(9, 0, 0, 0); // Start at 9 AM

    // Generate slots from 9 AM to 5 PM with 30-minute intervals
    for (let i = 0; i < 16; i++) {
      const slotTime = new Date(baseTime);
      slotTime.setMinutes(baseTime.getMinutes() + (i * 30));
      
      // Skip lunch break (12:00 - 1:00 PM)
      const hour = slotTime.getHours();
      if (hour === 12) continue;

      slots.push({
        id: `slot-${i}`,
        time: slotTime,
        available: Math.random() > 0.4, // 60% availability
        duration: 30,
        doctor: selectedDoctor,
      });
    }

    setTimeSlots(slots);
  };

  const getTimeSlotStatus = (slot: TimeSlot) => {
    if (!slot.available) return 'booked';
    if (selectedSlot?.id === slot.id) return 'selected';
    return 'available';
  };

  const getTimeSlotColor = (status: string) => {
    switch (status) {
      case 'selected':
        return 'success';
      case 'booked':
        return 'error';
      case 'available':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getTimeSlotIcon = (status: string) => {
    switch (status) {
      case 'selected':
        return <CheckCircle />;
      case 'booked':
        return <Cancel />;
      case 'available':
        return <Schedule />;
      default:
        return <AccessTime />;
    }
  };

  const filteredSlots = timeSlots.filter(slot => {
    if (filter === 'all') return true;
    if (filter === 'available') return slot.available;
    if (filter === 'booked') return !slot.available;
    return true;
  });

  const availableCount = timeSlots.filter(slot => slot.available).length;
  const bookedCount = timeSlots.filter(slot => !slot.available).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime />
          Available Time Slots
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${availableCount} Available`}
            color="success"
            size="small"
          />
          <Chip
            label={`${bookedCount} Booked`}
            color="error"
            size="small"
          />
        </Box>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('all')}
            >
              All ({timeSlots.length})
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={filter === 'available' ? 'contained' : 'outlined'}
              size="small"
              color="success"
              onClick={() => setFilter('available')}
            >
              Available ({availableCount})
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={filter === 'booked' ? 'contained' : 'outlined'}
              size="small"
              color="error"
              onClick={() => setFilter('booked')}
            >
              Booked ({bookedCount})
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Time Slots Grid */}
      {!loading && (
        <Grid container spacing={1}>
          {filteredSlots.map((slot) => {
            const status = getTimeSlotStatus(slot);
            const color = getTimeSlotColor(status);
            const icon = getTimeSlotIcon(status);

            return (
              <Grid item xs={6} md={4} lg={3} key={slot.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    opacity: slot.available ? 1 : 0.6,
                    borderColor: status === 'selected' ? 'success.main' : 'divider',
                    backgroundColor: status === 'selected' ? 'success.light' : 'background.paper',
                    '&:hover': slot.available ? {
                      backgroundColor: status === 'selected' ? 'success.light' : 'action.hover',
                    } : {},
                  }}
                  onClick={() => slot.available && onSlotSelect(slot)}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {slot.duration} min
                    </Typography>
                    {status === 'selected' && (
                      <Chip
                        label="Selected"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* No Slots Available */}
      {!loading && filteredSlots.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No time slots available for the selected criteria.
        </Alert>
      )}

      {/* Selected Slot Details */}
      {selectedSlot && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Selected Time Slot
          </Typography>
          <Card variant="outlined" sx={{ borderColor: 'success.main' }}>
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time"
                    secondary={selectedSlot.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Duration"
                    secondary={`${selectedSlot.duration} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary="Available"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Legend */}
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<Schedule />}
            label="Available"
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<CheckCircle />}
            label="Selected"
            size="small"
            color="success"
          />
          <Chip
            icon={<Cancel />}
            label="Booked"
            size="small"
            color="error"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TimeSlotSelector; 