import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  CalendarToday,
  MedicalServices,
  Timeline,
  Assessment,
  Notifications,
  Add,
  Refresh,
  Print,
  Download,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PatientOverview from '@/components/patient/dashboard/PatientOverview';
import RecentAppointments from '@/components/patient/dashboard/RecentAppointments';
import MedicalHistorySummary from '@/components/patient/dashboard/MedicalHistorySummary';
import UpcomingCalendar from '@/components/patient/dashboard/UpcomingCalendar';
import PatientStatistics from '@/components/patient/dashboard/PatientStatistics';
import QuickActions from '@/components/patient/dashboard/QuickActions';

const PatientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDashboardData = {
        patient: {
          id: 'PAT001',
          firstName: 'John',
          lastName: 'Doe',
          age: 34,
          gender: 'MALE',
          bloodType: 'O+',
          status: 'ACTIVE',
          lastVisit: '2024-01-15',
          nextAppointment: '2024-02-15',
          totalVisits: 18,
          totalAppointments: 24,
          completedAppointments: 20,
        },
        recentAppointments: [
          {
            id: '1',
            date: '2024-01-15',
            time: '10:00 AM',
            type: 'CONSULTATION',
            doctor: 'Dr. Sarah Johnson',
            status: 'COMPLETED',
            description: 'Annual Physical Examination',
          },
          {
            id: '2',
            date: '2024-01-10',
            time: '02:30 PM',
            type: 'LAB_TEST',
            doctor: 'Dr. Michael Chen',
            status: 'COMPLETED',
            description: 'Blood Work',
          },
          {
            id: '3',
            date: '2024-02-15',
            time: '11:00 AM',
            type: 'FOLLOW_UP',
            doctor: 'Dr. Sarah Johnson',
            status: 'SCHEDULED',
            description: 'Follow-up Appointment',
          },
        ],
        upcomingAppointments: [
          {
            id: '3',
            date: '2024-02-15',
            time: '11:00 AM',
            type: 'FOLLOW_UP',
            doctor: 'Dr. Sarah Johnson',
            description: 'Follow-up Appointment',
          },
          {
            id: '4',
            date: '2024-03-01',
            time: '09:00 AM',
            type: 'CONSULTATION',
            doctor: 'Dr. Emily Davis',
            description: 'Cardiology Consultation',
          },
        ],
        medicalHistory: {
          totalRecords: 15,
          recentRecords: 5,
          conditions: ['Hypertension', 'Asthma'],
          medications: ['Lisinopril', 'Albuterol'],
          allergies: ['Peanuts', 'Shellfish'],
          lastUpdate: '2024-01-15',
        },
        statistics: {
          appointmentCompletionRate: 83,
          averageWaitTime: 15,
          patientSatisfaction: 92,
          emergencyVisits: 1,
          totalPrescriptions: 12,
          activePrescriptions: 3,
          labTests: 8,
          abnormalResults: 1,
        },
        notifications: [
          {
            id: '1',
            type: 'APPOINTMENT',
            message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 11:00 AM',
            date: '2024-02-14',
            read: false,
          },
          {
            id: '2',
            type: 'LAB_RESULT',
            message: 'Your blood work results are now available',
            date: '2024-01-16',
            read: true,
          },
          {
            id: '3',
            type: 'PRESCRIPTION',
            message: 'Your prescription for Lisinopril is ready for pickup',
            date: '2024-01-15',
            read: true,
          },
        ],
      };

      setDashboardData(mockDashboardData);
    } catch (error) {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  const handlePrintDashboard = () => {
    window.print();
    toast.success('Dashboard printed');
  };

  const handleExportDashboard = () => {
    toast.success('Dashboard exported');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'schedule_appointment':
        navigate('/appointments/schedule');
        break;
      case 'view_medical_records':
        navigate('/patient/PAT001');
        break;
      case 'request_prescription':
        navigate('/prescriptions/request');
        break;
      case 'contact_doctor':
        navigate('/chat');
        break;
      default:
        toast.success(`${action} action triggered`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No dashboard data available.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Patient Dashboard - HMS</title>
        <meta name="description" content="Patient dashboard with overview, appointments, and medical information" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {dashboardData.patient.firstName[0]}{dashboardData.patient.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                Welcome back, {dashboardData.patient.firstName}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Patient ID: {dashboardData.patient.id} • Last visit: {dashboardData.patient.lastVisit}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Dashboard">
              <IconButton onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Dashboard">
              <IconButton onClick={handlePrintDashboard}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Dashboard">
              <IconButton onClick={handleExportDashboard}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="primary" gutterBottom>
                  {dashboardData.statistics.appointmentCompletionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Appointment Completion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MedicalServices color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success.main" gutterBottom>
                  {dashboardData.patient.totalVisits}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Visits
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="info.main" gutterBottom>
                  {dashboardData.statistics.patientSatisfaction}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Patient Satisfaction
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Notifications color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="warning.main" gutterBottom>
                  {dashboardData.notifications.filter((n: any) => !n.read).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unread Notifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Dashboard Content */}
        <Grid container spacing={3}>
          {/* Patient Overview */}
          <Grid item xs={12} md={8}>
            <PatientOverview patient={dashboardData.patient} />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <QuickActions onAction={handleQuickAction} />
          </Grid>

          {/* Recent Appointments */}
          <Grid item xs={12} md={6}>
            <RecentAppointments appointments={dashboardData.recentAppointments} />
          </Grid>

          {/* Medical History Summary */}
          <Grid item xs={12} md={6}>
            <MedicalHistorySummary history={dashboardData.medicalHistory} />
          </Grid>

          {/* Upcoming Calendar */}
          <Grid item xs={12} md={8}>
            <UpcomingCalendar appointments={dashboardData.upcomingAppointments} />
          </Grid>

          {/* Patient Statistics */}
          <Grid item xs={12} md={4}>
            <PatientStatistics statistics={dashboardData.statistics} />
          </Grid>
        </Grid>

        {/* Notifications Section */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications />
                Recent Notifications
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <Grid container spacing={2}>
              {dashboardData.notifications.slice(0, 3).map((notification: any) => (
                <Grid item xs={12} key={notification.id}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    backgroundColor: notification.read ? 'transparent' : 'action.hover'
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: notification.read ? 'transparent' : 'primary.main' 
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={notification.type.replace('_', ' ')}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PatientDashboardPage; 