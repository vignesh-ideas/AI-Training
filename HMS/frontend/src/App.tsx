import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/hooks/useAuth';
import AccessibilityProvider from '@/components/accessibility/AccessibilityProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminDashboard from '@/pages/AdminDashboard';
import PatientRegistrationPage from '@/pages/PatientRegistrationPage';
import PatientProfilePage from '@/pages/PatientProfilePage';
import PatientSearchPage from '@/pages/PatientSearchPage';
import PatientDashboardPage from '@/pages/PatientDashboardPage';
import AppointmentSchedulingPage from '@/pages/AppointmentSchedulingPage';
import AppointmentManagementPage from '@/pages/AppointmentManagementPage';
import DoctorScheduleManagementPage from '@/pages/DoctorScheduleManagementPage';
import MedicalRecordsManagementPage from '@/pages/MedicalRecordsManagementPage';
import CreateMedicalRecordPage from '@/pages/CreateMedicalRecordPage';
import EditMedicalRecordPage from '@/pages/EditMedicalRecordPage';
import MedicalHistoryTimelinePage from './pages/MedicalHistoryTimelinePage';
import VitalsMonitoringPage from './pages/VitalsMonitoringPage';
import LabResultsManagementPage from './pages/LabResultsManagementPage';
import PrescriptionManagementPage from './pages/PrescriptionManagementPage';
import RealTimeChatPage from './pages/RealTimeChatPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import PatientAnalyticsPage from './pages/PatientAnalyticsPage';
import HospitalAnalyticsPage from './pages/HospitalAnalyticsPage';
import ReportGenerationPage from './pages/ReportGenerationPage';
import DataExportPage from './pages/DataExportPage';
import EmailNotificationsPage from './pages/EmailNotificationsPage';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <CssBaseline />
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div>Dashboard (Coming Soon)</div>
                    </ProtectedRoute>
                  }
                />
                
                {/* Patient routes */}
                <Route
                  path="/patient/register"
                  element={
                    <ProtectedRoute>
                      <PatientRegistrationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/dashboard"
                  element={
                    <ProtectedRoute>
                      <PatientDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/:patientId"
                  element={
                    <ProtectedRoute>
                      <PatientProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <PatientSearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/patients/:patientId" element={<PatientProfilePage />} />
                <Route path="/patients/:patientId/timeline" element={<MedicalHistoryTimelinePage />} />
                <Route path="/patient-registration" element={<PatientRegistrationPage />} />
                
                {/* Appointment routes */}
                <Route
                  path="/appointments/schedule"
                  element={
                    <ProtectedRoute>
                      <AppointmentSchedulingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute>
                      <AppointmentManagementPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Schedule routes */}
                <Route
                  path="/schedules"
                  element={
                    <ProtectedRoute>
                      <DoctorScheduleManagementPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Medical Records routes */}
                <Route
                  path="/medical-records"
                  element={
                    <ProtectedRoute>
                      <MedicalRecordsManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/medical-records/create"
                  element={
                    <ProtectedRoute>
                      <CreateMedicalRecordPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/medical-records/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditMedicalRecordPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Vitals Monitoring routes */}
                <Route
                  path="/vitals"
                  element={
                    <ProtectedRoute>
                      <VitalsMonitoringPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/vitals"
                  element={
                    <ProtectedRoute>
                      <VitalsMonitoringPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Lab Results routes */}
                <Route
                  path="/lab-results"
                  element={
                    <ProtectedRoute>
                      <LabResultsManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/lab-results"
                  element={
                    <ProtectedRoute>
                      <LabResultsManagementPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Prescription Management routes */}
                <Route
                  path="/prescriptions"
                  element={
                    <ProtectedRoute>
                      <PrescriptionManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/prescriptions"
                  element={
                    <ProtectedRoute>
                      <PrescriptionManagementPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Real-time Chat routes */}
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <RealTimeChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/chat"
                  element={
                    <ProtectedRoute>
                      <RealTimeChatPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Notification Center route */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationCenterPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Email Notifications route */}
                <Route
                  path="/notifications/email"
                  element={
                    <ProtectedRoute>
                      <EmailNotificationsPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Analytics routes */}
                <Route
                  path="/analytics/patients"
                  element={
                    <ProtectedRoute>
                      <PatientAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/analytics"
                  element={
                    <ProtectedRoute>
                      <PatientAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Hospital Analytics routes */}
                <Route
                  path="/analytics/hospital"
                  element={
                    <ProtectedRoute>
                      <HospitalAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hospital/analytics"
                  element={
                    <ProtectedRoute>
                      <HospitalAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Report Generation routes */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportGenerationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/generate"
                  element={
                    <ProtectedRoute>
                      <ReportGenerationPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Data Export route */}
                <Route
                  path="/export"
                  element={
                    <ProtectedRoute>
                      <DataExportPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App; 