import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Medication,
  Warning,
  CheckCircle,
  Schedule,
  LocalHospital,
} from '@mui/icons-material';

interface PatientStatisticsProps {
  statistics: any;
}

const PatientStatistics: React.FC<PatientStatisticsProps> = ({ statistics }) => {
  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) {
      return <TrendingUp color="success" />;
    } else if (value < threshold) {
      return <TrendingDown color="error" />;
    }
    return <Assessment color="info" />;
  };

  const getProgressColor = (value: number, threshold: number = 50) => {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.7) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment />
          Health Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Key Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h4" color="success.main">
                {statistics.appointmentCompletionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h4" color="info.main">
                {statistics.patientSatisfaction}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Satisfaction
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progress Indicators */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Health Metrics
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Appointment Completion</Typography>
              <Typography variant="body2">{statistics.appointmentCompletionRate}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={statistics.appointmentCompletionRate}
              color={getProgressColor(statistics.appointmentCompletionRate) as any}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Patient Satisfaction</Typography>
              <Typography variant="body2">{statistics.patientSatisfaction}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={statistics.patientSatisfaction}
              color={getProgressColor(statistics.patientSatisfaction) as any}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Average Wait Time</Typography>
              <Typography variant="body2">{statistics.averageWaitTime} min</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((statistics.averageWaitTime / 30) * 100, 100)}
              color={statistics.averageWaitTime <= 15 ? 'success' : statistics.averageWaitTime <= 25 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {/* Health Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Health Summary
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText
                primary="Total Prescriptions"
                secondary={statistics.totalPrescriptions}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Medication />
              </ListItemIcon>
              <ListItemText
                primary="Active Prescriptions"
                secondary={statistics.activePrescriptions}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText
                primary="Lab Tests"
                secondary={statistics.labTests}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Warning />
              </ListItemIcon>
              <ListItemText
                primary="Abnormal Results"
                secondary={statistics.abnormalResults}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <LocalHospital />
              </ListItemIcon>
              <ListItemText
                primary="Emergency Visits"
                secondary={statistics.emergencyVisits}
              />
            </ListItem>
          </List>
        </Box>

        {/* Health Trends */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Health Trends
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                {getTrendIcon(statistics.appointmentCompletionRate, 80)}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Appointment Trend
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                {getTrendIcon(statistics.patientSatisfaction, 85)}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Satisfaction Trend
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                {getTrendIcon(statistics.averageWaitTime, 15, true)}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Wait Time Trend
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                {getTrendIcon(statistics.emergencyVisits, 0, true)}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Emergency Trend
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Health Recommendations */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Recommendations
          </Typography>
          <List dense>
            {statistics.appointmentCompletionRate < 80 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Improve appointment attendance"
                  secondary="Consider reminder notifications"
                />
              </ListItem>
            )}
            {statistics.averageWaitTime > 20 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Schedule color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="High wait times detected"
                  secondary="Consider scheduling optimization"
                />
              </ListItem>
            )}
            {statistics.abnormalResults > 0 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Warning color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Abnormal lab results"
                  secondary="Schedule follow-up consultation"
                />
              </ListItem>
            )}
            {statistics.emergencyVisits > 0 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <LocalHospital color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Emergency visits recorded"
                  secondary="Review preventive care plan"
                />
              </ListItem>
            )}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientStatistics; 