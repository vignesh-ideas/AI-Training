import React, { useState, useEffect } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Grid,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  TextField,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Timeline,
  Conflict,
  Schedule,
  Person,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';

interface ScheduleConflict {
  id: string;
  type: string;
  severity: string;
  description: string;
  affectedDoctors: string[];
  affectedResources: string[];
  startTime: string;
  endTime: string;
  date: string;
  suggestedResolution: string;
  impact: string;
  priority: number;
}

interface ScheduleConflictDetectionProps {
  conflicts: ScheduleConflict[];
  onResolve: (conflictId: string, resolution: string) => Promise<void>;
  onIgnore: (conflictId: string) => Promise<void>;
  loading?: boolean;
}

const ScheduleConflictDetection: React.FC<ScheduleConflictDetectionProps> = ({
  conflicts,
  onResolve,
  onIgnore,
  loading = false,
}) => {
  const [expandedConflict, setExpandedConflict] = useState<string | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<ScheduleConflict | null>(null);
  const [resolveDialog, setResolveDialog] = useState(false);
  const [resolution, setResolution] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <Error />;
      case 'MEDIUM':
        return <Warning />;
      case 'LOW':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'OVERLAP':
        return <Timeline />;
      case 'RESOURCE_CONFLICT':
        return <LocationOn />;
      case 'CAPACITY_OVERFLOW':
        return <Person />;
      case 'TIME_CONFLICT':
        return <AccessTime />;
      default:
        return <Conflict />;
    }
  };

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case 'OVERLAP':
        return 'error';
      case 'RESOURCE_CONFLICT':
        return 'warning';
      case 'CAPACITY_OVERFLOW':
        return 'info';
      case 'TIME_CONFLICT':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleResolve = async () => {
    if (!selectedConflict || !resolution.trim()) return;

    try {
      await onResolve(selectedConflict.id, resolution);
      setResolveDialog(false);
      setSelectedConflict(null);
      setResolution('');
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    }
  };

  const handleIgnore = async (conflictId: string) => {
    try {
      await onIgnore(conflictId);
    } catch (error) {
      console.error('Failed to ignore conflict:', error);
    }
  };

  const sortedConflicts = conflicts.sort((a, b) => {
    // Sort by priority (HIGH first), then by severity
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const aPriority = priorityOrder[a.severity as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.severity as keyof typeof priorityOrder] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return b.priority - a.priority;
  });

  const getConflictStats = () => {
    const highConflicts = conflicts.filter(c => c.severity === 'HIGH').length;
    const mediumConflicts = conflicts.filter(c => c.severity === 'MEDIUM').length;
    const lowConflicts = conflicts.filter(c => c.severity === 'LOW').length;
    
    return { highConflicts, mediumConflicts, lowConflicts };
  };

  const stats = getConflictStats();

  return (
    <>
      {/* Conflict Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error color="error" />
                <Typography variant="h6" color="error.main">
                  {stats.highConflicts}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                High Priority Conflicts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="warning" />
                <Typography variant="h6" color="warning.main">
                  {stats.mediumConflicts}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Medium Priority Conflicts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="info" />
                <Typography variant="h6" color="info.main">
                  {stats.lowConflicts}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Low Priority Conflicts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Conflicts List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Conflict />
            Detected Conflicts ({conflicts.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LinearProgress sx={{ width: '100%' }} />
            </Box>
          ) : conflicts.length === 0 ? (
            <Alert severity="success">
              <Typography variant="body2">
                No conflicts detected. All schedules are properly aligned.
              </Typography>
            </Alert>
          ) : (
            <List>
              {sortedConflicts.map((conflict) => (
                <React.Fragment key={conflict.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getSeverityIcon(conflict.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {conflict.description}
                          </Typography>
                          <Chip
                            label={conflict.type.replace('_', ' ')}
                            color={getConflictTypeColor(conflict.type) as any}
                            size="small"
                            icon={getConflictTypeIcon(conflict.type)}
                          />
                          <Chip
                            label={conflict.severity}
                            color={getSeverityColor(conflict.severity) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date: {new Date(conflict.date).toLocaleDateString()} | 
                            Time: {conflict.startTime} - {conflict.endTime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Affected: {conflict.affectedDoctors.join(', ')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setExpandedConflict(
                            expandedConflict === conflict.id ? null : conflict.id
                          )}
                        >
                          {expandedConflict === conflict.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Resolve Conflict">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedConflict(conflict);
                            setResolveDialog(true);
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ignore Conflict">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => handleIgnore(conflict.id)}
                        >
                          <Schedule />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>

                  {/* Expanded Details */}
                  <Collapse in={expandedConflict === conflict.id}>
                    <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Impact Analysis
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conflict.impact}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Suggested Resolution
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conflict.suggestedResolution}
                          </Typography>
                        </Grid>
                        {conflict.affectedResources.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              Affected Resources
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {conflict.affectedResources.map((resource, index) => (
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

      {/* Resolve Conflict Dialog */}
      <Dialog
        open={resolveDialog}
        onClose={() => setResolveDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Resolve Conflict
        </DialogTitle>
        <DialogContent>
          {selectedConflict && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Conflict Details
                </Typography>
                <Typography variant="body2">
                  {selectedConflict.description}
                </Typography>
              </Alert>

              <Typography variant="subtitle2" gutterBottom>
                Suggested Resolution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedConflict.suggestedResolution}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Your Resolution
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how you will resolve this conflict..."
                helperText="Provide details about the resolution approach"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResolve}
            disabled={!resolution.trim()}
          >
            Resolve Conflict
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduleConflictDetection; 