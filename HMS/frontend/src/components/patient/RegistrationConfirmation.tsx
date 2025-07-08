import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Person,
  Phone,
  Email,
  LocationOn,
  Description,
  PhotoCamera,
  Download,
  Print,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface RegistrationConfirmationProps {
  patientData: any;
  documents: any[];
  patientId: string;
  onComplete: () => void;
}

const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({
  patientData,
  documents,
  patientId,
  onComplete,
}) => {
  const handleComplete = async () => {
    try {
      // Mock API call to finalize registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Patient registration completed successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to complete registration. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    toast.success('Registration details downloaded');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <PhotoCamera />;
    return <Description />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom>
          Registration Complete
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please review the patient information and documents before finalizing registration
        </Typography>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Patient ID:</strong> {patientId}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Patient Information Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {patientData?.firstName} {patientData?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {patientId}
                  </Typography>
                </Box>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={patientData?.dateOfBirth}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={patientData?.gender}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Blood Type"
                    secondary={patientData?.bloodType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Marital Status"
                    secondary={patientData?.maritalStatus}
                  />
                </ListItem>
                {patientData?.email && (
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={patientData.email}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={patientData?.phoneNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {patientData?.address}
                        </Typography>
                        <Typography variant="body2">
                          {patientData?.city}, {patientData?.state} {patientData?.zipCode}
                        </Typography>
                        <Typography variant="body2">
                          {patientData?.country}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medical Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List dense>
                {patientData?.occupation && (
                  <ListItem>
                    <ListItemText
                      primary="Occupation"
                      secondary={patientData.occupation}
                    />
                  </ListItem>
                )}
                {patientData?.hasInsurance && (
                  <ListItem>
                    <ListItemText
                      primary="Insurance"
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Provider: {patientData.insuranceProvider}
                          </Typography>
                          <Typography variant="body2">
                            Number: {patientData.insuranceNumber}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )}
                {patientData?.hasAllergies && patientData?.allergies && (
                  <ListItem>
                    <ListItemText
                      primary="Allergies"
                      secondary={patientData.allergies}
                    />
                  </ListItem>
                )}
                {patientData?.hasMedicalConditions && patientData?.medicalConditions && (
                  <ListItem>
                    <ListItemText
                      primary="Medical Conditions"
                      secondary={patientData.medicalConditions}
                    />
                  </ListItem>
                )}
                {patientData?.hasCurrentMedications && patientData?.currentMedications && (
                  <ListItem>
                    <ListItemText
                      primary="Current Medications"
                      secondary={patientData.currentMedications}
                    />
                  </ListItem>
                )}
                {patientData?.familyHistory && (
                  <ListItem>
                    <ListItemText
                      primary="Family History"
                      secondary={patientData.familyHistory}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={patientData?.emergencyContactName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Relationship"
                    secondary={patientData?.emergencyContactRelationship}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={patientData?.emergencyContact}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Uploaded Documents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploaded Documents ({documents.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {documents.length > 0 ? (
                <List dense>
                  {documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getFileIcon(doc.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={formatFileSize(doc.size)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ mr: 2 }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleComplete}
          sx={{ minWidth: 200 }}
        >
          Complete Registration
        </Button>
      </Box>

      {/* Additional Information */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Next Steps:</strong> After completing registration, the patient will be able to:
          <br />
          • Schedule appointments
          <br />
          • Access medical records
          <br />
          • Receive notifications
          <br />
          • Contact healthcare providers
        </Typography>
      </Alert>
    </Box>
  );
};

export default RegistrationConfirmation; 