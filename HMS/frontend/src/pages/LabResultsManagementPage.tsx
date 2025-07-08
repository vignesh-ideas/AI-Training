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
  FormGroup
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Assessment as AssessmentIcon,
  LocalHospital as LocalHospitalIcon,
  Science as ScienceIcon,
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
  Send as SendIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon2
} from '@mui/icons-material';

interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testCategory: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderedBy: string;
  performedBy: string;
  orderedDate: Date;
  performedDate: Date;
  reportedDate: Date;
  notes: string;
  attachments: string[];
  isReviewed: boolean;
  reviewedBy?: string;
  reviewDate?: Date;
  labLocation: string;
  specimenType: string;
  specimenId: string;
}

interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation: string;
  turnaroundTime: string;
  price: number;
  isAvailable: boolean;
}

const LabResultsManagementPage: React.FC = () => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const [showResultDialog, setShowResultDialog] = useState<boolean>(false);
  const [showTestDialog, setShowTestDialog] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockLabResults: LabResult[] = [
      {
        id: '1',
        patientId: 'P001',
        patientName: 'John Doe',
        testName: 'Complete Blood Count (CBC)',
        testCategory: 'Hematology',
        result: 'Normal',
        unit: '',
        referenceRange: 'Normal',
        status: 'completed',
        priority: 'medium',
        orderedBy: 'Dr. Smith',
        performedBy: 'Lab Tech Johnson',
        orderedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        performedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
        reportedDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
        notes: 'All parameters within normal range',
        attachments: ['cbc_report.pdf', 'cbc_image.jpg'],
        isReviewed: true,
        reviewedBy: 'Dr. Smith',
        reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
        labLocation: 'Main Lab',
        specimenType: 'Blood',
        specimenId: 'SP001'
      },
      {
        id: '2',
        patientId: 'P001',
        patientName: 'John Doe',
        testName: 'Comprehensive Metabolic Panel',
        testCategory: 'Chemistry',
        result: 'Abnormal',
        unit: '',
        referenceRange: 'Normal',
        status: 'completed',
        priority: 'high',
        orderedBy: 'Dr. Smith',
        performedBy: 'Lab Tech Williams',
        orderedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        performedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
        reportedDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
        notes: 'Elevated glucose levels detected',
        attachments: ['cmp_report.pdf'],
        isReviewed: false,
        labLocation: 'Main Lab',
        specimenType: 'Blood',
        specimenId: 'SP002'
      },
      {
        id: '3',
        patientId: 'P002',
        patientName: 'Jane Smith',
        testName: 'Lipid Panel',
        testCategory: 'Chemistry',
        result: 'Normal',
        unit: '',
        referenceRange: 'Normal',
        status: 'pending',
        priority: 'low',
        orderedBy: 'Dr. Johnson',
        performedBy: '',
        orderedDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
        performedDate: new Date(),
        reportedDate: new Date(),
        notes: 'Test in progress',
        attachments: [],
        isReviewed: false,
        labLocation: 'Main Lab',
        specimenType: 'Blood',
        specimenId: 'SP003'
      }
    ];

    const mockLabTests: LabTest[] = [
      {
        id: '1',
        name: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        description: 'Measures red blood cells, white blood cells, and platelets',
        preparation: 'Fasting not required',
        turnaroundTime: '24 hours',
        price: 45.00,
        isAvailable: true
      },
      {
        id: '2',
        name: 'Comprehensive Metabolic Panel',
        category: 'Chemistry',
        description: 'Measures kidney function, liver function, and blood sugar',
        preparation: 'Fasting for 8-12 hours',
        turnaroundTime: '24 hours',
        price: 65.00,
        isAvailable: true
      },
      {
        id: '3',
        name: 'Lipid Panel',
        category: 'Chemistry',
        description: 'Measures cholesterol and triglyceride levels',
        preparation: 'Fasting for 12-14 hours',
        turnaroundTime: '24 hours',
        price: 35.00,
        isAvailable: true
      }
    ];

    setLabResults(mockLabResults);
    setLabTests(mockLabTests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'abnormal': return 'warning';
      case 'critical': return 'error';
      case 'pending': return 'info';
      case 'completed': return 'success';
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
      case 'normal':
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'abnormal':
        return <WarningIcon color="warning" />;
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'pending':
        return <PendingIcon color="info" />;
      default:
        return <PendingIcon />;
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || result.testCategory === filterCategory;
    const matchesPriority = filterPriority === 'all' || result.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
        break;
      case 'patient':
        comparison = a.patientName.localeCompare(b.patientName);
        break;
      case 'test':
        comparison = a.testName.localeCompare(b.testName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const paginatedResults = sortedResults.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleUploadResults = () => {
    setShowUploadDialog(true);
  };

  const handleViewResult = (result: LabResult) => {
    setSelectedResult(result);
    setShowResultDialog(true);
  };

  const handleOrderTest = () => {
    setShowTestDialog(true);
  };

  const handleExportResults = () => {
    setSnackbar({
      open: true,
      message: 'Lab results exported successfully',
      severity: 'success'
    });
  };

  const handlePrintReport = () => {
    setSnackbar({
      open: true,
      message: 'Report sent to printer',
      severity: 'success'
    });
  };

  const handleReviewResult = (resultId: string) => {
    setLabResults(labResults.map(result => 
      result.id === resultId 
        ? { ...result, isReviewed: true, reviewedBy: 'Dr. Current', reviewDate: new Date() }
        : result
    ));
    setSnackbar({
      open: true,
      message: 'Result marked as reviewed',
      severity: 'success'
    });
  };

  const handleShareResult = (resultId: string) => {
    setSnackbar({
      open: true,
      message: 'Result shared successfully',
      severity: 'success'
    });
  };

  const pendingResults = labResults.filter(result => result.status === 'pending');
  const criticalResults = labResults.filter(result => result.status === 'critical');
  const unreviewedResults = labResults.filter(result => !result.isReviewed);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon color="primary" />
          Lab Results Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUploadResults}
          >
            Upload Results
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOrderTest}
          >
            Order Test
          </Button>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerts */}
      {(criticalResults.length > 0 || pendingResults.length > 0) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              View All
            </Button>
          }
        >
          {criticalResults.length > 0 
            ? `${criticalResults.length} critical result(s) require immediate attention`
            : `${pendingResults.length} pending result(s)`
          }
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {labResults.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {pendingResults.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pending Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {criticalResults.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Critical Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {unreviewedResults.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Unreviewed Results
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
                placeholder="Search by patient name or test..."
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
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="abnormal">Abnormal</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Hematology">Hematology</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Microbiology">Microbiology</MenuItem>
                  <MenuItem value="Immunology">Immunology</MenuItem>
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
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Results Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Lab Results
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportResults}
                  >
                    Export
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintReport}
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
                      <TableCell>Test</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Reported Date</TableCell>
                      <TableCell>Reviewed</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {result.patientName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {result.patientId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {result.testName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={result.testCategory} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {result.result}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(result.status)}
                            <Chip 
                              label={result.status} 
                              size="small" 
                              color={getStatusColor(result.status) as any}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={result.priority} 
                            size="small" 
                            color={getPriorityColor(result.priority) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {result.reportedDate.toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {result.reportedDate.toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {result.isReviewed ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <PendingIcon color="warning" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={() => handleViewResult(result)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Share">
                              <IconButton 
                                size="small"
                                onClick={() => handleShareResult(result.id)}
                              >
                                <ShareIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton size="small">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                            {!result.isReviewed && (
                              <Tooltip title="Mark as Reviewed">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleReviewResult(result.id)}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
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
                  count={Math.ceil(sortedResults.length / rowsPerPage)}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Results Dialog */}
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Lab Results</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag and drop files here
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  or click to browse files
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Choose Files
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient ID"
                placeholder="Enter patient ID"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Test Name"
                placeholder="Enter test name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Test Category</InputLabel>
                <Select label="Test Category">
                  <MenuItem value="Hematology">Hematology</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Microbiology">Microbiology</MenuItem>
                  <MenuItem value="Immunology">Immunology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                placeholder="Enter any additional notes"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowUploadDialog(false)}>
            Upload Results
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Details Dialog */}
      <Dialog open={showResultDialog} onClose={() => setShowResultDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Lab Result Details</Typography>
            {selectedResult && (
              <Chip 
                label={selectedResult.status} 
                color={getStatusColor(selectedResult.status) as any}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Patient Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedResult.patientName}</Typography>
                  <Typography variant="body2"><strong>ID:</strong> {selectedResult.patientId}</Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>Test Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Test:</strong> {selectedResult.testName}</Typography>
                  <Typography variant="body2"><strong>Category:</strong> {selectedResult.testCategory}</Typography>
                  <Typography variant="body2"><strong>Result:</strong> {selectedResult.result}</Typography>
                  <Typography variant="body2"><strong>Reference Range:</strong> {selectedResult.referenceRange}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Timeline</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Ordered:</strong> {selectedResult.orderedDate.toLocaleString()}</Typography>
                  <Typography variant="body2"><strong>Performed:</strong> {selectedResult.performedDate.toLocaleString()}</Typography>
                  <Typography variant="body2"><strong>Reported:</strong> {selectedResult.reportedDate.toLocaleString()}</Typography>
                  {selectedResult.reviewDate && (
                    <Typography variant="body2"><strong>Reviewed:</strong> {selectedResult.reviewDate.toLocaleString()}</Typography>
                  )}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>Staff</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Ordered By:</strong> {selectedResult.orderedBy}</Typography>
                  <Typography variant="body2"><strong>Performed By:</strong> {selectedResult.performedBy}</Typography>
                  {selectedResult.reviewedBy && (
                    <Typography variant="body2"><strong>Reviewed By:</strong> {selectedResult.reviewedBy}</Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Notes</Typography>
                <Typography variant="body2">{selectedResult.notes}</Typography>
              </Grid>
              
              {selectedResult.attachments.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Attachments</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedResult.attachments.map((attachment, index) => (
                      <Chip
                        key={index}
                        label={attachment}
                        icon={<DescriptionIcon />}
                        onClick={() => {}}
                        clickable
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResultDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Test Dialog */}
      <Dialog open={showTestDialog} onClose={() => setShowTestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Lab Test</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient ID"
                placeholder="Enter patient ID"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Test Category</InputLabel>
                <Select label="Test Category">
                  <MenuItem value="Hematology">Hematology</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Microbiology">Microbiology</MenuItem>
                  <MenuItem value="Immunology">Immunology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={labTests}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Select Test" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Turnaround: {option.turnaroundTime} | Price: ${option.price}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specimen ID"
                placeholder="Enter specimen ID"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                placeholder="Enter any special instructions"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTestDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowTestDialog(false)}>
            Order Test
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="upload"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleUploadResults}
      >
        <UploadIcon />
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

export default LabResultsManagementPage; 