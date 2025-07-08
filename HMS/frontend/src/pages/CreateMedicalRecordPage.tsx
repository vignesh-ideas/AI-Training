import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const CreateMedicalRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: MedicalRecordFormData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating medical record:', data);
      toast.success('Medical record created successfully');
      navigate('/medical-records');
    } catch (error) {
      toast.error('Failed to create medical record');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/medical-records');
  };

  return (
    <>
      <Helmet>
        <title>Create Medical Record - HMS</title>
        <meta name="description" content="Create a new medical record for a patient" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Medical Record
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Fill in the required information to create a new medical record. All fields marked with * are required.
        </Alert>

        <Card>
          <CardContent>
            <MedicalRecordForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              mode="create"
            />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CreateMedicalRecordPage; 