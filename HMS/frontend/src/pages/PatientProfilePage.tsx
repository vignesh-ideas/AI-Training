import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Print,
  Download,
  Share,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Bloodtype,
  Person,
  MedicalServices,
  Description,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PatientInfo from '@/components/patient/PatientInfo';
import MedicalHistory from '@/components/patient/MedicalHistory';
import PatientDocuments from '@/components/patient/PatientDocuments';
import PatientTimeline from '@/components/patient/PatientTimeline';
import PatientStats from '@/components/patient/PatientStats';

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
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PatientProfilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPatient = {
        id: patientId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        gender: 'MALE',
        bloodType: 'O+',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        occupation: 'Software Engineer',
        maritalStatus: 'SINGLE',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1234567891',
        },
        insurance: {
          provider: 'Blue Cross Blue Shield',
          number: 'BCBS123456',
          hasInsurance: true,
        },
        medicalInfo: {
          allergies: ['Peanuts', 'Shellfish'],
          conditions: ['Hypertension', 'Asthma'],
          medications: ['Lisinopril', 'Albuterol'],
          familyHistory: 'Heart disease in family',
        },
        status: 'ACTIVE',
        registrationDate: '2023-01-15',
        lastVisit: '2024-01-10',
        nextAppointment: '2024-02-15',
      };

      setPatient(mockPatient);
    } catch (error) {
      setError('Failed to load patient data');
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    navigate(`/patient/${patientId}/edit`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Printing patient profile');
  };

  const handleDownload = () => {
    // Mock download functionality
    toast.success('Patient profile downloaded');
  };

  const handleShare = () => {
    // Mock share functionality
    toast.success('Patient profile shared');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Patient not found'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Patient Profile - {patient.firstName} {patient.lastName} - HMS</title>
        <meta name="description" content={`Patient profile for ${patient.firstName} ${patient.lastName}`} />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
              >
                {patient.firstName[0]}{patient.lastName[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                {patient.firstName} {patient.lastName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip
                  label={patient.status}
                  color={patient.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Patient ID: {patient.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{patient.phoneNumber}</Typography>
                </Box>
                {patient.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{patient.email}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">
                    {patient.city}, {patient.state}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Edit Patient">
                  <IconButton onClick={handleEdit} color="primary">
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print Profile">
                  <IconButton onClick={handlePrint} color="primary">
                    <Print />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download Profile">
                  <IconButton onClick={handleDownload} color="primary">
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share Profile">
                  <IconButton onClick={handleShare} color="primary">
                    <Share />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {patient.lastVisit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Visit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarToday color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {patient.nextAppointment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Next Appointment
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Bloodtype color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {patient.bloodType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Blood Type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {patient.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gender
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="patient profile tabs"
              sx={{ px: 3 }}
            >
              <Tab
                icon={<Person />}
                label="Information"
                id="patient-tab-0"
                aria-controls="patient-tabpanel-0"
              />
              <Tab
                icon={<MedicalServices />}
                label="Medical History"
                id="patient-tab-1"
                aria-controls="patient-tabpanel-1"
              />
              <Tab
                icon={<Description />}
                label="Documents"
                id="patient-tab-2"
                aria-controls="patient-tabpanel-2"
              />
              <Tab
                icon={<Timeline />}
                label="Timeline"
                id="patient-tab-3"
                aria-controls="patient-tabpanel-3"
              />
              <Tab
                icon={<Assessment />}
                label="Statistics"
                id="patient-tab-4"
                aria-controls="patient-tabpanel-4"
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <PatientInfo patient={patient} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <MedicalHistory patientId={patient.id} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <PatientDocuments patientId={patient.id} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <PatientTimeline patientId={patient.id} />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <PatientStats patientId={patient.id} />
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
};

export default PatientProfilePage; 