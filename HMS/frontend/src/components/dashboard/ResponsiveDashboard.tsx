import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  People,
  Event,
  MedicalServices,
  Notifications,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Add,
} from '@mui/icons-material';
import useResponsive from '@/hooks/useResponsive';
import ResponsiveCard from '@/components/layout/ResponsiveCard';

interface DashboardStat {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface DashboardProps {
  loading?: boolean;
}

const ResponsiveDashboard: React.FC<DashboardProps> = ({ loading = false }) => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const stats: DashboardStat[] = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: 12.5,
      icon: <People />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Appointments',
      value: '89',
      change: -2.3,
      icon: <Event />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Medical Records',
      value: '456',
      change: 8.7,
      icon: <MedicalServices />,
      color: theme.palette.success.main,
    },
    {
      title: 'Notifications',
      value: '23',
      change: 15.2,
      icon: <Notifications />,
      color: theme.palette.warning.main,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New patient registered',
      description: 'John Doe registered as a new patient',
      time: '2 minutes ago',
      type: 'patient',
    },
    {
      id: 2,
      title: 'Appointment scheduled',
      description: 'Dr. Smith scheduled for tomorrow at 10:00 AM',
      time: '15 minutes ago',
      type: 'appointment',
    },
    {
      id: 3,
      title: 'Medical record updated',
      description: 'Patient ID 12345 medical record was updated',
      time: '1 hour ago',
      type: 'record',
    },
    {
      id: 4,
      title: 'Lab results received',
      description: 'Blood test results for Patient ID 67890',
      time: '2 hours ago',
      type: 'lab',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient':
        return <People fontSize="small" />;
      case 'appointment':
        return <Event fontSize="small" />;
      case 'record':
        return <MedicalServices fontSize="small" />;
      case 'lab':
        return <MedicalServices fontSize="small" />;
      default:
        return <Notifications fontSize="small" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'patient':
        return theme.palette.primary.main;
      case 'appointment':
        return theme.palette.secondary.main;
      case 'record':
        return theme.palette.success.main;
      case 'lab':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Welcome Section */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Welcome back, Admin!
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Here's what's happening in your hospital today
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  component="div"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    mb: 1,
                  }}
                >
                  {stat.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.change > 0 ? (
                    <TrendingUp fontSize="small" color="success" />
                  ) : (
                    <TrendingDown fontSize="small" color="error" />
                  )}
                  <Typography
                    variant="caption"
                    color={stat.change > 0 ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 600 }}
                  >
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  Recent Activities
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: `${getActivityColor(activity.type)}15`,
                        color: getActivityColor(activity.type),
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          mb: 0.5,
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          mb: 0.5,
                        }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                component="h2"
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Quick Actions
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Add Patient', icon: <People />, color: 'primary' },
                  { label: 'Schedule Appointment', icon: <Event />, color: 'secondary' },
                  { label: 'Create Medical Record', icon: <MedicalServices />, color: 'success' },
                  { label: 'View Notifications', icon: <Notifications />, color: 'warning' },
                ].map((action, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'grey.50',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: `${theme.palette[action.color as any].main}15`,
                        color: theme.palette[action.color as any].main,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {action.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsiveDashboard; 