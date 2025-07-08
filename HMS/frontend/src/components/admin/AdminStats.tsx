import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  People,
  PersonAdd,
  Block,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
  Schedule,
  Security,
  Notifications,
} from '@mui/icons-material';
import { UserRole, UserStatus } from '@/types/auth';

interface AdminStatsProps {}

interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  color: string;
}

const AdminStats: React.FC<AdminStatsProps> = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats: StatCard[] = [
      {
        title: 'Total Users',
        value: 1247,
        change: 12.5,
        icon: <People />,
        color: '#1976d2',
      },
      {
        title: 'Active Users',
        value: 1189,
        change: 8.2,
        icon: <CheckCircle />,
        color: '#2e7d32',
      },
      {
        title: 'New Users (This Month)',
        value: 89,
        change: -3.1,
        icon: <PersonAdd />,
        color: '#ed6c02',
      },
      {
        title: 'Suspended Users',
        value: 23,
        change: 15.4,
        icon: <Block />,
        color: '#d32f2f',
      },
    ];

    const mockSystemMetrics: SystemMetric[] = [
      {
        name: 'System Performance',
        value: 85,
        max: 100,
        color: '#2e7d32',
      },
      {
        name: 'Storage Usage',
        value: 67,
        max: 100,
        color: '#ed6c02',
      },
      {
        name: 'Network Load',
        value: 42,
        max: 100,
        color: '#1976d2',
      },
      {
        name: 'Security Status',
        value: 98,
        max: 100,
        color: '#2e7d32',
      },
    ];

    const mockRecentActivity = [
      {
        id: 1,
        type: 'user_registration',
        message: 'New user registered: Dr. Sarah Johnson',
        time: '2 minutes ago',
        icon: <PersonAdd />,
        color: '#2e7d32',
      },
      {
        id: 2,
        type: 'user_suspension',
        message: 'User suspended: mike.wilson@example.com',
        time: '15 minutes ago',
        icon: <Block />,
        color: '#d32f2f',
      },
      {
        id: 3,
        type: 'system_alert',
        message: 'High storage usage detected',
        time: '1 hour ago',
        icon: <Warning />,
        color: '#ed6c02',
      },
      {
        id: 4,
        type: 'security_scan',
        message: 'Security scan completed successfully',
        time: '2 hours ago',
        icon: <Security />,
        color: '#2e7d32',
      },
    ];

    setStats(mockStats);
    setSystemMetrics(mockSystemMetrics);
    setRecentActivity(mockRecentActivity);
  }, []);

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'success' : 'error';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Quick Stats */}
      <Typography variant="h6" gutterBottom>
        Quick Stats
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {getChangeIcon(stat.change)}
                  <Typography
                    variant="caption"
                    color={getChangeColor(stat.change)}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(stat.change)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Metrics */}
      <Typography variant="h6" gutterBottom>
        System Metrics
      </Typography>

      <Card>
        <CardContent>
          {systemMetrics.map((metric, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{metric.name}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {metric.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(metric.value / metric.max) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                  },
                }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>

      <Card>
        <CardContent>
          <List>
            {recentActivity.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon sx={{ color: activity.color }}>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.message}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                {index < recentActivity.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              fullWidth
              onClick={() => toast.info('Add user functionality coming soon')}
            >
              Add New User
            </Button>
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              fullWidth
              onClick={() => toast.info('System maintenance coming soon')}
            >
              Schedule Maintenance
            </Button>
            <Button
              variant="outlined"
              startIcon={<Security />}
              fullWidth
              onClick={() => toast.info('Security scan coming soon')}
            >
              Run Security Scan
            </Button>
            <Button
              variant="outlined"
              startIcon={<Notifications />}
              fullWidth
              onClick={() => toast.info('Notification settings coming soon')}
            >
              Manage Notifications
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* System Status */}
      <Alert severity="success" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>System Status:</strong> All systems operational
        </Typography>
        <Typography variant="caption" display="block">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Alert>
    </Box>
  );
};

export default AdminStats; 