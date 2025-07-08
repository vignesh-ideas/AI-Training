import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { Person, Security, Notifications, PhotoCamera } from '@mui/icons-material';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import AccountSettings from '@/components/profile/AccountSettings';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Profile - HMS</title>
        <meta name="description" content="Manage your HMS profile and account settings" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your personal information, security settings, and account preferences
        </Typography>

        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              sx={{ px: 3, pt: 2 }}
            >
              <Tab
                icon={<Person />}
                label="Profile"
                id="profile-tab-0"
                aria-controls="profile-tabpanel-0"
              />
              <Tab
                icon={<PhotoCamera />}
                label="Photo"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
              <Tab
                icon={<Security />}
                label="Security"
                id="profile-tab-2"
                aria-controls="profile-tabpanel-2"
              />
              <Tab
                icon={<Notifications />}
                label="Settings"
                id="profile-tab-3"
                aria-controls="profile-tabpanel-3"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ProfileForm />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ProfilePictureUpload />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <PasswordChangeForm />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AccountSettings />
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
};

export default ProfilePage; 