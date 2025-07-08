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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  Visibility,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Download,
  Print,
  MoreVert,
  CalendarToday,
  AccessTime,
  Person,
  MedicalServices,
  LocationOn,
  Timeline,
  Analytics,
  Optimization,
  Conflict,
  Available,
  Busy,
  Break,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  location: string;
  maxPatients: number;
  currentPatients: number;
  conflicts: string[];
  notes: string;
}

interface ScheduleConflict {
  id: string;
  type: string;
  severity: string;
  description: string;
  affectedDoctors: string[];
  suggestedResolution: string;
}

const DoctorScheduleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showConflicts, setShowConflicts] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  [detailsDialog, setDetailsDialog] = useState(false);
  [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  [optimizationDialog, setOptimizationDialog] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchConflicts();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSchedules: DoctorSchedule[] = [
        {
          id: '1',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: '2024-02-15',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          status: 'AVAILABLE',
          type: 'REGULAR',
          location: 'Cardiology Clinic - Room 101',
          maxPatients: 20,
          currentPatients: 8,
          conflicts: [],
          notes: 'Regular consultation hours',
        },
        {
          id: '2',
          doctorId: 'DOC002',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          date: '2024-02-15',
          startTime: '10:00 AM',
          endTime: '06:00 PM',
          status: 'BUSY',
          type: 'REGULAR',
          location: 'Neurology Clinic - Room 205',
          maxPatients: 15,
          currentPatients: 15,
          conflicts: [],
          notes: 'Full schedule - no new appointments',
        },
        {
          id: '3',
          doctorId: 'DOC003',
          doctorName: 'Dr. Emily Davis',
          department: 'Dermatology',
          date: '2024-02-15',
          startTime: '08:00 AM',
          endTime: '04:00 PM',
          status: 'CONFLICT',
          type: 'REGULAR',
          location: 'Dermatology Clinic - Room 301',
          maxPatients: 25,
          currentPatients: 12,
          conflicts: ['Overlapping with Dr. Wilson'],
          notes: 'Schedule conflict detected',
        },
        {
          id: '4',
          doctorId: 'DOC004',
          doctorName: 'Dr. Robert Wilson',
          department: 'Orthopedics',
          date: '2024-02-15',
          startTime: '09:30 AM',
          endTime: '05:30 PM',
          status: 'BREAK',
          type: 'REGULAR',
          location: 'Orthopedics Clinic - Room 401',
          maxPatients: 18,
          currentPatients: 0,
          conflicts: [],
          notes: 'Lunch break 12:00-01:00 PM',
        },
        {
          id: '5',
          doctorId: 'DOC005',
          doctorName: 'Dr. Lisa Anderson',
          department: 'General Medicine',
          date: '2024-02-15',
          startTime: '11:00 AM',
          endTime: '07:00 PM',
          status: 'AVAILABLE',
          type: 'EXTENDED',
          location: 'General Medicine - Room 501',
          maxPatients: 30,
          currentPatients: 5,
          conflicts: [],
          notes: 'Extended hours for urgent care',
        },
      ];

      setSchedules(mockSchedules);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchConflicts = async () => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockConflicts: ScheduleConflict[] = [
        {
          id: '1',
          type: 'OVERLAP',
          severity: 'HIGH',
          description: 'Dr. Emily Davis and Dr. Robert Wilson have overlapping schedules',
          affectedDoctors: ['Dr. Emily Davis', 'Dr. Robert Wilson'],
          suggestedResolution: 'Reschedule Dr. Wilson to start at 10:00 AM',
        },
        {
          id: '2',
          type: 'RESOURCE_CONFLICT',
          severity: 'MEDIUM',
          description: 'Multiple doctors assigned to same examination room',
          affectedDoctors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
          suggestedResolution: 'Assign Dr. Chen to Room 102',
        },
        {
          id: '3',
          type: 'CAPACITY_OVERFLOW',
          severity: 'LOW',
          description: 'Dr. Michael Chen has exceeded patient capacity',
          affectedDoctors: ['Dr. Michael Chen'],
          suggestedResolution: 'Increase max patients or add another doctor',
        },
      ];

      setConflicts(mockConflicts);
    } catch (error) {
      toast.error('Failed to load conflicts');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'BUSY':
        return 'warning';
      case 'CONFLICT':
        return 'error';
      case 'BREAK':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Available />;
      case 'BUSY':
        return <Busy />;
      case 'CONFLICT':
        return <Conflict />;
      case 'BREAK':
        return <Break />;
      default:
        return <Schedule />;
    }
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDoctor = selectedDoctor === 'all' || schedule.doctorId === selectedDoctor;
    const matchesDepartment = selectedDepartment === 'all' || schedule.department === selectedDepartment;
    const matchesDate = !selectedDate || schedule.date === selectedDate.toISOString().split('T')[0];
    const matchesStatus = selectedStatus === 'all' || schedule.status === selectedStatus;
    const matchesConflicts = !showConflicts || schedule.conflicts.length > 0;

    return matchesDoctor && matchesDepartment && matchesDate && matchesStatus && matchesConflicts;
  });

  const paginatedSchedules = filteredSchedules.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleViewDetails = (schedule: DoctorSchedule) => {
    setSelectedSchedule(schedule);
    setDetailsDialog(true);
  };

  const handleEdit = (schedule: DoctorSchedule) => {
    navigate(`/schedules/${schedule.id}/edit`);
  };

  const handleOptimize = () => {
    setOptimizationDialog(true);
  };

  const handleExport = () => {
    toast.success('Schedule exported successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Schedule printed');
  };

  const getUtilizationRate = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getOptimizationSuggestions = () => {
    const suggestions = [
      'Reschedule Dr. Wilson to avoid overlap with Dr. Davis',
      'Assign additional doctors to high-demand departments',
      'Extend clinic hours for busy departments',
      'Implement staggered break times to maintain coverage',
    ];
    return suggestions;
  };

  return (
    <>
      <Helmet>
        <title>Doctor Schedule Management - HMS</title>
        <meta name="description" content="Manage doctor schedules, detect conflicts, and optimize resource allocation" />
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Doctor Schedule Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchSchedules}
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
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/schedules/create')}
              >
                New Schedule
              </Button>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Doctors
                  </Typography>
                  <Typography variant="h4">
                    {schedules.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Scheduled today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Available Slots
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {schedules.filter(s => s.status === 'AVAILABLE').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Open for appointments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Conflicts
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {conflicts.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Require resolution
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Utilization Rate
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {Math.round(schedules.reduce((acc, s) => acc + getUtilizationRate(s.currentPatients, s.maxPatients), 0) / schedules.length)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average capacity usage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline />
                Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      value={selectedDoctor}
                      label="Doctor"
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <MenuItem value="all">All Doctors</MenuItem>
                      <MenuItem value="DOC001">Dr. Sarah Johnson</MenuItem>
                      <MenuItem value="DOC002">Dr. Michael Chen</MenuItem>
                      <MenuItem value="DOC003">Dr. Emily Davis</MenuItem>
                      <MenuItem value="DOC004">Dr. Robert Wilson</MenuItem>
                      <MenuItem value="DOC005">Dr. Lisa Anderson</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={selectedDepartment}
                      label="Department"
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <MenuItem value="all">All Departments</MenuItem>
                      <MenuItem value="Cardiology">Cardiology</MenuItem>
                      <MenuItem value="Neurology">Neurology</MenuItem>
                      <MenuItem value="Dermatology">Dermatology</MenuItem>
                      <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                      <MenuItem value="General Medicine">General Medicine</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedStatus}
                      label="Status"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="AVAILABLE">Available</MenuItem>
                      <MenuItem value="BUSY">Busy</MenuItem>
                      <MenuItem value="CONFLICT">Conflict</MenuItem>
                      <MenuItem value="BREAK">Break</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showConflicts}
                        onChange={(e) => setShowConflicts(e.target.checked)}
                      />
                    }
                    label="Show Only Conflicts"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Conflicts Alert */}
          {conflicts.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Schedule Conflicts Detected
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {conflicts.length} conflict(s) found. Review and resolve to optimize schedule.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Optimization />}
                onClick={handleOptimize}
              >
                View Optimization Suggestions
              </Button>
            </Alert>
          )}

          {/* Schedules Table */}
          <Card>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Doctor</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Utilization</TableCell>
                          <TableCell>Conflicts</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedSchedules.map((schedule) => (
                          <TableRow key={schedule.id} hover>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {schedule.doctorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {schedule.doctorId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={schedule.department}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {new Date(schedule.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {schedule.startTime} - {schedule.endTime}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {schedule.location}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(schedule.status)}
                                label={schedule.status}
                                color={getStatusColor(schedule.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                  {schedule.currentPatients}/{schedule.maxPatients}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={getUtilizationRate(schedule.currentPatients, schedule.maxPatients)}
                                  sx={{ width: 60, height: 6 }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              {schedule.conflicts.length > 0 ? (
                                <Chip
                                  label={`${schedule.conflicts.length} conflict(s)`}
                                  color="error"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="No conflicts"
                                  color="success"
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(schedule)}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Schedule">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(schedule)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(filteredSchedules.length / rowsPerPage)}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Schedule Details Dialog */}
          <Dialog
            open={detailsDialog}
            onClose={() => setDetailsDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Schedule Details
            </DialogTitle>
            <DialogContent>
              {selectedSchedule && (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Doctor"
                      secondary={selectedSchedule.doctorName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MedicalServices />
                    </ListItemIcon>
                    <ListItemText
                      primary="Department"
                      secondary={selectedSchedule.department}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date"
                      secondary={new Date(selectedSchedule.date).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary="Time"
                      secondary={`${selectedSchedule.startTime} - ${selectedSchedule.endTime}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={selectedSchedule.location}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText
                      primary="Utilization"
                      secondary={`${selectedSchedule.currentPatients}/${selectedSchedule.maxPatients} patients (${getUtilizationRate(selectedSchedule.currentPatients, selectedSchedule.maxPatients)}%)`}
                    />
                  </ListItem>
                  {selectedSchedule.conflicts.length > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Conflicts"
                        secondary={selectedSchedule.conflicts.join(', ')}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <Timeline />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notes"
                      secondary={selectedSchedule.notes}
                    />
                  </ListItem>
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Optimization Dialog */}
          <Dialog
            open={optimizationDialog}
            onClose={() => setOptimizationDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Optimization />
                Schedule Optimization
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Detected Conflicts
              </Typography>
              <List>
                {conflicts.map((conflict) => (
                  <ListItem key={conflict.id}>
                    <ListItemIcon>
                      <Chip
                        label={conflict.severity}
                        color={getConflictSeverityColor(conflict.severity) as any}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={conflict.description}
                      secondary={`Affected: ${conflict.affectedDoctors.join(', ')}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Optimization Suggestions
              </Typography>
              <List>
                {getOptimizationSuggestions().map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  These suggestions are based on current schedule analysis and can help improve resource utilization and reduce conflicts.
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOptimizationDialog(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOptimizationDialog(false);
                  toast.success('Optimization applied successfully');
                }}
              >
                Apply Suggestions
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
};

export default DoctorScheduleManagementPage; 