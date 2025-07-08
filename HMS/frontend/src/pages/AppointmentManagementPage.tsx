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
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Visibility,
  Schedule,
  CheckCircle,
  Cancel,
  Warning,
  Refresh,
  Download,
  Print,
  MoreVert,
  CalendarToday,
  AccessTime,
  Person,
  MedicalServices,
  LocationOn,
  Description,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

const AppointmentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showCancelled, setShowCancelled] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientId: 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: '2024-02-15',
          time: '10:00 AM',
          type: 'CONSULTATION',
          status: 'SCHEDULED',
          reason: 'Annual physical examination',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          patientId: 'PAT002',
          patientName: 'Jane Smith',
          doctorId: 'DOC002',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          date: '2024-02-16',
          time: '02:30 PM',
          type: 'FOLLOW_UP',
          status: 'CONFIRMED',
          reason: 'Follow-up consultation',
          createdAt: '2024-01-16T14:30:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
        },
        {
          id: '3',
          patientId: 'PAT003',
          patientName: 'Bob Wilson',
          doctorId: 'DOC003',
          doctorName: 'Dr. Emily Davis',
          department: 'Dermatology',
          date: '2024-02-14',
          time: '11:00 AM',
          type: 'LAB_TEST',
          status: 'COMPLETED',
          reason: 'Blood work and skin examination',
          createdAt: '2024-01-14T09:00:00Z',
          updatedAt: '2024-01-14T11:30:00Z',
        },
        {
          id: '4',
          patientId: 'PAT004',
          patientName: 'Alice Brown',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: '2024-02-17',
          time: '09:00 AM',
          type: 'EMERGENCY',
          status: 'CANCELLED',
          reason: 'Chest pain evaluation',
          createdAt: '2024-01-17T08:00:00Z',
          updatedAt: '2024-01-17T08:30:00Z',
        },
        {
          id: '5',
          patientId: 'PAT005',
          patientName: 'Charlie Davis',
          doctorId: 'DOC004',
          doctorName: 'Dr. Robert Wilson',
          department: 'Orthopedics',
          date: '2024-02-18',
          time: '03:00 PM',
          type: 'PHYSICAL_EXAMINATION',
          status: 'SCHEDULED',
          reason: 'Knee injury evaluation',
          createdAt: '2024-01-18T15:00:00Z',
          updatedAt: '2024-01-18T15:00:00Z',
        },
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'info';
      case 'CONFIRMED':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'CANCELLED':
        return 'error';
      case 'NO_SHOW':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Schedule />;
      case 'CONFIRMED':
        return <CheckCircle />;
      case 'COMPLETED':
        return <CheckCircle />;
      case 'CANCELLED':
        return <Cancel />;
      case 'NO_SHOW':
        return <Warning />;
      default:
        return <Schedule />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'primary';
      case 'FOLLOW_UP':
        return 'info';
      case 'LAB_TEST':
        return 'secondary';
      case 'PHYSICAL_EXAMINATION':
        return 'success';
      case 'EMERGENCY':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    const matchesDate = !dateFilter || appointment.date === dateFilter.toISOString().split('T')[0];
    const matchesCancelled = showCancelled || appointment.status !== 'CANCELLED';

    return matchesSearch && matchesStatus && matchesType && matchesDate && matchesCancelled;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleTypeFilter = (event: any) => {
    setTypeFilter(event.target.value);
    setPage(1);
  };

  const handleDateFilter = (date: Date | null) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedAppointments(paginatedAppointments.map(app => app.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId: string) => {
    setSelectedAppointments(prev => 
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialog(true);
  };

  const handleEdit = (appointment: Appointment) => {
    navigate(`/appointments/${appointment.id}/edit`);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialog(true);
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => prev.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: 'CANCELLED', updatedAt: new Date().toISOString() }
          : app
      ));
      
      toast.success('Appointment cancelled successfully');
      setCancelDialog(false);
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select appointments first');
      return;
    }

    switch (action) {
      case 'confirm':
        toast.success(`${selectedAppointments.length} appointments confirmed`);
        break;
      case 'cancel':
        toast.success(`${selectedAppointments.length} appointments cancelled`);
        break;
      case 'export':
        toast.success('Appointments exported successfully');
        break;
      default:
        toast.info(`Bulk action: ${action}`);
    }
  };

  const handleExport = () => {
    toast.success('Appointments exported successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Appointments printed');
  };

  return (
    <>
      <Helmet>
        <title>Appointment Management - HMS</title>
        <meta name="description" content="Manage appointments, search, filter, and update status" />
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Appointment Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchAppointments}
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
                onClick={() => navigate('/appointments/schedule')}
              >
                New Appointment
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search patients, doctors, departments..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={handleStatusFilter}>
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      <MenuItem value="NO_SHOW">No Show</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={typeFilter} label="Type" onChange={handleTypeFilter}>
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="CONSULTATION">Consultation</MenuItem>
                      <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                      <MenuItem value="LAB_TEST">Lab Test</MenuItem>
                      <MenuItem value="PHYSICAL_EXAMINATION">Physical Exam</MenuItem>
                      <MenuItem value="EMERGENCY">Emergency</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    label="Date"
                    value={dateFilter}
                    onChange={handleDateFilter}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showCancelled}
                        onChange={(e) => setShowCancelled(e.target.checked)}
                      />
                    }
                    label="Show Cancelled"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedAppointments.length > 0 && (
            <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" color="primary.contrastText">
                    {selectedAppointments.length} appointment(s) selected
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleBulkAction('confirm')}
                    >
                      Confirm All
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleBulkAction('cancel')}
                    >
                      Cancel All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleBulkAction('export')}
                    >
                      Export Selected
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Appointments Table */}
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
                          <TableCell padding="checkbox">
                            <input
                              type="checkbox"
                              checked={selectedAppointments.length === paginatedAppointments.length}
                              onChange={handleSelectAll}
                            />
                          </TableCell>
                          <TableCell>Patient</TableCell>
                          <TableCell>Doctor</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedAppointments.map((appointment) => (
                          <TableRow key={appointment.id} hover>
                            <TableCell padding="checkbox">
                              <input
                                type="checkbox"
                                checked={selectedAppointments.includes(appointment.id)}
                                onChange={() => handleSelectAppointment(appointment.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {appointment.patientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {appointment.patientId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {appointment.doctorName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={appointment.department}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {new Date(appointment.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {appointment.time}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={appointment.type.replace('_', ' ')}
                                color={getTypeColor(appointment.type) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(appointment.status)}
                                label={appointment.status}
                                color={getStatusColor(appointment.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(appointment)}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(appointment)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reschedule">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleReschedule(appointment)}
                                  >
                                    <Schedule />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancel(appointment)}
                                  >
                                    <Cancel />
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
                      count={Math.ceil(filteredAppointments.length / rowsPerPage)}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Appointment Details Dialog */}
          <Dialog
            open={detailsDialog}
            onClose={() => setDetailsDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Appointment Details
            </DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Patient"
                      secondary={selectedAppointment.patientName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MedicalServices />
                    </ListItemIcon>
                    <ListItemText
                      primary="Doctor"
                      secondary={selectedAppointment.doctorName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Department"
                      secondary={selectedAppointment.department}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date"
                      secondary={new Date(selectedAppointment.date).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary="Time"
                      secondary={selectedAppointment.time}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reason"
                      secondary={selectedAppointment.reason}
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

          {/* Cancel Confirmation Dialog */}
          <Dialog
            open={cancelDialog}
            onClose={() => setCancelDialog(false)}
          >
            <DialogTitle>
              Cancel Appointment
            </DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </Alert>
              {selectedAppointment && (
                <Typography>
                  Cancel appointment for <strong>{selectedAppointment.patientName}</strong> with{' '}
                  <strong>{selectedAppointment.doctorName}</strong> on{' '}
                  <strong>{new Date(selectedAppointment.date).toLocaleDateString()}</strong>?
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCancelDialog(false)}>
                No, Keep It
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmCancel}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Yes, Cancel'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Reschedule Dialog */}
          <Dialog
            open={rescheduleDialog}
            onClose={() => setRescheduleDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Reschedule Appointment
            </DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                Redirecting to appointment scheduling page for rescheduling...
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRescheduleDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setRescheduleDialog(false);
                  navigate('/appointments/schedule');
                }}
              >
                Go to Scheduling
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
};

export default AppointmentManagementPage; 