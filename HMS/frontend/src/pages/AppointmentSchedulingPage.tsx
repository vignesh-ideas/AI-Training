import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  Person,
  MedicalServices,
  CheckCircle,
  Warning,
  Info,
  ArrowBack,
  ArrowForward,
  Today,
  Event,
  AccessTime,
  LocationOn,
  Description,
  ConfirmationNumber,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AppointmentSchedulingPageProps {
  patientId?: string;
}

const AppointmentSchedulingPage: React.FC<AppointmentSchedulingPageProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDoctors = [
        { id: '1', name: 'Dr. Sarah Johnson', department: 'Cardiology', specialization: 'Cardiologist' },
        { id: '2', name: 'Dr. Michael Chen', department: 'Neurology', specialization: 'Neurologist' },
        { id: '3', name: 'Dr. Emily Davis', department: 'Dermatology', specialization: 'Dermatologist' },
        { id: '4', name: 'Dr. Robert Wilson', department: 'Orthopedics', specialization: 'Orthopedic Surgeon' },
      ];

      const mockDepartments = [
        { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system' },
        { id: '2', name: 'Neurology', description: 'Brain and nervous system' },
        { id: '3', name: 'Dermatology', description: 'Skin conditions and treatments' },
        { id: '4', name: 'Orthopedics', description: 'Bones, joints, and muscles' },
        { id: '5', name: 'General Medicine', description: 'General health and wellness' },
      ];

      setDoctors(mockDoctors);
      setDepartments(mockDepartments);
    } catch (error) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedDoctor) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
      const baseTime = new Date(selectedDate);
      baseTime.setHours(9, 0, 0, 0); // Start at 9 AM

      const mockSlots = [];
      for (let i = 0; i < 8; i++) { // 8 slots from 9 AM to 5 PM
        const slotTime = new Date(baseTime);
        slotTime.setHours(9 + i, 0, 0, 0);
        
        mockSlots.push({
          id: `slot-${i}`,
          time: slotTime,
          available: Math.random() > 0.3, // 70% availability
          duration: 30,
          doctor: selectedDoctorData?.name,
        });
      }

      setAvailableSlots(mockSlots);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedDate(new Date());
    setSelectedTime(null);
    setSelectedDoctor('');
    setSelectedDepartment('');
    setAppointmentType('');
    setReason('');
  };

  const handleSlotSelection = (slot: any) => {
    setSelectedTime(slot.time);
    handleNext();
  };

  const handleBookingConfirmation = () => {
    const bookingData = {
      patientId: patientId || 'PAT001',
      doctorId: selectedDoctor,
      doctorName: doctors.find(d => d.id === selectedDoctor)?.name,
      department: departments.find(d => d.id === selectedDepartment)?.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      reason: reason,
      appointmentId: `APT-${Date.now()}`,
    };

    setBookingData(bookingData);
    setConfirmationDialog(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment booked successfully!');
      setConfirmationDialog(false);
      handleReset();
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Select Department & Doctor',
      description: 'Choose the department and doctor for your appointment',
    },
    {
      label: 'Select Date & Time',
      description: 'Pick a convenient date and time slot',
    },
    {
      label: 'Appointment Details',
      description: 'Provide appointment type and reason',
    },
    {
      label: 'Confirmation',
      description: 'Review and confirm your booking',
    },
  ];

  const appointmentTypes = [
    'CONSULTATION',
    'FOLLOW_UP',
    'LAB_TEST',
    'PHYSICAL_EXAMINATION',
    'SPECIALIST_CONSULTATION',
    'EMERGENCY',
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        <Box>
                          <Typography variant="body1">{dept.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dept.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={selectedDoctor}
                    label="Doctor"
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    disabled={!selectedDepartment}
                  >
                    {doctors
                      .filter(doctor => !selectedDepartment || doctor.department === departments.find(d => d.id === selectedDepartment)?.name)
                      .map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          <Box>
                            <Typography variant="body1">{doctor.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doctor.specialization}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedDepartment || !selectedDoctor}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Available Time Slots
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={1}>
                    {availableSlots.map((slot) => (
                      <Grid item xs={6} md={4} key={slot.id}>
                        <Button
                          variant={selectedTime?.getTime() === slot.time.getTime() ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => handleSlotSelection(slot)}
                          disabled={!slot.available}
                          sx={{ mb: 1 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                              {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            {!slot.available && (
                              <Typography variant="caption" color="error">
                                Booked
                              </Typography>
                            )}
                          </Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedTime}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={appointmentType}
                    label="Appointment Type"
                    onChange={(e) => setAppointmentType(e.target.value)}
                  >
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason for Visit"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for the appointment..."
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleBookingConfirmation}
                disabled={!appointmentType || !reason.trim()}
              >
                Review Booking
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText
                          primary="Doctor"
                          secondary={doctors.find(d => d.id === selectedDoctor)?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <MedicalServices />
                        </ListItemIcon>
                        <ListItemText
                          primary="Department"
                          secondary={departments.find(d => d.id === selectedDepartment)?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date"
                          secondary={selectedDate?.toLocaleDateString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTime />
                        </ListItemIcon>
                        <ListItemText
                          primary="Time"
                          secondary={selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Event />
                        </ListItemIcon>
                        <ListItemText
                          primary="Appointment Type"
                          secondary={appointmentType?.replace('_', ' ')}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText
                          primary="Reason"
                          secondary={reason}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setConfirmationDialog(true)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Confirm Booking'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Schedule Appointment - HMS</title>
        <meta name="description" content="Schedule a new appointment with our healthcare providers" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Schedule Appointment
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule />
                  Booking Steps
                </Typography>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography variant="subtitle1">{step.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          {renderStepContent(index)}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper square elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1 }}>
                      Reset
                    </Button>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {steps[activeStep]?.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {steps[activeStep]?.description}
                </Typography>
                {renderStepContent(activeStep)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmationDialog}
          onClose={() => setConfirmationDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              Confirm Appointment Booking
            </Box>
          </DialogTitle>
          <DialogContent>
            {bookingData && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please review your appointment details before confirming.
                </Alert>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ConfirmationNumber />
                    </ListItemIcon>
                    <ListItemText
                      primary="Appointment ID"
                      secondary={bookingData.appointmentId}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Doctor"
                      secondary={bookingData.doctorName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date & Time"
                      secondary={`${bookingData.date?.toLocaleDateString()} at ${bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Event />
                    </ListItemIcon>
                    <ListItemText
                      primary="Type"
                      secondary={bookingData.type?.replace('_', ' ')}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmationDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AppointmentSchedulingPage; 