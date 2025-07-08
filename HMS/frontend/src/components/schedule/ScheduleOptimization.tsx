import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Optimization,
  Analytics,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Info,
  Schedule,
  Person,
  LocationOn,
  AccessTime,
  Timeline,
  Assessment,
  Lightbulb,
  AutoFixHigh,
} from '@mui/icons-material';

interface OptimizationSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  priority: number;
  estimatedSavings: number;
  affectedResources: string[];
  implementation: string;
}

interface ScheduleAnalytics {
  totalDoctors: number;
  totalHours: number;
  averageUtilization: number;
  conflictCount: number;
  efficiencyScore: number;
  departmentStats: {
    name: string;
    utilization: number;
    conflicts: number;
    efficiency: number;
  }[];
}

interface ScheduleOptimizationProps {
  analytics: ScheduleAnalytics;
  suggestions: OptimizationSuggestion[];
  onApplySuggestion: (suggestionId: string) => Promise<void>;
  onGenerateReport: () => Promise<void>;
  loading?: boolean;
}

const ScheduleOptimization: React.FC<ScheduleOptimizationProps> = ({
  analytics,
  suggestions,
  onApplySuggestion,
  onGenerateReport,
  loading = false,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);
  const [applyDialog, setApplyDialog] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getEfficiencyIcon = (score: number) => {
    if (score >= 80) return <TrendingUp />;
    if (score >= 60) return <TrendingDown />;
    return <Warning />;
  };

  const sortedSuggestions = suggestions.sort((a, b) => {
    // Sort by priority (HIGH first), then by estimated savings
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const aPriority = priorityOrder[a.impact as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.impact as keyof typeof priorityOrder] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return b.estimatedSavings - a.estimatedSavings;
  });

  const handleApplySuggestion = async () => {
    if (!selectedSuggestion) return;

    try {
      await onApplySuggestion(selectedSuggestion.id);
      setApplyDialog(false);
      setSelectedSuggestion(null);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  return (
    <>
      {/* Analytics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                <Typography variant="h4">
                  {analytics.totalDoctors}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Doctors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="primary" />
                <Typography variant="h4">
                  {analytics.totalHours}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment color="primary" />
                <Typography variant="h4">
                  {analytics.averageUtilization}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg Utilization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getEfficiencyIcon(analytics.efficiencyScore)}
                <Typography variant="h4" color={`${getEfficiencyColor(analytics.efficiencyScore)}.main`}>
                  {analytics.efficiencyScore}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Efficiency Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Analytics */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Analytics />
            Department Performance
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Conflicts</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.departmentStats.map((dept) => (
                  <TableRow key={dept.name}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {dept.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {dept.utilization}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={dept.utilization}
                          sx={{ width: 60, height: 6 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={dept.conflicts}
                        color={dept.conflicts > 0 ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {dept.efficiency}%
                        </Typography>
                        {getEfficiencyIcon(dept.efficiency)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={dept.efficiency >= 80 ? 'Excellent' : dept.efficiency >= 60 ? 'Good' : 'Needs Improvement'}
                        color={getEfficiencyColor(dept.efficiency) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb />
              Optimization Suggestions ({suggestions.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AutoFixHigh />}
              onClick={onGenerateReport}
              disabled={loading}
            >
              Generate Report
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LinearProgress sx={{ width: '100%' }} />
            </Box>
          ) : suggestions.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body2">
                No optimization suggestions available. Schedule is already optimized.
              </Typography>
            </Alert>
          ) : (
            <List>
              {sortedSuggestions.map((suggestion) => (
                <React.Fragment key={suggestion.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Optimization color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {suggestion.title}
                          </Typography>
                          <Chip
                            label={suggestion.impact}
                            color={getImpactColor(suggestion.impact) as any}
                            size="small"
                          />
                          <Chip
                            label={suggestion.effort}
                            color={getEffortColor(suggestion.effort) as any}
                            size="small"
                          />
                          <Chip
                            label={`$${suggestion.estimatedSavings.toLocaleString()}`}
                            color="success"
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {suggestion.description}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setExpandedSuggestion(
                            expandedSuggestion === suggestion.id ? null : suggestion.id
                          )}
                        >
                          {expandedSuggestion === suggestion.id ? <Timeline /> : <Info />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Apply Suggestion">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setApplyDialog(true);
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>

                  {/* Expanded Details */}
                  <Collapse in={expandedSuggestion === suggestion.id}>
                    <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Expected Impact
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {suggestion.impact}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Implementation Effort
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {suggestion.effort}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Implementation Steps
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {suggestion.implementation}
                          </Typography>
                        </Grid>
                        {suggestion.affectedResources.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              Affected Resources
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {suggestion.affectedResources.map((resource, index) => (
                                <Chip
                                  key={index}
                                  label={resource}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                  
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Apply Suggestion Dialog */}
      <Dialog
        open={applyDialog}
        onClose={() => setApplyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Apply Optimization Suggestion
        </DialogTitle>
        <DialogContent>
          {selectedSuggestion && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Suggestion Details
                </Typography>
                <Typography variant="body2">
                  {selectedSuggestion.description}
                </Typography>
              </Alert>

              <Typography variant="subtitle2" gutterBottom>
                Expected Benefits
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Estimated savings: ${selectedSuggestion.estimatedSavings.toLocaleString()}
                • Impact level: {selectedSuggestion.impact}
                • Implementation effort: {selectedSuggestion.effort}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Implementation Steps
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedSuggestion.implementation}
              </Typography>

              <Alert severity="warning">
                <Typography variant="body2">
                  This action will automatically apply the optimization suggestion to your schedule. 
                  The changes will be reflected immediately.
                </Typography>
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApplySuggestion}
            startIcon={<AutoFixHigh />}
          >
            Apply Suggestion
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduleOptimization; 