import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  CalendarToday,
  MedicalServices,
  LocalHospital,
  Medication,
  Assessment,
  Person,
  FilterList,
  Search,
  Download,
  Print,
  Visibility,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface PatientTimelineProps {
  patientId: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'APPOINTMENT' | 'CONSULTATION' | 'LAB_RESULT' | 'PRESCRIPTION' | 'SURGERY' | 'VACCINATION' | 'ADMISSION' | 'DISCHARGE' | 'FOLLOW_UP';
  title: string;
  description: string;
  doctor: string;
  location?: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'IN_PROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  attachments?: string[];
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({ patientId }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTimelineEvents();
  }, [patientId]);

  const fetchTimelineEvents = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          date: '2024-02-15',
          time: '10:00 AM',
          type: 'APPOINTMENT',
          title: 'Follow-up Appointment',
          description: 'Scheduled follow-up appointment with Dr. Sarah Johnson for routine check-up.',
          doctor: 'Dr. Sarah Johnson',
          location: 'Cardiology Department',
          status: 'PENDING',
          priority: 'MEDIUM',
        },
        {
          id: '2',
          date: '2024-01-15',
          time: '02:30 PM',
          type: 'CONSULTATION',
          title: 'Annual Physical Examination',
          description: 'Comprehensive annual physical examination. Patient is in good health with no significant findings.',
          doctor: 'Dr. Sarah Johnson',
          location: 'Primary Care Clinic',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          attachments: ['physical_report.pdf'],
        },
        {
          id: '3',
          date: '2024-01-10',
          time: '09:00 AM',
          type: 'LAB_RESULT',
          title: 'Blood Work Results Available',
          description: 'Complete blood count and comprehensive metabolic panel results are now available. All values within normal range.',
          doctor: 'Dr. Michael Chen',
          location: 'Laboratory',
          status: 'COMPLETED',
          priority: 'LOW',
          attachments: ['blood_work_results.pdf'],
        },
        {
          id: '4',
          date: '2023-12-20',
          time: '11:00 AM',
          type: 'PRESCRIPTION',
          title: 'Medication Refill - Lisinopril',
          description: 'Refill prescription for hypertension management. Dosage: 10mg daily.',
          doctor: 'Dr. Sarah Johnson',
          location: 'Pharmacy',
          status: 'COMPLETED',
          priority: 'MEDIUM',
        },
        {
          id: '5',
          date: '2023-11-15',
          time: '08:00 AM',
          type: 'SURGERY',
          title: 'Appendectomy',
          description: 'Laparoscopic appendectomy performed due to acute appendicitis. Surgery was successful with no complications.',
          doctor: 'Dr. Robert Wilson',
          location: 'Operating Room',
          status: 'COMPLETED',
          priority: 'HIGH',
          attachments: ['surgery_report.pdf', 'discharge_summary.pdf'],
        },
        {
          id: '6',
          date: '2023-11-10',
          time: '03:00 PM',
          type: 'ADMISSION',
          title: 'Hospital Admission',
          description: 'Patient admitted to hospital for acute appendicitis. Scheduled for surgery.',
          doctor: 'Dr. Robert Wilson',
          location: 'Emergency Department',
          status: 'COMPLETED',
          priority: 'URGENT',
        },
        {
          id: '7',
          date: '2023-11-18',
          time: '10:00 AM',
          type: 'DISCHARGE',
          title: 'Hospital Discharge',
          description: 'Patient discharged from hospital after successful appendectomy. Recovery progressing well.',
          doctor: 'Dr. Robert Wilson',
          location: 'Surgical Ward',
          status: 'COMPLETED',
          priority: 'MEDIUM',
        },
        {
          id: '8',
          date: '2023-10-05',
          time: '02:00 PM',
          type: 'VACCINATION',
          title: 'Flu Shot',
          description: 'Annual influenza vaccination administered.',
          doctor: 'Dr. Emily Davis',
          location: 'Immunization Clinic',
          status: 'COMPLETED',
          priority: 'LOW',
        },
        {
          id: '9',
          date: '2023-09-20',
          time: '01:30 PM',
          type: 'FOLLOW_UP',
          title: 'Post-Surgery Follow-up',
          description: 'Follow-up appointment after appendectomy. Wound healing well, no complications.',
          doctor: 'Dr. Robert Wilson',
          location: 'Surgical Clinic',
          status: 'COMPLETED',
          priority: 'MEDIUM',
        },
      ];

      setEvents(mockEvents);
    } catch (error) {
      setError('Failed to load timeline events');
      toast.error('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return <CalendarToday />;
      case 'CONSULTATION':
        return <MedicalServices />;
      case 'LAB_RESULT':
        return <Assessment />;
      case 'PRESCRIPTION':
        return <Medication />;
      case 'SURGERY':
        return <LocalHospital />;
      case 'VACCINATION':
        return <MedicalServices />;
      case 'ADMISSION':
        return <LocalHospital />;
      case 'DISCHARGE':
        return <LocalHospital />;
      case 'FOLLOW_UP':
        return <Person />;
      default:
        return <TimelineIcon />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return 'primary';
      case 'CONSULTATION':
        return 'info';
      case 'LAB_RESULT':
        return 'secondary';
      case 'PRESCRIPTION':
        return 'success';
      case 'SURGERY':
        return 'error';
      case 'VACCINATION':
        return 'warning';
      case 'ADMISSION':
        return 'error';
      case 'DISCHARGE':
        return 'success';
      case 'FOLLOW_UP':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'IN_PROGRESS':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'error';
      case 'URGENT':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewEvent = (event: TimelineEvent) => {
    toast.success(`Viewing ${event.title}`);
  };

  const handleDownloadTimeline = () => {
    toast.success('Timeline downloaded');
  };

  const handlePrintTimeline = () => {
    toast.success('Timeline printed');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || event.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon />
          Patient Timeline
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Download Timeline">
            <IconButton onClick={handleDownloadTimeline}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print Timeline">
            <IconButton onClick={handlePrintTimeline}>
              <Print />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search timeline events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Event Type"
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="APPOINTMENT">Appointments</MenuItem>
                  <MenuItem value="CONSULTATION">Consultations</MenuItem>
                  <MenuItem value="LAB_RESULT">Lab Results</MenuItem>
                  <MenuItem value="PRESCRIPTION">Prescriptions</MenuItem>
                  <MenuItem value="SURGERY">Surgeries</MenuItem>
                  <MenuItem value="VACCINATION">Vaccinations</MenuItem>
                  <MenuItem value="ADMISSION">Admissions</MenuItem>
                  <MenuItem value="DISCHARGE">Discharges</MenuItem>
                  <MenuItem value="FOLLOW_UP">Follow-ups</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredEvents.length} events
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Timeline Events Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                ? 'No events match your search criteria.'
                : 'No timeline events have been recorded for this patient yet.'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Timeline position="alternate">
              {filteredEvents.map((event, index) => (
                <TimelineItem key={event.id}>
                  <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                    <Typography variant="body2" component="span">
                      {event.date}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {event.time}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getEventColor(event.type) as any}>
                      {getEventIcon(event.type)}
                    </TimelineDot>
                    {index < filteredEvents.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" component="span">
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={event.status}
                              color={getStatusColor(event.status) as any}
                              size="small"
                            />
                            <Chip
                              label={event.priority}
                              color={getPriorityColor(event.priority) as any}
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {event.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {event.doctor} • {event.location}
                          </Typography>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewEvent(event)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      )}

      {/* Timeline Statistics */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {events.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {events.filter(e => e.status === 'COMPLETED').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {events.filter(e => e.status === 'PENDING').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {new Set(events.map(e => e.doctor)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doctors Involved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientTimeline; 