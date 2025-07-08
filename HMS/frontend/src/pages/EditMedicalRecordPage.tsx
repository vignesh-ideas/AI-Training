import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import MedicalRecordForm from '../components/medical-record/MedicalRecordForm';

interface MedicalRecordFormData {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  recordType: string;
  title: string;
  description: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  labResults: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
  priority: string;
  tags: string[];
  attachments: string[];
  notes: string;
  isConfidential: boolean;
}

const EditMedicalRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<MedicalRecordFormData | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchMedicalRecord();
  }, [id]);

  const fetchMedicalRecord = async () => {
    setFetching(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockRecord: MedicalRecordFormData = {
        patientId: 'PAT001',
        patientName: 'John Doe',
        doctorId: 'DOC001',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        recordType: 'CONSULTATION',
        title: 'Cardiac Consultation',
        description: 'Patient presented with chest pain and shortness of breath',
        diagnosis: 'Angina pectoris',
        treatment: 'Prescribed nitroglycerin and lifestyle modifications',
        medications: ['Nitroglycerin', 'Aspirin', 'Metoprolol'],
        labResults: ['ECG', 'Blood Tests', 'Chest X-Ray'],
        vitalSigns: {
          bloodPressure: '140/90 mmHg',
          heartRate: '85 bpm',
          temperature: '98.6°F',
          oxygenSaturation: '95%',
        },
        priority: 'HIGH',
        tags: ['Cardiac', 'Chest Pain', 'Follow-up Required'],
        attachments: ['ecg_report.pdf', 'blood_test.pdf'],
        notes: 'Patient advised to return in 2 weeks for follow-up',
        isConfidential: false,
      };

      setInitialData(mockRecord);
    } catch (error) {
      toast.error('Failed to load medical record');
      navigate('/medical-records');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (data: MedicalRecordFormData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Updating medical record:', data);
      toast.success('Medical record updated successfully');
      navigate('/medical-records');
    } catch (error) {
      toast.error('Failed to update medical record');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/medical-records');
  };

  if (fetching) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!initialData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Medical record not found. Please check the URL and try again.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Medical Record - HMS</title>
        <meta name="description" content="Edit an existing medical record" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Medical Record
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Update the medical record information. All changes will be logged for audit purposes.
        </Alert>

        <Card>
          <CardContent>
            <MedicalRecordForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              mode="edit"
            />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default EditMedicalRecordPage; 