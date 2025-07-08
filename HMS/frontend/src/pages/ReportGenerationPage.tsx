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
  KeyboardArrowUp as KeyboardArrowUpIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Elderly as ElderlyIcon,
  Child as ChildIcon,
  PregnantWoman as PregnantWomanIcon,
  Accessibility as AccessibilityIcon,
  Favorite as HeartIcon,
  Speed as SpeedIcon,
  Opacity as BloodIcon,
  Thermostat as TempIcon,
  Scale as WeightIcon,
  Height as HeightIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  Speed as SpeedIcon2,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  MedicalServices as MedicalServicesIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  PieChart as PieChartIcon2,
  BarChart as BarChartIcon2,
  ShowChart as ShowChartIcon2,
  Timeline as TimelineIcon2,
  Description as DescriptionIcon2,
  Article as ArticleIcon,
  Receipt as ReceiptIcon2,
  Assessment as AssessmentIcon2,
  Timeline as TimelineIcon3,
  History as HistoryIcon,
  Folder as FolderIcon,
  Create as CreateIcon,
  Preview as PreviewIcon,
  CloudDownload as CloudDownloadIcon,
  Email as EmailIcon3,
  Share as ShareIcon2,
  Archive as ArchiveIcon2,
  Delete as DeleteIcon2,
  Edit as EditIcon2,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon2,
  Print as PrintIcon2,
  Schedule as ScheduleIcon2,
  Notifications as NotificationsIcon2
} from '@mui/icons-material';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'patient' | 'medical' | 'analytics' | 'administrative' | 'financial';
  description: string;
  category: string;
  isCustomizable: boolean;
  estimatedTime: string;
  lastUsed?: Date;
  usageCount: number;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  patientId?: string;
  generatedDate: Date;
  status: 'generating' | 'completed' | 'failed';
  fileSize?: string;
  downloadUrl?: string;
  generatedBy: string;
}

const mockReportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Patient Medical Summary',
    type: 'patient',
    description: 'Comprehensive patient medical history, diagnoses, treatments, and current status',
    category: 'Patient Reports',
    isCustomizable: true,
    estimatedTime: '2-3 minutes',
    usageCount: 156
  },
  {
    id: '2',
    name: 'Lab Results Report',
    type: 'medical',
    description: 'Detailed laboratory test results with reference ranges and interpretations',
    category: 'Medical Reports',
    isCustomizable: true,
    estimatedTime: '1-2 minutes',
    usageCount: 89
  },
  {
    id: '3',
    name: 'Prescription Summary',
    type: 'medical',
    description: 'Current medications, dosages, instructions, and refill information',
    category: 'Medical Reports',
    isCustomizable: false,
    estimatedTime: '1 minute',
    usageCount: 234
  },
  {
    id: '4',
    name: 'Patient Analytics Report',
    type: 'analytics',
    description: 'Patient statistics, trends, and health metrics over time',
    category: 'Analytics Reports',
    isCustomizable: true,
    estimatedTime: '3-4 minutes',
    usageCount: 67
  },
  {
    id: '5',
    name: 'Hospital Performance Report',
    type: 'analytics',
    description: 'Hospital-wide metrics, department performance, and operational statistics',
    category: 'Analytics Reports',
    isCustomizable: true,
    estimatedTime: '5-6 minutes',
    usageCount: 45
  },
  {
    id: '6',
    name: 'Financial Summary Report',
    type: 'financial',
    description: 'Revenue, expenses, profit margins, and financial performance metrics',
    category: 'Financial Reports',
    isCustomizable: true,
    estimatedTime: '4-5 minutes',
    usageCount: 23
  },
  {
    id: '7',
    name: 'Administrative Report',
    type: 'administrative',
    description: 'Staff schedules, resource utilization, and administrative metrics',
    category: 'Administrative Reports',
    isCustomizable: true,
    estimatedTime: '3-4 minutes',
    usageCount: 34
  }
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: '1',
    name: 'Patient Medical Summary - John Doe',
    type: 'patient',
    patientId: 'P001',
    generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'completed',
    fileSize: '2.3 MB',
    downloadUrl: '/reports/patient-summary-john-doe.pdf',
    generatedBy: 'Dr. Smith'
  },
  {
    id: '2',
    name: 'Lab Results Report - Jane Smith',
    type: 'medical',
    patientId: 'P002',
    generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: 'completed',
    fileSize: '1.8 MB',
    downloadUrl: '/reports/lab-results-jane-smith.pdf',
    generatedBy: 'Lab Tech Johnson'
  },
  {
    id: '3',
    name: 'Hospital Performance Report - Q2 2024',
    type: 'analytics',
    generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed',
    fileSize: '5.2 MB',
    downloadUrl: '/reports/hospital-performance-q2-2024.pdf',
    generatedBy: 'Admin User'
  }
];

const ReportGenerationPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showGenerateDialog, setShowGenerateDialog] = useState<boolean>(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState<boolean>(false);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const filteredTemplates = mockReportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'usage':
        comparison = a.usageCount - b.usageCount;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateDialog(true);
  };

  const handlePreviewReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewDialog(true);
  };

  const handleStartGeneration = () => {
    if (!selectedTemplate) return;
    
    setGeneratingReport(true);
    setShowGenerateDialog(false);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
      setSnackbar({
        open: true,
        message: `Report "${selectedTemplate.name}" generated successfully`,
        severity: 'success'
      });
    }, 3000);
  };

  const handleDownloadReport = (reportId: string) => {
    setSnackbar({
      open: true,
      message: 'Report downloaded successfully',
      severity: 'success'
    });
  };

  const handleShareReport = (reportId: string) => {
    setSnackbar({
      open: true,
      message: 'Report shared successfully',
      severity: 'success'
    });
  };

  const handleDeleteReport = (reportId: string) => {
    setSnackbar({
      open: true,
      message: 'Report deleted successfully',
      severity: 'info'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return <PersonIcon />;
      case 'medical': return <MedicalServicesIcon />;
      case 'analytics': return <AnalyticsIcon />;
      case 'financial': return <MonetizationOnIcon />;
      case 'administrative': return <BusinessIcon />;
      default: return <DescriptionIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'primary';
      case 'medical': return 'success';
      case 'analytics': return 'info';
      case 'financial': return 'warning';
      case 'administrative': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PdfIcon color="primary" />
          Report Generation
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => setShowGenerateDialog(true)}
          >
            Create Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
          >
            Report History
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search report templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="medical">Medical</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="administrative">Administrative</MenuItem>
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
                  <MenuItem value="Patient Reports">Patient Reports</MenuItem>
                  <MenuItem value="Medical Reports">Medical Reports</MenuItem>
                  <MenuItem value="Analytics Reports">Analytics Reports</MenuItem>
                  <MenuItem value="Financial Reports">Financial Reports</MenuItem>
                  <MenuItem value="Administrative Reports">Administrative Reports</MenuItem>
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
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="usage">Usage</MenuItem>
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
        {/* Report Templates */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Report Templates
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sortedTemplates.length} templates available
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {sortedTemplates.map((template) => (
                  <Grid item xs={12} sm={6} key={template.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ bgcolor: `${getTypeColor(template.type)}.main`, mr: 1 }}>
                            {getTypeIcon(template.type)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {template.name}
                            </Typography>
                            <Chip 
                              label={template.type} 
                              size="small" 
                              color={getTypeColor(template.type) as any}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {template.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" color="textSecondary">
                            {template.estimatedTime}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {template.usageCount} uses
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CreateIcon />}
                            onClick={() => handleGenerateReport(template)}
                          >
                            Generate
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PreviewIcon />}
                            onClick={() => handlePreviewReport(template)}
                          >
                            Preview
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              <List dense>
                {mockGeneratedReports.map((report) => (
                  <ListItem key={report.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${getTypeColor(report.type)}.main` }}>
                        {getTypeIcon(report.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={report.name}
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {report.generatedDate.toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {report.fileSize} • {report.generatedBy}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Download">
                        <IconButton 
                          size="small"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton 
                          size="small"
                          onClick={() => handleShareReport(report.id)}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onClose={() => setShowGenerateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedTemplate.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {selectedTemplate.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Report Name"
                  defaultValue={`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select label="Format" defaultValue="pdf">
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="docx">Word Document</MenuItem>
                    <MenuItem value="xlsx">Excel Spreadsheet</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {selectedTemplate.type === 'patient' && (
                <Grid item xs={12}>
                  <Autocomplete
                    options={['P001 - John Doe', 'P002 - Jane Smith', 'P003 - Mike Johnson']}
                    renderInput={(params) => <TextField {...params} label="Select Patient" />}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Include charts and graphs"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Include detailed data tables"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Include raw data"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Include summary page"
                  />
                </FormGroup>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={3}
                  placeholder="Any special instructions or notes for the report"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStartGeneration}
            startIcon={<CreateIcon />}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Report Dialog */}
      <Dialog open={showPreviewDialog} onClose={() => setShowPreviewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Report Preview</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, minHeight: 400 }}>
              <Typography variant="h5" gutterBottom>
                {selectedTemplate.name}
              </Typography>
              <Typography variant="body1" paragraph>
                This is a preview of how the report will look when generated. 
                The actual report will contain real data based on your selections.
              </Typography>
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  Report Preview Content
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Charts, tables, and formatted content will appear here
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowPreviewDialog(false);
              setShowGenerateDialog(true);
            }}
          >
            Generate This Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generating Report Overlay */}
      {generatingReport && (
        <Dialog open={generatingReport} maxWidth="sm" fullWidth>
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Generating Report
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please wait while we create your report...
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </DialogContent>
        </Dialog>
      )}

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

export default ReportGenerationPage; 