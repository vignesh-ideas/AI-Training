import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Timeline,
  CalendarToday,
  MedicalServices,
  LocalHospital,
  Medication,
  Person,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface PatientStatsProps {
  patientId: string;
}

interface StatData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalVisits: number;
  averageVisitDuration: number;
  totalPrescriptions: number;
  activePrescriptions: number;
  totalLabTests: number;
  abnormalResults: number;
  totalSurgeries: number;
  emergencyVisits: number;
  followUpRate: number;
  patientSatisfaction: number;
  lastVisitDate: string;
  nextAppointmentDate: string;
  daysSinceLastVisit: number;
  upcomingAppointments: number;
  overdueAppointments: number;
  totalDocuments: number;
  recentActivity: Array<{
    date: string;
    type: string;
    description: string;
    status: string;
  }>;
  healthTrends: Array<{
    month: string;
    visits: number;
    prescriptions: number;
    labTests: number;
  }>;
}

const PatientStats: React.FC<PatientStatsProps> = ({ patientId }) => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientStats();
  }, [patientId]);

  const fetchPatientStats = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: StatData = {
        totalAppointments: 24,
        completedAppointments: 20,
        cancelledAppointments: 2,
        totalVisits: 18,
        averageVisitDuration: 45,
        totalPrescriptions: 12,
        activePrescriptions: 3,
        totalLabTests: 8,
        abnormalResults: 1,
        totalSurgeries: 1,
        emergencyVisits: 1,
        followUpRate: 85,
        patientSatisfaction: 92,
        lastVisitDate: '2024-01-15',
        nextAppointmentDate: '2024-02-15',
        daysSinceLastVisit: 30,
        upcomingAppointments: 2,
        overdueAppointments: 0,
        totalDocuments: 15,
        recentActivity: [
          {
            date: '2024-01-15',
            type: 'APPOINTMENT',
            description: 'Annual Physical Examination',
            status: 'COMPLETED',
          },
          {
            date: '2024-01-10',
            type: 'LAB_RESULT',
            description: 'Blood Work Results Available',
            status: 'COMPLETED',
          },
          {
            date: '2023-12-20',
            type: 'PRESCRIPTION',
            description: 'Medication Refill - Lisinopril',
            status: 'COMPLETED',
          },
          {
            date: '2023-11-15',
            type: 'SURGERY',
            description: 'Appendectomy',
            status: 'COMPLETED',
          },
        ],
        healthTrends: [
          { month: 'Jan 2024', visits: 2, prescriptions: 1, labTests: 1 },
          { month: 'Dec 2023', visits: 1, prescriptions: 1, labTests: 0 },
          { month: 'Nov 2023', visits: 3, prescriptions: 2, labTests: 2 },
          { month: 'Oct 2023', visits: 1, prescriptions: 0, labTests: 1 },
          { month: 'Sep 2023', visits: 2, prescriptions: 1, labTests: 1 },
          { month: 'Aug 2023', visits: 1, prescriptions: 1, labTests: 0 },
        ],
      };

      setStats(mockStats);
    } catch (error) {
      setError('Failed to load patient statistics');
      toast.error('Failed to load patient statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle color="success" />;
      case 'PENDING':
        return <Warning color="warning" />;
      case 'CANCELLED':
        return <Error color="error" />;
      default:
        return <Timeline />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return <CalendarToday />;
      case 'LAB_RESULT':
        return <Assessment />;
      case 'PRESCRIPTION':
        return <Medication />;
      case 'SURGERY':
        return <LocalHospital />;
      default:
        return <MedicalServices />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 3 }}>
        No statistics available for this patient.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment />
        Patient Statistics
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.totalAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Appointments
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Chip
                  label={`${stats.completedAppointments} completed`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`${stats.cancelledAppointments} cancelled`}
                  color="error"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats.totalVisits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Visits
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg. {stats.averageVisitDuration} min per visit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" gutterBottom>
                {stats.totalPrescriptions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Prescriptions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.activePrescriptions} currently active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main" gutterBottom>
                {stats.totalLabTests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lab Tests
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.abnormalResults} abnormal results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Completion Rate
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Follow-up Rate
                    </Typography>
                    <Typography variant="h6" color="info.main">
                      {stats.followUpRate}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Upcoming Appointments
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {stats.upcomingAppointments}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Overdue Appointments
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {stats.overdueAppointments}
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
                Health Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Patient Satisfaction
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {stats.patientSatisfaction}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Emergency Visits
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {stats.emergencyVisits}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Surgeries
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {stats.totalSurgeries}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Documents
                    </Typography>
                    <Typography variant="h6" color="info.main">
                      {stats.totalDocuments}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {stats.recentActivity.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={activity.date}
                    />
                    <Box>
                      {getStatusIcon(activity.status)}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Trends (Last 6 Months)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                {stats.healthTrends.map((trend, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={trend.month}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Chip
                            label={`${trend.visits} visits`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`${trend.prescriptions} prescriptions`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                          <Chip
                            label={`${trend.labTests} lab tests`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Last Visit
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.daysSinceLastVisit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                days ago
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.lastVisitDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Next Appointment
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.upcomingAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                scheduled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.nextAppointmentDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Health Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="h4" color="success.main">
                  Good
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on recent activity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientStats; 