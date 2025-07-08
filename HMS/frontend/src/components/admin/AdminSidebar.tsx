import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  Security,
  Notifications,
  Analytics,
  Storage,
  Backup,
  Logout,
  ExpandLess,
  ExpandMore,
  Person,
  LocalHospital,
  Medication,
  Science,
  Assignment,
  Schedule,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface AdminSidebarProps {}

const AdminSidebar: React.FC<AdminSidebarProps> = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [userManagementOpen, setUserManagementOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const drawerWidth = 280;

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin',
      primary: true,
    },
    {
      title: 'User Management',
      icon: <People />,
      children: [
        { title: 'All Users', icon: <People />, path: '/admin/users' },
        { title: 'Doctors', icon: <LocalHospital />, path: '/admin/doctors' },
        { title: 'Nurses', icon: <Person />, path: '/admin/nurses' },
        { title: 'Patients', icon: <Person />, path: '/admin/patients' },
        { title: 'Pharmacists', icon: <Medication />, path: '/admin/pharmacists' },
        { title: 'Lab Technicians', icon: <Science />, path: '/admin/lab-technicians' },
      ],
    },
    {
      title: 'System Management',
      icon: <Settings />,
      children: [
        { title: 'System Settings', icon: <Settings />, path: '/admin/settings' },
        { title: 'Security', icon: <Security />, path: '/admin/security' },
        { title: 'Backup & Restore', icon: <Backup />, path: '/admin/backup' },
        { title: 'Storage Management', icon: <Storage />, path: '/admin/storage' },
      ],
    },
    {
      title: 'Reports & Analytics',
      icon: <Analytics />,
      children: [
        { title: 'User Analytics', icon: <Assessment />, path: '/admin/analytics/users' },
        { title: 'System Reports', icon: <Assignment />, path: '/admin/reports/system' },
        { title: 'Activity Logs', icon: <Schedule />, path: '/admin/logs' },
      ],
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      path: '/admin/notifications',
    },
  ];

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = item.title === 'User Management' ? userManagementOpen :
                   item.title === 'System Management' ? systemOpen :
                   item.title === 'Reports & Analytics' ? reportsOpen : false;

    return (
      <Box key={item.title}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              pl: 2 + level * 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => {
              if (hasChildren) {
                if (item.title === 'User Management') {
                  setUserManagementOpen(!userManagementOpen);
                } else if (item.title === 'System Management') {
                  setSystemOpen(!systemOpen);
                } else if (item.title === 'Reports & Analytics') {
                  setReportsOpen(!reportsOpen);
                }
              } else {
                // Handle navigation
                toast.info(`Navigating to ${item.path}`);
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: item.primary ? 'bold' : 'normal',
                    color: item.primary ? 'primary.main' : 'text.primary',
                  }}
                >
                  {item.title}
                </Typography>
              }
            />
            {hasChildren && (
              <IconButton size="small">
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              HMS Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hospital Management System
            </Typography>
          </Box>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user.profilePicture} sx={{ width: 32, height: 32 }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label="Administrator"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>

      <Divider />
      
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            },
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 