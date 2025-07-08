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
  Timeline as TimelineIcon2
} from '@mui/icons-material';

// Mock hospital analytics data
const mockHospitalData = {
  // Key Performance Indicators
  kpis: {
    totalRevenue: 28500000,
    totalExpenses: 19800000,
    netProfit: 8700000,
    profitMargin: 30.5,
    bedOccupancyRate: 78.5,
    averageLengthOfStay: 4.2,
    patientSatisfactionScore: 4.6,
    readmissionRate: 8.2,
    mortalityRate: 2.1,
    emergencyResponseTime: 8.5
  },
  
  // Department Performance
  departments: [
    { name: 'Cardiology', revenue: 4200000, patients: 1250, efficiency: 92, satisfaction: 4.7 },
    { name: 'Orthopedics', revenue: 3800000, patients: 1100, efficiency: 88, satisfaction: 4.5 },
    { name: 'Emergency', revenue: 3200000, patients: 2800, efficiency: 95, satisfaction: 4.3 },
    { name: 'Oncology', revenue: 2800000, patients: 450, efficiency: 89, satisfaction: 4.8 },
    { name: 'Neurology', revenue: 2600000, patients: 680, efficiency: 87, satisfaction: 4.4 },
    { name: 'Pediatrics', revenue: 2200000, patients: 950, efficiency: 91, satisfaction: 4.6 }
  ],
  
  // Resource Utilization
  resources: {
    beds: { total: 450, occupied: 354, available: 96, utilization: 78.7 },
    staff: { doctors: 85, nurses: 320, technicians: 95, admin: 45, total: 545 },
    equipment: { mri: 3, ct: 2, xray: 4, ultrasound: 6, utilization: 82.3 },
    operatingRooms: { total: 8, inUse: 6, available: 2, utilization: 75.0 }
  },
  
  // Financial Metrics
  financials: {
    monthlyRevenue: [
      { month: 'Jan', revenue: 2350000, expenses: 1650000 },
      { month: 'Feb', revenue: 2420000, expenses: 1680000 },
      { month: 'Mar', revenue: 2380000, expenses: 1720000 },
      { month: 'Apr', revenue: 2450000, expenses: 1750000 },
      { month: 'May', revenue: 2510000, expenses: 1780000 },
      { month: 'Jun', revenue: 2480000, expenses: 1810000 }
    ],
    revenueByService: [
      { service: 'Inpatient Care', revenue: 12500000, percentage: 43.9 },
      { service: 'Outpatient Care', revenue: 8500000, percentage: 29.8 },
      { service: 'Emergency Services', revenue: 4200000, percentage: 14.7 },
      { service: 'Diagnostic Services', revenue: 2300000, percentage: 8.1 },
      { service: 'Other Services', revenue: 1000000, percentage: 3.5 }
    ]
  },
  
  // Quality Metrics
  quality: {
    patientSafety: 96.2,
    clinicalOutcomes: 94.8,
    infectionRate: 1.8,
    medicationErrors: 0.3,
    fallsRate: 2.1,
    pressureUlcers: 0.8
  },
  
  // Operational Metrics
  operations: {
    averageWaitTime: 18.5,
    dischargeTime: 2.3,
    surgerySuccessRate: 98.7,
    emergencyResponseTime: 8.5,
    labTurnaroundTime: 4.2,
    radiologyTurnaroundTime: 2.8
  }
};

const HospitalAnalyticsPage: React.FC = () => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon color="primary" />
          Hospital Analytics
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
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="oncology">Oncology</MenuItem>
                  <MenuItem value="neurology">Neurology</MenuItem>
                  <MenuItem value="pediatrics">Pediatrics</MenuItem>
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

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonetizationOnIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="primary">
                {formatCurrency(mockHospitalData.kpis.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Revenue
              </Typography>
              <Typography variant="caption" color="success.main">
                +5.2% vs last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalanceIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="success.main">
                {formatCurrency(mockHospitalData.kpis.netProfit)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Net Profit
              </Typography>
              <Typography variant="caption" color="success.main">
                {mockHospitalData.kpis.profitMargin}% margin
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospitalIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="info.main">
                {mockHospitalData.kpis.bedOccupancyRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bed Occupancy
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {mockHospitalData.resources.beds.occupied}/{mockHospitalData.resources.beds.total} beds
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="warning.main">
                {mockHospitalData.kpis.patientSatisfactionScore}/5
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Patient Satisfaction
              </Typography>
              <Typography variant="caption" color="success.main">
                Excellent rating
              </Typography>
            </CardContent>
          </Card>
      </Grid>

      {/* Department Performance */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Patients</TableCell>
                      <TableCell align="right">Efficiency</TableCell>
                      <TableCell align="right">Satisfaction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockHospitalData.departments.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell align="right">{formatCurrency(dept.revenue)}</TableCell>
                        <TableCell align="right">{dept.patients.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <LinearProgress
                              variant="determinate"
                              value={dept.efficiency}
                              sx={{ width: 60, mr: 1 }}
                            />
                            {dept.efficiency}%
                          </Box>
                        </TableCell>
                        <TableCell align="right">{dept.satisfaction}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Utilization */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Utilization
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Beds"
                    secondary={`${mockHospitalData.resources.beds.occupied}/${mockHospitalData.resources.beds.total} (${mockHospitalData.resources.beds.utilization}%)`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={mockHospitalData.resources.beds.utilization}
                    sx={{ width: 60 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Operating Rooms"
                    secondary={`${mockHospitalData.resources.operatingRooms.inUse}/${mockHospitalData.resources.operatingRooms.total} (${mockHospitalData.resources.operatingRooms.utilization}%)`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={mockHospitalData.resources.operatingRooms.utilization}
                    sx={{ width: 60 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Equipment"
                    secondary={`${mockHospitalData.resources.equipment.utilization}% utilization`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={mockHospitalData.resources.equipment.utilization}
                    sx={{ width: 60 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Staff"
                    secondary={`${mockHospitalData.resources.staff.total} total staff`}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {mockHospitalData.resources.staff.doctors} doctors, {mockHospitalData.resources.staff.nurses} nurses
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Financial Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Expenses</TableCell>
                      <TableCell align="right">Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockHospitalData.financials.monthlyRevenue.map((month) => (
                      <TableRow key={month.month}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell align="right">{formatCurrency(month.revenue)}</TableCell>
                        <TableCell align="right">{formatCurrency(month.expenses)}</TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>
                          {formatCurrency(month.revenue - month.expenses)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Service
              </Typography>
              <List dense>
                {mockHospitalData.financials.revenueByService.map((service) => (
                  <ListItem key={service.service}>
                    <ListItemText
                      primary={service.service}
                      secondary={`${formatCurrency(service.revenue)} (${service.percentage}%)`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={service.percentage}
                      sx={{ width: 60 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quality & Operational Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quality Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {mockHospitalData.quality.patientSafety}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patient Safety Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info.main">
                      {mockHospitalData.quality.clinicalOutcomes}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Clinical Outcomes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {mockHospitalData.quality.infectionRate}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Infection Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="error.main">
                      {mockHospitalData.quality.medicationErrors}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Medication Errors
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operational Metrics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Average Wait Time"
                    secondary={`${mockHospitalData.operations.averageWaitTime} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Discharge Time"
                    secondary={`${mockHospitalData.operations.dischargeTime} hours`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Surgery Success Rate"
                    secondary={`${mockHospitalData.operations.surgerySuccessRate}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Emergency Response Time"
                    secondary={`${mockHospitalData.operations.emergencyResponseTime} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Lab Turnaround Time"
                    secondary={`${mockHospitalData.operations.labTurnaroundTime} hours`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Radiology Turnaround Time"
                    secondary={`${mockHospitalData.operations.radiologyTurnaroundTime} hours`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Hospital Analytics</DialogTitle>
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
                  label="Include Financial Data"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include Quality Metrics"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include Operational Data"
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
        <DialogTitle>Detailed Hospital Analysis</DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Financial" />
            <Tab label="Operational" />
            <Tab label="Quality" />
            <Tab label="Predictions" />
          </Tabs>
          
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Financial Analysis</Typography>
              <Typography variant="body2" paragraph>
                Comprehensive financial analysis including revenue trends, cost analysis, 
                profit margins, and financial forecasting for strategic planning.
              </Typography>
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Operational Analysis</Typography>
              <Typography variant="body2" paragraph>
                Operational efficiency metrics, resource utilization analysis, 
                capacity planning, and process optimization recommendations.
              </Typography>
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Quality Analysis</Typography>
              <Typography variant="body2" paragraph>
                Quality metrics analysis, patient safety indicators, 
                clinical outcomes assessment, and quality improvement initiatives.
              </Typography>
            </Box>
          )}
          
          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Predictive Analytics</Typography>
              <Typography variant="body2" paragraph>
                Predictive models for patient volume, resource requirements, 
                financial forecasting, and risk assessment using advanced analytics.
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

export default HospitalAnalyticsPage; 