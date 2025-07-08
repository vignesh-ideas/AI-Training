import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  People,
  Event,
  MedicalServices,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNavigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobile) {
    return null;
  }

  const navigationItems = [
    {
      label: 'Home',
      icon: <Home />,
      path: '/dashboard',
      badge: 0,
    },
    {
      label: 'Patients',
      icon: <People />,
      path: '/patients',
      badge: 0,
    },
    {
      label: 'Appointments',
      icon: <Event />,
      path: '/appointments',
      badge: 3,
    },
    {
      label: 'Medical',
      icon: <MedicalServices />,
      path: '/medical-records',
      badge: 0,
    },
    {
      label: 'Notifications',
      icon: <Notifications />,
      path: '/notifications',
      badge: 4,
    },
  ];

  const currentValue = navigationItems.findIndex(
    (item) => location.pathname.startsWith(item.path)
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentValue >= 0 ? currentValue : 0}
        onChange={(event, newValue) => {
          navigate(navigationItems[newValue].path);
        }}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: '4px',
          },
        }}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={
              item.badge > 0 ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )
            }
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation; 