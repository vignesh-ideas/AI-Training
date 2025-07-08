import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';
import {
  Accessibility,
  Visibility,
  VisibilityOff,
  Speed,
  TextFields,
  Keyboard,
  VolumeUp,
  VolumeOff,
  Settings,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useAccessibilityContext } from './AccessibilityProvider';

interface AccessibilityControlsProps {
  compact?: boolean;
  showLabels?: boolean;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  compact = false,
  showLabels = true,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const {
    highContrast,
    reducedMotion,
    largeText,
    isKeyboardUser,
    isScreenReaderUser,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    announceToScreenReader,
  } = useAccessibilityContext();

  const handleToggle = (action: () => void, feature: string) => {
    action();
    announceToScreenReader(`${feature} ${action === toggleHighContrast ? (highContrast ? 'disabled' : 'enabled') : 
      action === toggleReducedMotion ? (reducedMotion ? 'disabled' : 'enabled') : 
      (largeText ? 'disabled' : 'enabled')}`);
  };

  const controls = [
    {
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: highContrast ? <Visibility /> : <VisibilityOff />,
      checked: highContrast,
      onChange: () => handleToggle(toggleHighContrast, 'High contrast'),
      disabled: false,
    },
    {
      label: 'Reduced Motion',
      description: 'Reduce animations and transitions',
      icon: <Speed />,
      checked: reducedMotion,
      onChange: () => handleToggle(toggleReducedMotion, 'Reduced motion'),
      disabled: false,
    },
    {
      label: 'Large Text',
      description: 'Increase text size for better readability',
      icon: <TextFields />,
      checked: largeText,
      onChange: () => handleToggle(toggleLargeText, 'Large text'),
      disabled: false,
    },
  ];

  if (compact) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: theme.zIndex.fab,
        }}
      >
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }}
          aria-label="Accessibility controls"
          aria-expanded={expanded}
        >
          <Accessibility />
        </IconButton>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Card
            sx={{
              position: 'absolute',
              bottom: 60,
              right: 0,
              width: 280,
              boxShadow: theme.shadows[8],
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Accessibility
              </Typography>
              <List dense>
                {controls.map((control) => (
                  <ListItem key={control.label} disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {control.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={control.label}
                      secondary={control.description}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={control.checked}
                        onChange={control.onChange}
                        disabled={control.disabled}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Accessibility color="primary" />
            <Typography variant="h6" component="h2">
              Accessibility Settings
            </Typography>
          </Box>
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            size="small"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide' : 'Show'} Settings
          </Button>
        </Box>

        <Collapse in={expanded} timeout="auto">
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Customize your experience for better accessibility
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              {controls.map((control) => (
                <ListItem key={control.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {control.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={control.label}
                    secondary={control.description}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={control.checked}
                      onChange={control.onChange}
                      disabled={control.disabled}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <Keyboard sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                Keyboard Navigation: {isKeyboardUser ? 'Detected' : 'Not detected'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <VolumeUp sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                Screen Reader: {isScreenReaderUser ? 'Detected' : 'Not detected'}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                These settings are saved in your browser and will persist across sessions.
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AccessibilityControls; 