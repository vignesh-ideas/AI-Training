import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Fab,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Avatar,
  CardMedia,
  CardActions,
  CardActionArea,
  Pagination,
  Autocomplete,
  Checkbox,
  FormGroup,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Send as SendIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Assessment as AssessmentIcon,
  LocalHospital as LocalHospitalIcon,
  Medication as MedicationIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CloudUpload as CloudUploadIcon,
  FileCopy as FileCopyIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  RestoreFromTrash as RestoreIcon,
  GetApp as GetAppIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon2,
  LocalPharmacy as PharmacyIcon,
  Receipt as ReceiptIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  ScheduleSend as ScheduleSendIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medications: Medication[];
  diagnosis: string;
  status: 'draft' | 'active' | 'filled' | 'expired' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  prescribedDate: Date;
  expiryDate: Date;
  filledDate?: Date;
  pharmacyId?: string;
  pharmacyName?: string;
  notes: string;
  isDigital: boolean;
  refills: number;
  refillsRemaining: number;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewDate?: Date;
  signature?: string;
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  unit: string;
  route: string;
  warnings: string[];
  interactions: string[];
  sideEffects: string[];
  isControlled: boolean;
  requiresPriorAuth: boolean;
  cost: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isPreferred: boolean;
  isOpen: boolean;
  hours: string;
}

const PrescriptionManagementPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showFillDialog, setShowFillDialog] = useState<boolean>(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockMedications: Medication[] = [
      {
        id: '1',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with or without food',
        quantity: 30,
        unit: 'tablets',
        route: 'Oral',
        warnings: ['May cause dizziness', 'Avoid alcohol'],
        interactions: ['NSAIDs', 'Lithium'],
        sideEffects: ['Dry cough', 'Dizziness', 'Fatigue'],
        isControlled: false,
        requiresPriorAuth: false,
        cost: 15.00
      },
      {
        id: '2',
        name: 'Metformin',
        genericName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take with meals',
        quantity: 60,
        unit: 'tablets',
        route: 'Oral',
        warnings: ['May cause GI upset', 'Monitor blood sugar'],
        interactions: ['Alcohol', 'Contrast agents'],
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
        isControlled: false,
        requiresPriorAuth: false,
        cost: 8.50
      }
    ];

    const mockPrescriptions: Prescription[] = [
      {
        id: '1',
        patientId: 'P001',
        patientName: 'John Doe',
        doctorId: 'D001',
        doctorName: 'Dr. Smith',
        medications: [mockMedications[0]],
        diagnosis: 'Hypertension',
        status: 'active',
        priority: 'medium',
        prescribedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23),
        notes: 'Monitor blood pressure regularly',
        isDigital: true,
        refills: 3,
        refillsRemaining: 2,
        isReviewed: true,
        reviewedBy: 'Dr. Smith',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6)
      },
      {
        id: '2',
        patientId: 'P001',
        patientName: 'John Doe',
        doctorId: 'D001',
        doctorName: 'Dr. Smith',
        medications: [mockMedications[1]],
        diagnosis: 'Type 2 Diabetes',
        status: 'filled',
        priority: 'high',
        prescribedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
        filledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
        pharmacyId: 'PH001',
        pharmacyName: 'CVS Pharmacy',
        notes: 'Monitor blood glucose levels',
        isDigital: true,
        refills: 2,
        refillsRemaining: 1,
        isReviewed: true,
        reviewedBy: 'Dr. Smith',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13)
      }
    ];

    const mockPharmacies: Pharmacy[] = [
      {
        id: 'PH001',
        name: 'CVS Pharmacy',
        address: '123 Main St, City, State 12345',
        phone: '(555) 123-4567',
        email: 'cvs@example.com',
        isPreferred: true,
        isOpen: true,
        hours: '24/7'
      },
      {
        id: 'PH002',
        name: 'Walgreens',
        address: '456 Oak Ave, City, State 12345',
        phone: '(555) 987-6543',
        email: 'walgreens@example.com',
        isPreferred: false,
        isOpen: true,
        hours: '7AM-10PM'
      }
    ];

    setPrescriptions(mockPrescriptions);
    setMedications(mockMedications);
    setPharmacies(mockPharmacies);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'active': return 'success';
      case 'filled': return 'info';
      case 'expired': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'filled':
        return <VerifiedIcon color="info" />;
      case 'expired':
        return <ErrorIcon color="error" />;
      case 'cancelled':
        return <CancelIcon color="error" />;
      case 'draft':
        return <PendingIcon color="warning" />;
      default:
        return <PendingIcon />;
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || prescription.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime();
        break;
      case 'patient':
        comparison = a.patientName.localeCompare(b.patientName);
        break;
      case 'doctor':
        comparison = a.doctorName.localeCompare(b.doctorName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const paginatedPrescriptions = sortedPrescriptions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleCreatePrescription = () => {
    setShowCreateDialog(true);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowViewDialog(true);
  };

  const handleFillPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowFillDialog(true);
  };

  const handleSendPrescription = (prescriptionId: string) => {
    setSnackbar({
      open: true,
      message: 'Prescription sent to pharmacy successfully',
      severity: 'success'
    });
  };

  const handleCancelPrescription = (prescriptionId: string) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status: 'cancelled' }
        : prescription
    ));
    setSnackbar({
      open: true,
      message: 'Prescription cancelled successfully',
      severity: 'success'
    });
  };

  const handleRefillPrescription = (prescriptionId: string) => {
    setSnackbar({
      open: true,
      message: 'Refill request sent successfully',
      severity: 'success'
    });
  };

  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const expiredPrescriptions = prescriptions.filter(p => p.status === 'expired');
  const pendingRefills = prescriptions.filter(p => p.refillsRemaining > 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedicationIcon color="primary" />
          Prescription Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePrescription}
          >
            New Prescription
          </Button>
          <Button
            variant="outlined"
            startIcon={<SendIcon />}
          >
            Send to Pharmacy
          </Button>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerts */}
      {(expiredPrescriptions.length > 0 || pendingRefills.length > 0) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              View All
            </Button>
          }
        >
          {expiredPrescriptions.length > 0 
            ? `${expiredPrescriptions.length} expired prescription(s)`
            : `${pendingRefills.length} prescription(s) need refills`
          }
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {prescriptions.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Prescriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {activePrescriptions.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Prescriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {pendingRefills.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pending Refills
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {expiredPrescriptions.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Expired Prescriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="filled">Filled</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Prescriptions Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Prescriptions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PrintIcon />}
                  >
                    Print
                  </Button>
                </Box>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Medications</TableCell>
                      <TableCell>Diagnosis</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Refills</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {prescription.patientName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {prescription.patientId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {prescription.doctorName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            {prescription.medications.map((med, index) => (
                              <Typography key={index} variant="body2">
                                {med.name} {med.dosage}
                              </Typography>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {prescription.diagnosis}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(prescription.status)}
                            <Chip 
                              label={prescription.status} 
                              size="small" 
                              color={getStatusColor(prescription.status) as any}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={prescription.priority} 
                            size="small" 
                            color={getPriorityColor(prescription.priority) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {prescription.expiryDate.toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {Math.ceil((prescription.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {prescription.refillsRemaining}/{prescription.refills}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={() => handleViewPrescription(prescription)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Send to Pharmacy">
                              <IconButton 
                                size="small"
                                onClick={() => handleSendPrescription(prescription.id)}
                              >
                                <SendIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Fill Prescription">
                              <IconButton 
                                size="small"
                                onClick={() => handleFillPrescription(prescription)}
                              >
                                <PharmacyIcon />
                              </IconButton>
                            </Tooltip>
                            {prescription.refillsRemaining > 0 && (
                              <Tooltip title="Request Refill">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleRefillPrescription(prescription.id)}
                                >
                                  <RefreshIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Cancel Prescription">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleCancelPrescription(prescription.id)}
                              >
                                <CancelIcon />
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
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(sortedPrescriptions.length / rowsPerPage)}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Prescription Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Prescription</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Patient Information</StepLabel>
              <StepContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Patient ID"
                      placeholder="Enter patient ID"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Diagnosis"
                      placeholder="Enter diagnosis"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      placeholder="Enter prescription notes"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={() => setShowCreateDialog(false)}
                    sx={{ ml: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Medications</StepLabel>
              <StepContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Add medications to the prescription
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ mb: 2 }}
                >
                  Add Medication
                </Button>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={() => setActiveStep(0)}
                    sx={{ ml: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Review & Sign</StepLabel>
              <StepContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Review prescription details and add digital signature
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Create Prescription
                  </Button>
                  <Button
                    onClick={() => setActiveStep(1)}
                    sx={{ ml: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>

      {/* View Prescription Dialog */}
      <Dialog open={showViewDialog} onClose={() => setShowViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Prescription Details</Typography>
            {selectedPrescription && (
              <Chip 
                label={selectedPrescription.status} 
                color={getStatusColor(selectedPrescription.status) as any}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Patient Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedPrescription.patientName}</Typography>
                  <Typography variant="body2"><strong>ID:</strong> {selectedPrescription.patientId}</Typography>
                  <Typography variant="body2"><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>Medications</Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedPrescription.medications.map((med, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight="bold">{med.name}</Typography>
                        <Typography variant="body2">{med.dosage} - {med.frequency}</Typography>
                        <Typography variant="body2">{med.instructions}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Prescription Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Prescribed:</strong> {selectedPrescription.prescribedDate.toLocaleDateString()}</Typography>
                  <Typography variant="body2"><strong>Expires:</strong> {selectedPrescription.expiryDate.toLocaleDateString()}</Typography>
                  <Typography variant="body2"><strong>Refills:</strong> {selectedPrescription.refillsRemaining}/{selectedPrescription.refills}</Typography>
                  <Typography variant="body2"><strong>Priority:</strong> {selectedPrescription.priority}</Typography>
                </Box>
                
                {selectedPrescription.pharmacyName && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Pharmacy</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2"><strong>Name:</strong> {selectedPrescription.pharmacyName}</Typography>
                      {selectedPrescription.filledDate && (
                        <Typography variant="body2"><strong>Filled:</strong> {selectedPrescription.filledDate.toLocaleDateString()}</Typography>
                      )}
                    </Box>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Notes</Typography>
                <Typography variant="body2">{selectedPrescription.notes}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fill Prescription Dialog */}
      <Dialog open={showFillDialog} onClose={() => setShowFillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Fill Prescription</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Pharmacy</InputLabel>
                  <Select label="Select Pharmacy">
                    {pharmacies.map((pharmacy) => (
                      <MenuItem key={pharmacy.id} value={pharmacy.id}>
                        {pharmacy.name} - {pharmacy.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes for Pharmacy"
                  multiline
                  rows={3}
                  placeholder="Enter any special instructions for the pharmacy"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFillDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowFillDialog(false)}>
            Send to Pharmacy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add prescription"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreatePrescription}
      >
        <AddIcon />
      </Fab>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrescriptionManagementPage; 