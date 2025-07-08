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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Visibility,
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
  Priority,
  Status,
  FileCopy,
  History,
  Security,
  Verified,
  Pending,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  recordType: string;
  title: string;
  description: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  labResults: string[];
  vitalSigns: {
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
}

const MedicalRecordsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patientId: 'PAT001',
          patientName: 'John Doe',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          recordType: 'CONSULTATION',
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
        },
        {
          id: '2',
          patientId: 'PAT002',
          patientName: 'Jane Smith',
          doctorId: 'DOC002',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          recordType: 'DIAGNOSIS',
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
        },
        {
          id: '3',
          patientId: 'PAT003',
          patientName: 'Bob Wilson',
          doctorId: 'DOC003',
          doctorName: 'Dr. Emily Davis',
          department: 'Dermatology',
          recordType: 'TREATMENT',
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
        },
        {
          id: '4',
          patientId: 'PAT004',
          patientName: 'Alice Brown',
          doctorId: 'DOC001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          recordType: 'FOLLOW_UP',
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
        },
        {
          id: '5',
          patientId: 'PAT005',
          patientName: 'Charlie Davis',
          doctorId: 'DOC004',
          doctorName: 'Dr. Robert Wilson',
          department: 'Orthopedics',
          recordType: 'SURGERY',
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
        },
      ];

      setRecords(mockRecords);
    } catch (error) {
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
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

  const getRecordTypeColor = (type: string) => {
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = recordTypeFilter === 'all' || record.recordType === recordTypeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    const matchesDate = !dateFilter || record.dateCreated.split('T')[0] === dateFilter.toISOString().split('T')[0];

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDepartment && matchesDate;
  });

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDetailsDialog(true);
  };

  const handleEdit = (record: MedicalRecord) => {
    navigate(`/medical-records/${record.id}/edit`);
  };

  const handleDelete = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecords(prev => prev.filter(record => record.id !== selectedRecord.id));
      toast.success('Medical record deleted successfully');
      setDeleteDialog(false);
      setSelectedRecord(null);
    } catch (error) {
      toast.error('Failed to delete medical record');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Medical records exported successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Medical records printed');
  };

  const handleBulkAction = (action: string) => {
    if (selectedRecords.length === 0) {
      toast.error('Please select records first');
      return;
    }

    switch (action) {
      case 'export':
        toast.success(`${selectedRecords.length} records exported`);
        break;
      case 'delete':
        toast.success(`${selectedRecords.length} records deleted`);
        break;
      default:
        toast.info(`Bulk action: ${action}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Medical Records Management - HMS</title>
        <meta name="description" content="Manage medical records, search, filter, and export patient data" />
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Medical Records Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchMedicalRecords}
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
                onClick={() => navigate('/medical-records/create')}
              >
                New Record
              </Button>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Records
                  </Typography>
                  <Typography variant="h4">
                    {records.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Medical records
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
                    {records.filter(r => r.status === 'COMPLETED').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Records completed
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
                    {records.filter(r => r.status === 'PENDING').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Records pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    High Priority
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {records.filter(r => r.priority === 'HIGH').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    High priority records
                  </Typography>
                </CardContent>
              </Card>
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
                    label="Search records"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by patient, doctor, title, diagnosis..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Record Type</InputLabel>
                    <Select
                      value={recordTypeFilter}
                      label="Record Type"
                      onChange={(e) => setRecordTypeFilter(e.target.value)}
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
              </Grid>
            </CardContent>
          </Card>

          {/* Records Table */}
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
                          <TableCell>Patient</TableCell>
                          <TableCell>Doctor</TableCell>
                          <TableCell>Record Type</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Diagnosis</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedRecords.map((record) => (
                          <TableRow key={record.id} hover>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {record.patientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {record.patientId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {record.doctorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.department}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={record.recordType.replace('_', ' ')}
                                color={getRecordTypeColor(record.recordType) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {record.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {record.diagnosis}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={record.status.replace('_', ' ')}
                                color={getStatusColor(record.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={record.priority}
                                color={getPriorityColor(record.priority) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(record.dateCreated).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(record)}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Record">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(record)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Record">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(record)}
                                  >
                                    <Delete />
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
                      count={Math.ceil(filteredRecords.length / rowsPerPage)}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Record Details Dialog */}
          <Dialog
            open={detailsDialog}
            onClose={() => setDetailsDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Medical Record Details
            </DialogTitle>
            <DialogContent>
              {selectedRecord && (
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
                        <Typography variant="h6" gutterBottom>Patient Information</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Patient" secondary={selectedRecord.patientName} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><MedicalServices /></ListItemIcon>
                            <ListItemText primary="Doctor" secondary={selectedRecord.doctorName} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><LocationOn /></ListItemIcon>
                            <ListItemText primary="Department" secondary={selectedRecord.department} />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Record Information</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Description /></ListItemIcon>
                            <ListItemText primary="Type" secondary={selectedRecord.recordType.replace('_', ' ')} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CalendarToday /></ListItemIcon>
                            <ListItemText primary="Created" secondary={new Date(selectedRecord.dateCreated).toLocaleDateString()} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Status /></ListItemIcon>
                            <ListItemText primary="Status" secondary={selectedRecord.status.replace('_', ' ')} />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedRecord.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 1 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Diagnosis</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedRecord.diagnosis}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Treatment</Typography>
                        <Typography variant="body2" paragraph>
                          {selectedRecord.treatment}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Medications</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedRecord.medications.map((med, index) => (
                            <Chip key={index} label={med} size="small" />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Lab Results</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedRecord.labResults.map((lab, index) => (
                            <Chip key={index} label={lab} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 2 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Vital Signs</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Blood Pressure" secondary={selectedRecord.vitalSigns.bloodPressure} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Heart Rate" secondary={selectedRecord.vitalSigns.heartRate} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Temperature" secondary={selectedRecord.vitalSigns.temperature} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Oxygen Saturation" secondary={selectedRecord.vitalSigns.oxygenSaturation} />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Tags</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedRecord.tags.map((tag, index) => (
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
                          {selectedRecord.attachments.map((attachment, index) => (
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
                          {selectedRecord.notes}
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

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
          >
            <DialogTitle>
              Delete Medical Record
            </DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Are you sure you want to delete this medical record? This action cannot be undone.
              </Alert>
              {selectedRecord && (
                <Typography>
                  Delete medical record for <strong>{selectedRecord.patientName}</strong> with title{' '}
                  <strong>{selectedRecord.title}</strong>?
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </>
  );
};

export default MedicalRecordsManagementPage; 