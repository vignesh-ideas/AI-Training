import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  People,
  PersonAdd,
  Search,
  FilterList,
  Download,
  Refresh,
  Settings,
} from '@mui/icons-material';
import UserManagement from '@/components/admin/UserManagement';
import AdminStats from '@/components/admin/AdminStats';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - HMS</title>
        <meta name="description" content="HMS Admin Dashboard for user management" />
      </Helmet>

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        
        <Box sx={{ flexGrow: 1, backgroundColor: 'grey.50' }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage users, monitor system activity, and configure administrative settings
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Welcome, Administrator!</strong> You have access to all administrative functions.
                Use the sidebar to navigate between different management sections.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Paper elevation={2} sx={{ borderRadius: 2 }}>
                  <UserManagement />
                </Paper>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <AdminStats />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard; 