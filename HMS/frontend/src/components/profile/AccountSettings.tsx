import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  Delete,
  Warning,
  Email,
  Sms,
  PushPin,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface AccountSettingsProps {}

const AccountSettings: React.FC<AccountSettingsProps> = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [medicalAlerts, setMedicalAlerts] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(false);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  // Language and timezone
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for account deletion');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Notifications color="primary" />
            <Typography variant="h6" component="h2">
              Notification Preferences
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive important updates via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Sms />
              </ListItemIcon>
              <ListItemText
                primary="SMS Notifications"
                secondary="Receive urgent alerts via SMS"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PushPin />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive real-time notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Appointment Reminders"
                secondary="Get reminded about upcoming appointments"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={appointmentReminders}
                  onChange={(e) => setAppointmentReminders(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Medical Alerts"
                secondary="Receive important medical notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={medicalAlerts}
                  onChange={(e) => setMedicalAlerts(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="News & Updates"
                secondary="Receive hospital news and updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={newsUpdates}
                  onChange={(e) => setNewsUpdates(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Security color="primary" />
            <Typography variant="h6" component="h2">
              Privacy & Security
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemText
                primary="Profile Visibility"
                secondary="Control who can see your profile information"
              />
              <ListItemSecondaryAction>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="staff">Staff Only</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Data Sharing"
                secondary="Allow data to be used for improving services"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Analytics Tracking"
                secondary="Help improve the system with usage analytics"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={analyticsTracking}
                  onChange={(e) => setAnalyticsTracking(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Language & Timezone */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Language color="primary" />
            <Typography variant="h6" component="h2">
              Language & Timezone
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">Eastern Time</MenuItem>
                <MenuItem value="CST">Central Time</MenuItem>
                <MenuItem value="MST">Mountain Time</MenuItem>
                <MenuItem value="PST">Pacific Time</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Account Management
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Account Status:</strong> Active
              </Typography>
              <Typography variant="body2">
                Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setShowDeleteDialog(true)}
                startIcon={<Delete />}
              >
                Delete Account
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
            </Typography>
          </Alert>

          <Typography variant="body2" paragraph>
            Please provide a reason for deleting your account:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Please explain why you want to delete your account..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={isLoading || !deleteReason.trim()}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings; 