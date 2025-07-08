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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Search,
  FilterList,
  Download,
  Upload,
  Print,
  Refresh,
  MoreVert,
  Description,
  Person,
  MedicalServices,
  CalendarToday,
  AccessTime,
  LocationOn,
  Category,
  FileCopy,
  History,
  Security,
  Verified,
  Pending,
  Error,
  Timeline as TimelineIcon,
  Analytics,
  TrendingUp,
  TrendingDown,
  Assessment,
  BarChart,
  PieChart,
  Visibility,
  Edit,
  Delete,
  Add,
  FilterAlt,
  Sort,
  DateRange,
  Event,
  LocalHospital,
  Medication,
  Science,
  MonitorHeart,
  AttachFile,
  Note,
  ExpandMore,
  ExpandLess,
  KeyboardArrowRight,
  KeyboardArrowLeft,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TimelineEvent {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  eventType: string;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  labResults?: string[];
  vitalSigns?: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
  dateCreated: string;
  dateUpdated: string;
  status: string;
  priority: string;
  tags: string[];
  attachments: string[];
  notes: string;
  isConfidential: boolean;
}

interface TimelineAnalytics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByDepartment: Record<string, number>;
  eventsByStatus: Record<string, number>;
  eventsByMonth: Record<string, number>;
  averageEventsPerMonth: number;
  mostActiveDepartment: string;
  mostCommonEventType: string;
}

const MedicalHistoryTimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [analytics, setAnalytics] = useState<TimelineAnalytics | null>(null);
  const [showConfidential, setShowConfidential] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
          patientId: patientId || 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          eventType: 'CONSULTATION',
          title: 'Cardiac Consultation',
          description: 'Patient presented with chest pain and shortness of breath',
          diagnosis: 'Angina pectoris',
          treatment: 'Prescribed nitroglycerin and lifestyle modifications',
          medications: ['Nitroglycerin', 'Aspirin', 'Metoprolol'],
          labResults: ['ECG', 'Blood Tests', 'Chest X-Ray'],
          vitalSigns: {
            bloodPressure: '140/90 mmHg',
            heartRate: '85 bpm',
            temperature: '98.6°F',
            oxygenSaturation: '95%',
          },
          dateCreated: '2024-01-15T10:00:00Z',
          dateUpdated: '2024-01-15T10:00:00Z',
          status: 'COMPLETED',
          priority: 'HIGH',
          tags: ['Cardiac', 'Chest Pain', 'Follow-up Required'],
          attachments: ['ecg_report.pdf', 'blood_test.pdf'],
          notes: 'Patient advised to return in 2 weeks for follow-up',
          isConfidential: false,
        },
        {
          id: '2',
          patientId: patientId || 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC002',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          eventType: 'DIAGNOSIS',
          title: 'Neurological Assessment',
          description: 'Patient experiencing severe headaches and dizziness',
          diagnosis: 'Migraine with aura',
          treatment: 'Prescribed sumatriptan and preventive medications',
          medications: ['Sumatriptan', 'Propranolol', 'Magnesium'],
          labResults: ['MRI Brain', 'Blood Tests'],
          vitalSigns: {
            bloodPressure: '120/80 mmHg',
            heartRate: '72 bpm',
            temperature: '98.4°F',
            oxygenSaturation: '98%',
          },
          dateCreated: '2024-01-16T14:30:00Z',
          dateUpdated: '2024-01-16T14:30:00Z',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          tags: ['Neurological', 'Headache', 'Migraine'],
          attachments: ['mri_report.pdf'],
          notes: 'Patient to monitor headache frequency and severity',
          isConfidential: false,
        },
        {
          id: '3',
          patientId: patientId || 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC003',
          doctorName: 'Dr. Emily Davis',
          department: 'Dermatology',
          eventType: 'TREATMENT',
          title: 'Skin Condition Treatment',
          description: 'Patient with persistent rash and itching',
          diagnosis: 'Atopic dermatitis',
          treatment: 'Prescribed topical corticosteroids and moisturizers',
          medications: ['Hydrocortisone cream', 'Cetaphil lotion'],
          labResults: ['Skin biopsy'],
          vitalSigns: {
            bloodPressure: '130/85 mmHg',
            heartRate: '78 bpm',
            temperature: '98.8°F',
            oxygenSaturation: '96%',
          },
          dateCreated: '2024-01-17T09:15:00Z',
          dateUpdated: '2024-01-17T09:15:00Z',
          status: 'COMPLETED',
          priority: 'LOW',
          tags: ['Dermatological', 'Skin Condition', 'Allergy'],
          attachments: ['biopsy_report.pdf', 'photos.pdf'],
          notes: 'Patient to apply cream twice daily and avoid triggers',
          isConfidential: false,
        },
        {
          id: '4',
          patientId: patientId || 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          eventType: 'FOLLOW_UP',
          title: 'Cardiac Follow-up',
          description: 'Follow-up appointment after previous consultation',
          diagnosis: 'Stable angina',
          treatment: 'Continued medication and lifestyle recommendations',
          medications: ['Nitroglycerin', 'Aspirin'],
          labResults: ['ECG', 'Stress Test'],
          vitalSigns: {
            bloodPressure: '135/88 mmHg',
            heartRate: '82 bpm',
            temperature: '98.5°F',
            oxygenSaturation: '97%',
          },
          dateCreated: '2024-01-18T11:00:00Z',
          dateUpdated: '2024-01-18T11:00:00Z',
          status: 'PENDING',
          priority: 'MEDIUM',
          tags: ['Cardiac', 'Follow-up', 'Stable'],
          attachments: ['stress_test.pdf'],
          notes: 'Patient showing improvement, continue current treatment',
          isConfidential: true,
        },
        {
          id: '5',
          patientId: patientId || 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC004',
          doctorName: 'Dr. Robert Wilson',
          department: 'Orthopedics',
          eventType: 'SURGERY',
          title: 'Knee Surgery Consultation',
          description: 'Patient with severe knee pain and limited mobility',
          diagnosis: 'Osteoarthritis of the knee',
          treatment: 'Recommended knee replacement surgery',
          medications: ['Ibuprofen', 'Physical therapy'],
          labResults: ['X-Ray', 'MRI Knee'],
          vitalSigns: {
            bloodPressure: '125/82 mmHg',
            heartRate: '75 bpm',
            temperature: '98.7°F',
            oxygenSaturation: '99%',
          },
          dateCreated: '2024-01-19T15:45:00Z',
          dateUpdated: '2024-01-19T15:45:00Z',
          status: 'SCHEDULED',
          priority: 'HIGH',
          tags: ['Orthopedic', 'Surgery', 'Knee'],
          attachments: ['xray_report.pdf', 'mri_knee.pdf'],
          notes: 'Surgery scheduled for next month, pre-op assessment required',
          isConfidential: false,
        },
      ];

      setEvents(mockEvents);
      calculateAnalytics(mockEvents);
    } catch (error) {
      toast.error('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (events: TimelineEvent[]) => {
    const eventsByType: Record<string, number> = {};
    const eventsByDepartment: Record<string, number> = {};
    const eventsByStatus: Record<string, number> = {};
    const eventsByMonth: Record<string, number> = {};

    events.forEach(event => {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      
      // Count by department
      eventsByDepartment[event.department] = (eventsByDepartment[event.department] || 0) + 1;
      
      // Count by status
      eventsByStatus[event.status] = (eventsByStatus[event.status] || 0) + 1;
      
      // Count by month
      const month = new Date(event.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      eventsByMonth[month] = (eventsByMonth[month] || 0) + 1;
    });

    const mostActiveDepartment = Object.entries(eventsByDepartment)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
    const mostCommonEventType = Object.entries(eventsByType)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    setAnalytics({
      totalEvents: events.length,
      eventsByType,
      eventsByDepartment,
      eventsByStatus,
      eventsByMonth,
      averageEventsPerMonth: events.length / Math.max(Object.keys(eventsByMonth).length, 1),
      mostActiveDepartment,
      mostCommonEventType,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'PENDING':
        return 'info';
      case 'SCHEDULED':
        return 'primary';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'primary';
      case 'DIAGNOSIS':
        return 'secondary';
      case 'TREATMENT':
        return 'success';
      case 'FOLLOW_UP':
        return 'info';
      case 'SURGERY':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return <MedicalServices />;
      case 'DIAGNOSIS':
        return <Assessment />;
      case 'TREATMENT':
        return <Medication />;
      case 'FOLLOW_UP':
        return <History />;
      case 'SURGERY':
        return <LocalHospital />;
      default:
        return <Event />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || event.department === departmentFilter;
    const matchesDate = !dateFilter || event.dateCreated.split('T')[0] === dateFilter.toISOString().split('T')[0];
    const matchesConfidential = showConfidential || !event.isConfidential;

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDepartment && matchesDate && matchesConfidential;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        break;
      case 'priority':
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
        break;
      case 'type':
        comparison = a.eventType.localeCompare(b.eventType);
        break;
      case 'department':
        comparison = a.department.localeCompare(b.department);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleViewDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDetailsDialog(true);
  };

  const handleExport = () => {
    toast.success('Timeline exported successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Timeline printed');
  };

  const handleAnalytics = () => {
    setAnalyticsDialog(true);
  };

  return (
    <>
      <Helmet>
        <title>Medical History Timeline - HMS</title>
        <meta name="description" content="View and analyze patient medical history timeline" />
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Medical History Timeline
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Analytics />}
                onClick={handleAnalytics}
              >
                Analytics
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchTimelineEvents}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Events
                  </Typography>
                  <Typography variant="h4">
                    {events.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Timeline events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {events.filter(e => e.status === 'COMPLETED').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Events completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {events.filter(e => e.status === 'PENDING').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Events pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Confidential
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {events.filter(e => e.isConfidential).length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Confidential events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search timeline"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, description, doctor, diagnosis..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={eventTypeFilter}
                      label="Event Type"
                      onChange={(e) => setEventTypeFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="CONSULTATION">Consultation</MenuItem>
                      <MenuItem value="DIAGNOSIS">Diagnosis</MenuItem>
                      <MenuItem value="TREATMENT">Treatment</MenuItem>
                      <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                      <MenuItem value="SURGERY">Surgery</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Priorities</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={departmentFilter}
                      label="Department"
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Departments</MenuItem>
                      <MenuItem value="Cardiology">Cardiology</MenuItem>
                      <MenuItem value="Neurology">Neurology</MenuItem>
                      <MenuItem value="Dermatology">Dermatology</MenuItem>
                      <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Date"
                    value={dateFilter}
                    onChange={setDateFilter}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                      <MenuItem value="type">Event Type</MenuItem>
                      <MenuItem value="department">Department</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Sort Order"
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                      <MenuItem value="desc">Newest First</MenuItem>
                      <MenuItem value="asc">Oldest First</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showConfidential}
                        onChange={(e) => setShowConfidential(e.target.checked)}
                      />
                    }
                    label="Show Confidential Events"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Timeline position="alternate">
                  {sortedEvents.map((event, index) => (
                    <TimelineItem key={event.id}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                        {new Date(event.dateCreated).toLocaleDateString()}
                        <br />
                        {new Date(event.dateCreated).toLocaleTimeString()}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getEventTypeColor(event.eventType) as any}>
                          {getEventTypeIcon(event.eventType)}
                        </TimelineDot>
                        {index < sortedEvents.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="span">
                                {event.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                  label={event.eventType.replace('_', ' ')}
                                  color={getEventTypeColor(event.eventType) as any}
                                  size="small"
                                />
                                <Chip
                                  label={event.status.replace('_', ' ')}
                                  color={getStatusColor(event.status) as any}
                                  size="small"
                                />
                                <Chip
                                  label={event.priority}
                                  color={getPriorityColor(event.priority) as any}
                                  size="small"
                                />
                                {event.isConfidential && (
                                  <Chip
                                    label="Confidential"
                                    color="error"
                                    size="small"
                                    icon={<Security />}
                                  />
                                )}
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {event.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                {event.doctorName} • {event.department}
                              </Typography>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(event)}
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
              )}
            </CardContent>
          </Card>

          {/* Event Details Dialog */}
          <Dialog
            open={detailsDialog}
            onClose={() => setDetailsDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Event Details
            </DialogTitle>
            <DialogContent>
              {selectedEvent && (
                <Box>
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                    <Tab label="Overview" />
                    <Tab label="Treatment" />
                    <Tab label="Vitals" />
                    <Tab label="Attachments" />
                  </Tabs>

                  {activeTab === 0 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Event Information</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Event /></ListItemIcon>
                            <ListItemText primary="Type" secondary={selectedEvent.eventType.replace('_', ' ')} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CalendarToday /></ListItemIcon>
                            <ListItemText primary="Created" secondary={new Date(selectedEvent.dateCreated).toLocaleDateString()} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Status /></ListItemIcon>
                            <ListItemText primary="Status" secondary={selectedEvent.status.replace('_', ' ')} />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Medical Team</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Patient" secondary={selectedEvent.patientName} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><MedicalServices /></ListItemIcon>
                            <ListItemText primary="Doctor" secondary={selectedEvent.doctorName} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><LocationOn /></ListItemIcon>
                            <ListItemText primary="Department" secondary={selectedEvent.department} />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedEvent.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 1 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Diagnosis</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedEvent.diagnosis || 'No diagnosis recorded'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Treatment</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedEvent.treatment || 'No treatment recorded'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Medications</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedEvent.medications?.map((med, index) => (
                            <Chip key={index} label={med} size="small" />
                          )) || <Typography variant="body2" color="text.secondary">No medications recorded</Typography>}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Lab Results</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedEvent.labResults?.map((lab, index) => (
                            <Chip key={index} label={lab} size="small" variant="outlined" />
                          )) || <Typography variant="body2" color="text.secondary">No lab results recorded</Typography>}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 2 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Vital Signs</Typography>
                        {selectedEvent.vitalSigns ? (
                          <List dense>
                            <ListItem>
                              <ListItemText primary="Blood Pressure" secondary={selectedEvent.vitalSigns.bloodPressure} />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary="Heart Rate" secondary={selectedEvent.vitalSigns.heartRate} />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary="Temperature" secondary={selectedEvent.vitalSigns.temperature} />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary="Oxygen Saturation" secondary={selectedEvent.vitalSigns.oxygenSaturation} />
                            </ListItem>
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">No vital signs recorded</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Tags</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedEvent.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" color="primary" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 3 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Attachments</Typography>
                        <List dense>
                          {selectedEvent.attachments.map((attachment, index) => (
                            <ListItem key={index}>
                              <ListItemIcon><FileCopy /></ListItemIcon>
                              <ListItemText primary={attachment} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Notes</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedEvent.notes || 'No notes recorded'}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Analytics Dialog */}
          <Dialog
            open={analyticsDialog}
            onClose={() => setAnalyticsDialog(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Timeline Analytics
            </DialogTitle>
            <DialogContent>
              {analytics && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Event Distribution by Type</Typography>
                        <List dense>
                          {Object.entries(analytics.eventsByType).map(([type, count]) => (
                            <ListItem key={type}>
                              <ListItemText 
                                primary={type.replace('_', ' ')} 
                                secondary={`${count} events (${((count / analytics.totalEvents) * 100).toFixed(1)}%)`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Event Distribution by Department</Typography>
                        <List dense>
                          {Object.entries(analytics.eventsByDepartment).map(([dept, count]) => (
                            <ListItem key={dept}>
                              <ListItemText 
                                primary={dept} 
                                secondary={`${count} events (${((count / analytics.totalEvents) * 100).toFixed(1)}%)`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Event Distribution by Status</Typography>
                        <List dense>
                          {Object.entries(analytics.eventsByStatus).map(([status, count]) => (
                            <ListItem key={status}>
                              <ListItemText 
                                primary={status.replace('_', ' ')} 
                                secondary={`${count} events (${((count / analytics.totalEvents) * 100).toFixed(1)}%)`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Summary Statistics</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Total Events" 
                              secondary={analytics.totalEvents}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Average Events per Month" 
                              secondary={analytics.averageEventsPerMonth.toFixed(1)}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Most Active Department" 
                              secondary={analytics.mostActiveDepartment}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Most Common Event Type" 
                              secondary={analytics.mostCommonEventType.replace('_', ' ')}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAnalyticsDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
};

export default MedicalHistoryTimelinePage; 