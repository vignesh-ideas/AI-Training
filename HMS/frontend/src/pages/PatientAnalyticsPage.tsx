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
  Height as HeightIcon
} from '@mui/icons-material';

// Mock data for charts
const mockPatientData = {
  totalPatients: 1250,
  newPatientsThisMonth: 45,
  activePatients: 890,
  dischargedPatients: 360,
  averageAge: 42.5,
  genderDistribution: {
    male: 52,
    female: 48
  },
  ageGroups: [
    { group: '0-18', count: 180, percentage: 14.4 },
    { group: '19-30', count: 250, percentage: 20.0 },
    { group: '31-50', count: 400, percentage: 32.0 },
    { group: '51-65', count: 280, percentage: 22.4 },
    { group: '65+', count: 140, percentage: 11.2 }
  ],
  topConditions: [
    { condition: 'Hypertension', count: 156, percentage: 12.5 },
    { condition: 'Diabetes', count: 134, percentage: 10.7 },
    { condition: 'Respiratory Issues', count: 98, percentage: 7.8 },
    { condition: 'Cardiovascular', count: 87, percentage: 7.0 },
    { condition: 'Mental Health', count: 76, percentage: 6.1 }
  ],
  monthlyAdmissions: [
    { month: 'Jan', admissions: 45, discharges: 38 },
    { month: 'Feb', admissions: 52, discharges: 41 },
    { month: 'Mar', admissions: 48, discharges: 43 },
    { month: 'Apr', admissions: 61, discharges: 49 },
    { month: 'May', admissions: 55, discharges: 52 },
    { month: 'Jun', admissions: 58, discharges: 47 }
  ],
  departmentDistribution: [
    { department: 'Cardiology', patients: 180, percentage: 14.4 },
    { department: 'Orthopedics', patients: 165, percentage: 13.2 },
    { department: 'Pediatrics', patients: 142, percentage: 11.4 },
    { department: 'Neurology', patients: 128, percentage: 10.2 },
    { department: 'Oncology', patients: 98, percentage: 7.8 },
    { department: 'Emergency', patients: 156, percentage: 12.5 },
    { department: 'Others', patients: 421, percentage: 33.7 }
  ]
};

const PatientAnalyticsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6months');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleExportData = () => {
    setShowExportDialog(true);
  };

  const handlePrintReport = () => {
    setSnackbar({
      open: true,
      message: 'Report sent to printer',
      severity: 'success'
    });
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Data refreshed successfully',
        severity: 'success'
      });
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon color="primary" />
          Patient Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintReport}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  label="Timeframe"
                >
                  <MenuItem value="1month">Last Month</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="cardiology">Cardiology</MenuItem>
                  <MenuItem value="orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="neurology">Neurology</MenuItem>
                  <MenuItem value="oncology">Oncology</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={() => setShowDetailsDialog(true)}
              >
                Detailed Analysis
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {mockPatientData.totalPatients.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Patients
              </Typography>
              <Typography variant="caption" color="success.main">
                +{mockPatientData.newPatientsThisMonth} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {mockPatientData.activePatients.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Patients
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {((mockPatientData.activePatients / mockPatientData.totalPatients) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ElderlyIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {mockPatientData.averageAge}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average Age
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Years
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {mockPatientData.dischargedPatients.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Discharged
              </Typography>
              <Typography variant="caption" color="textSecondary">
                This period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gender Distribution
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h5" color="primary">
                    {mockPatientData.genderDistribution.male}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Male
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60, mb: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h5" color="secondary">
                    {mockPatientData.genderDistribution.female}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Female
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Age Groups */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Age Distribution
              </Typography>
              <List dense>
                {mockPatientData.ageGroups.map((group) => (
                  <ListItem key={group.group}>
                    <ListItemText
                      primary={group.group}
                      secondary={`${group.count} patients (${group.percentage}%)`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={group.percentage}
                      sx={{ width: 100, mr: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Conditions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Medical Conditions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPatientData.topConditions.map((condition) => (
                      <TableRow key={condition.condition}>
                        <TableCell>{condition.condition}</TableCell>
                        <TableCell>{condition.count}</TableCell>
                        <TableCell>{condition.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Distribution
              </Typography>
              <List dense>
                {mockPatientData.departmentDistribution.map((dept) => (
                  <ListItem key={dept.department}>
                    <ListItemText
                      primary={dept.department}
                      secondary={`${dept.patients} patients (${dept.percentage}%)`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={dept.percentage}
                      sx={{ width: 100, mr: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Admission Trends
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                {mockPatientData.monthlyAdmissions.map((month) => (
                  <Box key={month.month} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {month.admissions}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {month.month}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +{month.admissions - month.discharges} net
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Analytics Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Export Format</InputLabel>
                <Select label="Export Format">
                  <MenuItem value="pdf">PDF Report</MenuItem>
                  <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                  <MenuItem value="csv">CSV File</MenuItem>
                  <MenuItem value="json">JSON Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Data Range</InputLabel>
                <Select label="Data Range">
                  <MenuItem value="all">All Data</MenuItem>
                  <MenuItem value="current">Current Period</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include Charts"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include Tables"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Include Raw Data"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowExportDialog(false)}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detailed Analysis Dialog */}
      <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detailed Patient Analysis</DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Demographics" />
            <Tab label="Medical Trends" />
            <Tab label="Department Analysis" />
            <Tab label="Predictions" />
          </Tabs>
          
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Demographic Analysis</Typography>
              <Typography variant="body2" paragraph>
                Detailed demographic breakdown including age distribution, gender ratios, 
                geographic distribution, and socioeconomic factors affecting patient care.
              </Typography>
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Medical Trends</Typography>
              <Typography variant="body2" paragraph>
                Analysis of medical conditions, treatment patterns, medication usage, 
                and health outcomes over time.
              </Typography>
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Department Analysis</Typography>
              <Typography variant="body2" paragraph>
                Performance metrics, patient flow, resource utilization, and efficiency 
                analysis across different departments.
              </Typography>
            </Box>
          )}
          
          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Predictive Analytics</Typography>
              <Typography variant="body2" paragraph>
                Machine learning models predicting patient outcomes, readmission risks, 
                and resource requirements based on historical data.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>

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

export default PatientAnalyticsPage; 