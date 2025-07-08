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
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  LocalHospital as LocalHospitalIcon,
  MonitorHeart as MonitorHeartIcon,
  Favorite as HeartIcon,
  Speed as SpeedIcon,
  Opacity as BloodIcon,
  Thermostat as TempIcon,
  Scale as WeightIcon,
  Height as HeightIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface VitalSign {
  id: string;
  patientId: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen_saturation' | 'respiratory_rate' | 'weight' | 'height' | 'blood_glucose';
  value: number;
  unit: string;
  systolic?: number;
  diastolic?: number;
  timestamp: Date;
  status: 'normal' | 'elevated' | 'high' | 'critical' | 'low';
  notes?: string;
  recordedBy: string;
}

interface VitalAlert {
  id: string;
  patientId: string;
  vitalType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
}

interface VitalThreshold {
  type: string;
  minValue: number;
  maxValue: number;
  unit: string;
  enabled: boolean;
}

const VitalsMonitoringPage: React.FC = () => {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [alerts, setAlerts] = useState<VitalAlert[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('P001');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showAddVital, setShowAddVital] = useState<boolean>(false);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<VitalAlert | null>(null);
  const [thresholds, setThresholds] = useState<VitalThreshold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockVitals: VitalSign[] = [
      {
        id: '1',
        patientId: 'P001',
        type: 'blood_pressure',
        value: 120,
        unit: 'mmHg',
        systolic: 120,
        diastolic: 80,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'normal',
        recordedBy: 'Dr. Smith'
      },
      {
        id: '2',
        patientId: 'P001',
        type: 'heart_rate',
        value: 75,
        unit: 'bpm',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        status: 'normal',
        recordedBy: 'Dr. Smith'
      },
      {
        id: '3',
        patientId: 'P001',
        type: 'temperature',
        value: 98.6,
        unit: '°F',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: 'normal',
        recordedBy: 'Dr. Smith'
      },
      {
        id: '4',
        patientId: 'P001',
        type: 'oxygen_saturation',
        value: 98,
        unit: '%',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'normal',
        recordedBy: 'Dr. Smith'
      },
      {
        id: '5',
        patientId: 'P001',
        type: 'respiratory_rate',
        value: 16,
        unit: 'breaths/min',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'normal',
        recordedBy: 'Dr. Smith'
      }
    ];

    const mockAlerts: VitalAlert[] = [
      {
        id: '1',
        patientId: 'P001',
        vitalType: 'heart_rate',
        severity: 'medium',
        message: 'Heart rate elevated: 95 bpm',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
        isAcknowledged: false
      },
      {
        id: '2',
        patientId: 'P001',
        vitalType: 'blood_pressure',
        severity: 'high',
        message: 'Blood pressure high: 140/90 mmHg',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isRead: true,
        isAcknowledged: false
      }
    ];

    const mockThresholds: VitalThreshold[] = [
      { type: 'heart_rate', minValue: 60, maxValue: 100, unit: 'bpm', enabled: true },
      { type: 'blood_pressure', minValue: 90, maxValue: 140, unit: 'mmHg', enabled: true },
      { type: 'temperature', minValue: 97, maxValue: 100.4, unit: '°F', enabled: true },
      { type: 'oxygen_saturation', minValue: 95, maxValue: 100, unit: '%', enabled: true },
      { type: 'respiratory_rate', minValue: 12, maxValue: 20, unit: 'breaths/min', enabled: true }
    ];

    setVitals(mockVitals);
    setAlerts(mockAlerts);
    setThresholds(mockThresholds);
  }, []);

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <HeartIcon />;
      case 'blood_pressure': return <SpeedIcon />;
      case 'temperature': return <TempIcon />;
      case 'oxygen_saturation': return <BloodIcon />;
      case 'respiratory_rate': return <MonitorHeartIcon />;
      case 'weight': return <WeightIcon />;
      case 'height': return <HeightIcon />;
      case 'blood_glucose': return <LocalHospitalIcon />;
      default: return <MonitorHeartIcon />;
    }
  };

  const getVitalColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'elevated': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const formatVitalValue = (vital: VitalSign) => {
    if (vital.type === 'blood_pressure' && vital.systolic && vital.diastolic) {
      return `${vital.systolic}/${vital.diastolic} ${vital.unit}`;
    }
    return `${vital.value} ${vital.unit}`;
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setSnackbar({
      open: true,
      message: 'Real-time monitoring started',
      severity: 'success'
    });
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setSnackbar({
      open: true,
      message: 'Real-time monitoring stopped',
      severity: 'info'
    });
  };

  const handleAddVital = () => {
    setShowAddVital(true);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, isAcknowledged: true }
        : alert
    ));
    setSnackbar({
      open: true,
      message: 'Alert acknowledged',
      severity: 'success'
    });
  };

  const handleExportData = () => {
    // Mock export functionality
    setSnackbar({
      open: true,
      message: 'Vitals data exported successfully',
      severity: 'success'
    });
  };

  const handlePrintReport = () => {
    // Mock print functionality
    setSnackbar({
      open: true,
      message: 'Report sent to printer',
      severity: 'success'
    });
  };

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;
  const criticalAlertsCount = alerts.filter(alert => alert.severity === 'critical' && !alert.isAcknowledged).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorHeartIcon color="primary" />
          Vitals Monitoring
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={isMonitoring ? "outlined" : "contained"}
            startIcon={isMonitoring ? <PauseIcon /> : <PlayIcon />}
            onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
            color={isMonitoring ? "warning" : "success"}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddVital}
          >
            Add Vital
          </Button>
          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setShowAlertDialog(true)}>
              View All ({alerts.length})
            </Button>
          }
        >
          {criticalAlertsCount > 0 
            ? `${criticalAlertsCount} critical alert(s) require attention`
            : `${unreadAlertsCount} unread alert(s)`
          }
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Current Vitals Cards */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Vitals
              </Typography>
              <Grid container spacing={2}>
                {vitals.slice(0, 4).map((vital) => (
                  <Grid item xs={6} sm={3} key={vital.id}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getVitalIcon(vital.type)}
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {vital.type.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {formatVitalValue(vital)}
                      </Typography>
                      <Chip 
                        label={vital.status} 
                        size="small" 
                        color={getVitalColor(vital.status) as any}
                        sx={{ mt: 1 }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              <List dense>
                {alerts.slice(0, 3).map((alert) => (
                  <ListItem key={alert.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <WarningIcon color={getAlertColor(alert.severity) as any} />
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={alert.timestamp.toLocaleString()}
                    />
                    {!alert.isAcknowledged && (
                      <Button
                        size="small"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Ack
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
              {alerts.length > 3 && (
                <Button 
                  fullWidth 
                  onClick={() => setShowAlertDialog(true)}
                  sx={{ mt: 1 }}
                >
                  View All Alerts
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
                  <Tab label="Heart Rate" />
                  <Tab label="Blood Pressure" />
                  <Tab label="Temperature" />
                  <Tab label="Oxygen Saturation" />
                </Tabs>
              </Box>
              
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitals.filter(v => v.type === 'heart_rate').map(v => ({
                    time: v.timestamp.toLocaleTimeString(),
                    value: v.value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vitals History Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Vitals History
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportData}
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
                      <TableCell>Type</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Recorded By</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vitals.map((vital) => (
                      <TableRow key={vital.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getVitalIcon(vital.type)}
                            {vital.type.replace('_', ' ').toUpperCase()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatVitalValue(vital)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={vital.status} 
                            size="small" 
                            color={getVitalColor(vital.status) as any}
                          />
                        </TableCell>
                        <TableCell>{vital.recordedBy}</TableCell>
                        <TableCell>{vital.timestamp.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Vital Dialog */}
      <Dialog open={showAddVital} onClose={() => setShowAddVital(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vital Sign</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vital Type</InputLabel>
                <Select label="Vital Type" defaultValue="">
                  <MenuItem value="blood_pressure">Blood Pressure</MenuItem>
                  <MenuItem value="heart_rate">Heart Rate</MenuItem>
                  <MenuItem value="temperature">Temperature</MenuItem>
                  <MenuItem value="oxygen_saturation">Oxygen Saturation</MenuItem>
                  <MenuItem value="respiratory_rate">Respiratory Rate</MenuItem>
                  <MenuItem value="weight">Weight</MenuItem>
                  <MenuItem value="height">Height</MenuItem>
                  <MenuItem value="blood_glucose">Blood Glucose</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Systolic (if BP)"
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Diastolic (if BP)"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddVital(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowAddVital(false)}>
            Add Vital
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts Dialog */}
      <Dialog open={showAlertDialog} onClose={() => setShowAlertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Vital Alerts
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {alerts.map((alert) => (
              <ListItem key={alert.id} divider>
                <ListItemIcon>
                  <WarningIcon color={getAlertColor(alert.severity) as any} />
                </ListItemIcon>
                <ListItemText
                  primary={alert.message}
                  secondary={alert.timestamp.toLocaleString()}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!alert.isAcknowledged && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Chip 
                    label={alert.severity} 
                    size="small" 
                    color={getAlertColor(alert.severity) as any}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlertDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Vitals Monitoring Settings</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Alert Thresholds
          </Typography>
          <Grid container spacing={2}>
            {thresholds.map((threshold) => (
              <Grid item xs={12} key={threshold.type}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        {threshold.type.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={threshold.enabled}
                            onChange={(e) => {
                              setThresholds(thresholds.map(t => 
                                t.type === threshold.type 
                                  ? { ...t, enabled: e.target.checked }
                                  : t
                              ));
                            }}
                          />
                        }
                        label="Enable Alerts"
                      />
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Min Value"
                          type="number"
                          value={threshold.minValue}
                          onChange={(e) => {
                            setThresholds(thresholds.map(t => 
                              t.type === threshold.type 
                                ? { ...t, minValue: Number(e.target.value) }
                                : t
                            ));
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Max Value"
                          type="number"
                          value={threshold.maxValue}
                          onChange={(e) => {
                            setThresholds(thresholds.map(t => 
                              t.type === threshold.type 
                                ? { ...t, maxValue: Number(e.target.value) }
                                : t
                            ));
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowSettings(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddVital}
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

export default VitalsMonitoringPage; 