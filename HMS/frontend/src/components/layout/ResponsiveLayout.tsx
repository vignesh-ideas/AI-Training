import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Fab,
  Backdrop,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Event,
  MedicalServices,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Search,
  Add,
  Home,
  Assessment,
  Chat,
  Email,
  Analytics,
  Description,
  FileDownload,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title = 'HMS',
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Patients', icon: <People />, path: '/patients' },
    { text: 'Appointments', icon: <Event />, path: '/appointments' },
    { text: 'Medical Records', icon: <MedicalServices />, path: '/medical-records' },
    { text: 'Vitals', icon: <Assessment />, path: '/vitals' },
    { text: 'Lab Results', icon: <Description />, path: '/lab-results' },
    { text: 'Prescriptions', icon: <MedicalServices />, path: '/prescriptions' },
    { text: 'Chat', icon: <Chat />, path: '/chat' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics/patients' },
    { text: 'Reports', icon: <Description />, path: '/reports' },
    { text: 'Export', icon: <FileDownload />, path: '/export' },
    { text: 'Admin', icon: <Settings />, path: '/admin' },
  ];

  const drawerWidth = isMobile ? '100%' : 280;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <MedicalServices color="primary" />
        <Typography variant="h6" component="div">
          HMS
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setDrawerOpen(false);
                }
              }}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>

      {user && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.role}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={user.status}
            size="small"
            color={user.status === 'ACTIVE' ? 'success' : 'warning'}
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth})` },
          ml: { md: drawerWidth },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" size="small">
              <Search />
            </IconButton>

            <IconButton color="inherit" size="small">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              size="small"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth})` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 2, sm: 3, md: 4 },
              height: '100%',
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: theme.zIndex.fab,
          }}
          onClick={() => navigate('/patients/register')}
        >
          <Add />
        </Fab>
      )}

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme.zIndex.drawer + 2,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ResponsiveLayout; 