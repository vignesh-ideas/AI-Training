import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Bloodtype,
  Work,
  Favorite,
  Emergency,
  Security,
  MedicalServices,
  Warning,
  Medication,
  History,
} from '@mui/icons-material';

interface PatientInfoProps {
  patient: any;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={`${patient.firstName} ${patient.lastName}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={`${patient.dateOfBirth} (${calculateAge(patient.dateOfBirth)} years old)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={patient.gender}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Bloodtype />
                  </ListItemIcon>
                  <ListItemText
                    primary="Blood Type"
                    secondary={patient.bloodType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText
                    primary="Occupation"
                    secondary={patient.occupation || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite />
                  </ListItemIcon>
                  <ListItemText
                    primary="Marital Status"
                    secondary={patient.maritalStatus}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={patient.phoneNumber}
                  />
                </ListItem>
                {patient.email && (
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={patient.email}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {patient.address}
                        </Typography>
                        <Typography variant="body2">
                          {patient.city}, {patient.state} {patient.zipCode}
                        </Typography>
                        <Typography variant="body2">
                          {patient.country}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Emergency color="error" />
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={patient.emergencyContact.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Relationship"
                    secondary={patient.emergencyContact.relationship}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={patient.emergencyContact.phone}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Insurance Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Insurance Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {patient.insurance.hasInsurance ? (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Provider"
                      secondary={patient.insurance.provider}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Policy Number"
                      secondary={patient.insurance.number}
                    />
                  </ListItem>
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No insurance information available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="primary" />
                Medical Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                {/* Allergies */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning color="error" />
                      Allergies
                    </Typography>
                    {patient.medicalInfo.allergies && patient.medicalInfo.allergies.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patient.medicalInfo.allergies.map((allergy: string, index: number) => (
                          <Chip
                            key={index}
                            label={allergy}
                            color="error"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No known allergies
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Medical Conditions */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MedicalServices color="primary" />
                      Medical Conditions
                    </Typography>
                    {patient.medicalInfo.conditions && patient.medicalInfo.conditions.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patient.medicalInfo.conditions.map((condition: string, index: number) => (
                          <Chip
                            key={index}
                            label={condition}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No medical conditions recorded
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Current Medications */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Medication color="secondary" />
                      Current Medications
                    </Typography>
                    {patient.medicalInfo.medications && patient.medicalInfo.medications.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patient.medicalInfo.medications.map((medication: string, index: number) => (
                          <Chip
                            key={index}
                            label={medication}
                            color="secondary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No current medications
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Family History */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <History color="info" />
                      Family History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.medicalInfo.familyHistory || 'No family history recorded'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Registration Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday color="primary" />
                Registration Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1">
                      {patient.registrationDate}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Visit
                    </Typography>
                    <Typography variant="body1">
                      {patient.lastVisit}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Next Appointment
                    </Typography>
                    <Typography variant="body1">
                      {patient.nextAppointment}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfo; 