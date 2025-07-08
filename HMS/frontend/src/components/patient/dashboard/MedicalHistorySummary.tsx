import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import {
  MedicalServices,
  Medication,
  Warning,
  History,
  Description,
  TrendingUp,
  Visibility,
} from '@mui/icons-material';

interface MedicalHistorySummaryProps {
  history: any;
}

const MedicalHistorySummary: React.FC<MedicalHistorySummaryProps> = ({ history }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServices />
            Medical History Summary
          </Typography>
          <Button variant="outlined" size="small">
            View Full History
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {history.totalRecords}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h4" color="info.main">
                {history.recentRecords}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Records
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Medical Conditions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServices />
            Medical Conditions
          </Typography>
          {history.conditions && history.conditions.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {history.conditions.map((condition: string, index: number) => (
                <Chip
                  key={index}
                  label={condition}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No medical conditions recorded
            </Typography>
          )}
        </Box>

        {/* Current Medications */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Medication />
            Current Medications
          </Typography>
          {history.medications && history.medications.length > 0 ? (
            <List dense>
              {history.medications.map((medication: string, index: number) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Medication color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={medication}
                    secondary="Active prescription"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No current medications
            </Typography>
          )}
        </Box>

        {/* Allergies */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            Allergies
          </Typography>
          {history.allergies && history.allergies.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {history.allergies.map((allergy: string, index: number) => (
                <Chip
                  key={index}
                  label={allergy}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No known allergies
            </Typography>
          )}
        </Box>

        {/* Recent Activity */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History />
            Recent Activity
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary="Medical records updated"
                secondary={history.lastUpdate}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <TrendingUp />
              </ListItemIcon>
              <ListItemText
                primary="Health trend analysis"
                secondary="Last 30 days"
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              <ListItemText
                primary="Records reviewed"
                secondary="By Dr. Sarah Johnson"
              />
            </ListItem>
          </List>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">
              View Records
            </Button>
            <Button variant="outlined" size="small">
              Download History
            </Button>
            <Button variant="outlined" size="small">
              Share with Doctor
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MedicalHistorySummary; 