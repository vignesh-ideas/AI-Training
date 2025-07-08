import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MedicalServices,
  CalendarToday,
  Description,
  ExpandMore,
  Visibility,
  Download,
  Print,
  Add,
  Timeline,
  LocalHospital,
  Medication,
  Assessment,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface MedicalHistoryProps {
  patientId: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  type: 'CONSULTATION' | 'LAB_RESULT' | 'PRESCRIPTION' | 'SURGERY' | 'VACCINATION';
  title: string;
  description: string;
  doctor: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  attachments?: string[];
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ patientId }) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          date: '2024-01-15',
          type: 'CONSULTATION',
          title: 'Annual Physical Examination',
          description: 'Routine annual physical examination. Patient is in good health with no significant findings.',
          doctor: 'Dr. Sarah Johnson',
          status: 'COMPLETED',
          attachments: ['physical_report.pdf'],
        },
        {
          id: '2',
          date: '2024-01-10',
          type: 'LAB_RESULT',
          title: 'Blood Work Results',
          description: 'Complete blood count and comprehensive metabolic panel. All values within normal range.',
          doctor: 'Dr. Michael Chen',
          status: 'COMPLETED',
          attachments: ['blood_work_results.pdf', 'lab_report.pdf'],
        },
        {
          id: '3',
          date: '2023-12-20',
          type: 'PRESCRIPTION',
          title: 'Medication Refill - Lisinopril',
          description: 'Refill prescription for hypertension management. Dosage: 10mg daily.',
          doctor: 'Dr. Sarah Johnson',
          status: 'COMPLETED',
        },
        {
          id: '4',
          date: '2023-11-15',
          type: 'SURGERY',
          title: 'Appendectomy',
          description: 'Laparoscopic appendectomy performed due to acute appendicitis. Surgery was successful.',
          doctor: 'Dr. Robert Wilson',
          status: 'COMPLETED',
          attachments: ['surgery_report.pdf', 'discharge_summary.pdf'],
        },
        {
          id: '5',
          date: '2023-10-05',
          type: 'VACCINATION',
          title: 'Flu Shot',
          description: 'Annual influenza vaccination administered.',
          doctor: 'Dr. Emily Davis',
          status: 'COMPLETED',
        },
      ];

      setMedicalRecords(mockRecords);
    } catch (error) {
      setError('Failed to load medical history');
      toast.error('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return <MedicalServices color="primary" />;
      case 'LAB_RESULT':
        return <Assessment color="secondary" />;
      case 'PRESCRIPTION':
        return <Medication color="success" />;
      case 'SURGERY':
        return <LocalHospital color="error" />;
      case 'VACCINATION':
        return <MedicalServices color="info" />;
      default:
        return <Description />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION':
        return 'primary';
      case 'LAB_RESULT':
        return 'secondary';
      case 'PRESCRIPTION':
        return 'success';
      case 'SURGERY':
        return 'error';
      case 'VACCINATION':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleViewRecord = (record: MedicalRecord) => {
    toast.success(`Viewing ${record.title}`);
  };

  const handleDownloadRecord = (record: MedicalRecord) => {
    toast.success(`Downloading ${record.title}`);
  };

  const handlePrintRecord = (record: MedicalRecord) => {
    toast.success(`Printing ${record.title}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline />
          Medical History
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.success('Add new medical record')}
        >
          Add Record
        </Button>
      </Box>

      {medicalRecords.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Medical Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No medical records have been added for this patient yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {medicalRecords.map((record) => (
            <Grid item xs={12} key={record.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getTypeIcon(record.type)}
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {record.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={record.type.replace('_', ' ')}
                            color={getTypeColor(record.type) as any}
                            size="small"
                          />
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewRecord(record)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadRecord(record)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print">
                        <IconButton
                          size="small"
                          onClick={() => handlePrintRecord(record)}
                        >
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Record Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="body2" paragraph>
                            {record.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Doctor
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {record.doctor}
                            </Typography>
                            
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                              Date
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {record.date}
                            </Typography>

                            {record.attachments && record.attachments.length > 0 && (
                              <>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                  Attachments
                                </Typography>
                                <List dense>
                                  {record.attachments.map((attachment, index) => (
                                    <ListItem key={index} sx={{ py: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Description fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={attachment}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Summary Statistics */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Medical History Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {medicalRecords.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {medicalRecords.filter(r => r.status === 'COMPLETED').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {medicalRecords.filter(r => r.status === 'PENDING').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {new Set(medicalRecords.map(r => r.doctor)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctors Involved
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MedicalHistory; 