import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person,
  CalendarToday,
  MedicalServices,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
  Bloodtype,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

interface PatientOverviewProps {
  patient: any;
}

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  const getHealthStatus = () => {
    const completionRate = patient.completedAppointments / patient.totalAppointments;
    if (completionRate >= 0.8) return { status: 'Good', color: 'success', icon: <CheckCircle /> };
    if (completionRate >= 0.6) return { status: 'Fair', color: 'warning', icon: <Warning /> };
    return { status: 'Needs Attention', color: 'error', icon: <Error /> };
  };

  const healthStatus = getHealthStatus();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person />
          Patient Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                {patient.firstName[0]}{patient.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Patient ID: {patient.id}
                </Typography>
                <Chip
                  label={patient.status}
                  color={patient.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Age & Gender"
                  secondary={`${patient.age} years old • ${patient.gender}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Bloodtype />
                </ListItemIcon>
                <ListItemText
                  primary="Blood Type"
                  secondary={patient.bloodType}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Last Visit"
                  secondary={patient.lastVisit}
                />
              </ListItem>
              {patient.nextAppointment && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Next Appointment"
                    secondary={patient.nextAppointment}
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Health Status */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Health Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {healthStatus.icon}
                <Chip
                  label={healthStatus.status}
                  color={healthStatus.color as any}
                  size="medium"
                />
              </Box>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <MedicalServices />
                </ListItemIcon>
                <ListItemText
                  primary="Total Visits"
                  secondary={patient.totalVisits}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Total Appointments"
                  secondary={patient.totalAppointments}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText
                  primary="Completed Appointments"
                  secondary={patient.completedAppointments}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText
                  primary="Completion Rate"
                  secondary={`${Math.round((patient.completedAppointments / patient.totalAppointments) * 100)}%`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {/* Health Trends */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {patient.completedAppointments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed This Year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main">
                    {patient.totalAppointments - patient.completedAppointments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Appointments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {Math.round((patient.completedAppointments / patient.totalAppointments) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Health Recommendations */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Health Recommendations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: 'success.light' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="success.dark" gutterBottom>
                    ✅ Good Practices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Regular check-ups maintained
                    <br />
                    • Appointment completion rate is good
                    <br />
                    • Active patient engagement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: 'info.light' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="info.dark" gutterBottom>
                    💡 Suggestions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Consider annual physical examination
                    <br />
                    • Schedule follow-up appointments
                    <br />
                    • Review medication compliance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientOverview; 