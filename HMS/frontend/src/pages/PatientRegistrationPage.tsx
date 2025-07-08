import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { PersonAdd, Description, CheckCircle } from '@mui/icons-material';
import PatientRegistrationForm from '@/components/patient/PatientRegistrationForm';
import DocumentUpload from '@/components/patient/DocumentUpload';
import RegistrationConfirmation from '@/components/patient/RegistrationConfirmation';

interface PatientRegistrationPageProps {}

const PatientRegistrationPage: React.FC<PatientRegistrationPageProps> = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [patientData, setPatientData] = React.useState<any>(null);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [patientId, setPatientId] = React.useState<string>('');

  const steps = [
    { label: 'Patient Information', icon: <PersonAdd /> },
    { label: 'Document Upload', icon: <Description /> },
    { label: 'Confirmation', icon: <CheckCircle /> },
  ];

  const handleNext = (data?: any) => {
    if (activeStep === 0 && data) {
      setPatientData(data);
      setPatientId(generatePatientId());
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDocumentUpload = (uploadedDocs: any[]) => {
    setDocuments(uploadedDocs);
    handleNext();
  };

  const generatePatientId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAT${timestamp}${random}`;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PatientRegistrationForm
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <DocumentUpload
            onNext={handleDocumentUpload}
            onBack={handleBack}
            patientId={patientId}
          />
        );
      case 2:
        return (
          <RegistrationConfirmation
            patientData={patientData}
            documents={documents}
            patientId={patientId}
            onComplete={() => {
              // Handle completion - redirect to dashboard or patient list
              console.log('Registration completed');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Patient Registration - HMS</title>
        <meta name="description" content="Register new patients in the Hospital Management System" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Patient Registration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Register new patients with comprehensive information and document upload
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Registration Process:</strong> Complete all required information, upload necessary documents, and review before finalizing registration.
          </Typography>
        </Alert>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  icon={step.icon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: activeStep === index ? 'bold' : 'normal',
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}
        </Paper>
      </Container>
    </>
  );
};

export default PatientRegistrationPage; 