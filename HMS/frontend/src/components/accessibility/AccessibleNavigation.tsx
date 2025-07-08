import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
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
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  subItems?: NavigationItem[];
}

interface AccessibleNavigationProps {
  title?: string;
  onMenuToggle?: () => void;
}

const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({
  title = 'HMS',
  onMenuToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      text: 'Patients',
      icon: <People />,
      path: '/patients',
    },
    {
      text: 'Appointments',
      icon: <Event />,
      path: '/appointments',
    },
    {
      text: 'Medical Records',
      icon: <MedicalServices />,
      path: '/medical-records',
      subItems: [
        { text: 'View Records', icon: <MedicalServices />, path: '/medical-records' },
        { text: 'Create Record', icon: <Add />, path: '/medical-records/create' },
        { text: 'Vitals', icon: <Assessment />, path: '/vitals' },
        { text: 'Lab Results', icon: <Description />, path: '/lab-results' },
        { text: 'Prescriptions', icon: <MedicalServices />, path: '/prescriptions' },
      ],
    },
    {
      text: 'Communication',
      icon: <Chat />,
      path: '/chat',
      subItems: [
        { text: 'Chat', icon: <Chat />, path: '/chat' },
        { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
        { text: 'Email', icon: <Email />, path: '/notifications/email' },
      ],
    },
    {
      text: 'Analytics',
      icon: <Analytics />,
      path: '/analytics/patients',
      subItems: [
        { text: 'Patient Analytics', icon: <Analytics />, path: '/analytics/patients' },
        { text: 'Hospital Analytics', icon: <Analytics />, path: '/analytics/hospital' },
        { text: 'Reports', icon: <Description />, path: '/reports' },
        { text: 'Export', icon: <FileDownload />, path: '/export' },
      ],
    },
    {
      text: 'Admin',
      icon: <Settings />,
      path: '/admin',
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
    onMenuToggle?.();
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleExpandItem = (itemText: string) => {
    setExpandedItems(prev =>
      prev.includes(itemText)
        ? prev.filter(item => item !== itemText)
        : [...prev, itemText]
    );
  };

  const isItemExpanded = (itemText: string) => expandedItems.includes(itemText);

  const isItemActive = (path: string) => location.pathname === path;

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isItemActive(item.path);
    const isExpanded = isItemExpanded(item.text);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <Box key={item.text}>
        <ListItem
          button
          onClick={() => {
            if (hasSubItems) {
              handleExpandItem(item.text);
            } else {
              handleNavigation(item.path);
            }
          }}
          selected={isActive}
          sx={{
            pl: level * 2 + 2,
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }}
          aria-expanded={hasSubItems ? isExpanded : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: level > 0 ? '0.875rem' : '1rem',
            }}
          />
          {item.badge && (
            <Badge badgeContent={item.badge} color="error" />
          )}
          {hasSubItems && (
            <KeyboardArrowDown
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          )}
        </ListItem>
        {hasSubItems && isExpanded && (
          <Box>
            {item.subItems!.map((subItem) => renderNavigationItem(subItem, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const drawerWidth = isMobile ? '100%' : 280;

  const drawer = (
    <Box
      role="navigation"
      aria-label="Main navigation"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
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
          {title}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List component="nav" aria-label="Main navigation">
          {navigationItems.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      {user && (
        <Box
          role="complementary"
          aria-label="User profile"
          sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
        >
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
    <>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth})` },
          ml: { md: drawerWidth },
          zIndex: theme.zIndex.drawer + 1,
        }}
        role="banner"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open navigation menu"
            edge="start"
            onClick={handleDrawerToggle}
            ref={menuButtonRef}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1 }}
            id="page-title"
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            role="toolbar"
            aria-label="App bar actions"
          >
            <IconButton
              color="inherit"
              size="small"
              aria-label="Search"
            >
              <Search />
            </IconButton>

            <IconButton
              color="inherit"
              size="small"
              aria-label="Notifications"
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              size="small"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={handleProfileMenuOpen}
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
          keepMounted: true,
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
        role="menu"
        aria-label="User menu"
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/profile');
          }}
          role="menuitem"
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/settings');
          }}
          role="menuitem"
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          role="menuitem"
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccessibleNavigation; 