import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Please select a valid gender'),
  bloodType: yup
    .string()
    .required('Blood type is required')
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Please select a valid blood type'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .optional(),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  emergencyContact: yup
    .string()
    .required('Emergency contact is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  city: yup
    .string()
    .required('City is required'),
  state: yup
    .string()
    .required('State is required'),
  zipCode: yup
    .string()
    .required('ZIP code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: yup
    .string()
    .required('Country is required'),
  occupation: yup
    .string()
    .optional(),
  maritalStatus: yup
    .string()
    .required('Marital status is required')
    .oneOf(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'], 'Please select a valid marital status'),
  insuranceProvider: yup
    .string()
    .optional(),
  insuranceNumber: yup
    .string()
    .optional(),
  allergies: yup
    .string()
    .optional(),
  medicalConditions: yup
    .string()
    .optional(),
  currentMedications: yup
    .string()
    .optional(),
  familyHistory: yup
    .string()
    .optional(),
  emergencyContactName: yup
    .string()
    .required('Emergency contact name is required'),
  emergencyContactRelationship: yup
    .string()
    .required('Emergency contact relationship is required'),
  hasInsurance: yup
    .boolean()
    .required(),
  hasAllergies: yup
    .boolean()
    .required(),
  hasMedicalConditions: yup
    .boolean()
    .required(),
  hasCurrentMedications: yup
    .boolean()
    .required(),
}).required();

interface PatientRegistrationFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  onNext,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      occupation: '',
      maritalStatus: '',
      insuranceProvider: '',
      insuranceNumber: '',
      allergies: '',
      medicalConditions: '',
      currentMedications: '',
      familyHistory: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      hasInsurance: false,
      hasAllergies: false,
      hasMedicalConditions: false,
      hasCurrentMedications: false,
    },
  });

  const hasInsurance = watch('hasInsurance');
  const hasAllergies = watch('hasAllergies');
  const hasMedicalConditions = watch('hasMedicalConditions');
  const hasCurrentMedications = watch('hasCurrentMedications');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Patient information saved successfully!');
      onNext(data);
    } catch (error) {
      toast.error('Failed to save patient information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Patient Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide comprehensive patient information. All fields marked with * are required.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="First Name *"
                          fullWidth
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name *"
                          fullWidth
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Date of Birth *"
                          type="date"
                          fullWidth
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth?.message}
                          disabled={isLoading}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.gender} disabled={isLoading}>
                          <InputLabel>Gender *</InputLabel>
                          <Select {...field} label="Gender *">
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                          </Select>
                          {errors.gender && (
                            <FormHelperText>{errors.gender.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="bloodType"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.bloodType} disabled={isLoading}>
                          <InputLabel>Blood Type *</InputLabel>
                          <Select {...field} label="Blood Type *">
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                          </Select>
                          {errors.bloodType && (
                            <FormHelperText>{errors.bloodType.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.maritalStatus} disabled={isLoading}>
                          <InputLabel>Marital Status *</InputLabel>
                          <Select {...field} label="Marital Status *">
                            <MenuItem value="SINGLE">Single</MenuItem>
                            <MenuItem value="MARRIED">Married</MenuItem>
                            <MenuItem value="DIVORCED">Divorced</MenuItem>
                            <MenuItem value="WIDOWED">Widowed</MenuItem>
                          </Select>
                          {errors.maritalStatus && (
                            <FormHelperText>{errors.maritalStatus.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          type="email"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number *"
                          fullWidth
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="occupation"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Occupation"
                          fullWidth
                          error={!!errors.occupation}
                          helperText={errors.occupation?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Address Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Address *"
                          fullWidth
                          multiline
                          rows={2}
                          error={!!errors.address}
                          helperText={errors.address?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="City *"
                          fullWidth
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="State *"
                          fullWidth
                          error={!!errors.state}
                          helperText={errors.state?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="ZIP Code *"
                          fullWidth
                          error={!!errors.zipCode}
                          helperText={errors.zipCode?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Country *"
                          fullWidth
                          error={!!errors.country}
                          helperText={errors.country?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emergencyContactName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Emergency Contact Name *"
                          fullWidth
                          error={!!errors.emergencyContactName}
                          helperText={errors.emergencyContactName?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emergencyContactRelationship"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Relationship *"
                          fullWidth
                          error={!!errors.emergencyContactRelationship}
                          helperText={errors.emergencyContactRelationship?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="emergencyContact"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Emergency Contact Phone *"
                          fullWidth
                          error={!!errors.emergencyContact}
                          helperText={errors.emergencyContact?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Insurance Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Insurance Information
                </Typography>
                <Controller
                  name="hasInsurance"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      }
                      label="Patient has insurance"
                    />
                  )}
                />
                {hasInsurance && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="insuranceProvider"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Insurance Provider"
                            fullWidth
                            error={!!errors.insuranceProvider}
                            helperText={errors.insuranceProvider?.message}
                            disabled={isLoading}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="insuranceNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Insurance Number"
                            fullWidth
                            error={!!errors.insuranceNumber}
                            helperText={errors.insuranceNumber?.message}
                            disabled={isLoading}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Medical Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Medical Information
                </Typography>
                
                <Controller
                  name="hasAllergies"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      }
                      label="Patient has allergies"
                    />
                  )}
                />
                {hasAllergies && (
                  <Controller
                    name="allergies"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Allergies"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mt: 2 }}
                        error={!!errors.allergies}
                        helperText={errors.allergies?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                )}

                <Controller
                  name="hasMedicalConditions"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      }
                      label="Patient has medical conditions"
                    />
                  )}
                />
                {hasMedicalConditions && (
                  <Controller
                    name="medicalConditions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Medical Conditions"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mt: 2 }}
                        error={!!errors.medicalConditions}
                        helperText={errors.medicalConditions?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                )}

                <Controller
                  name="hasCurrentMedications"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      }
                      label="Patient is taking current medications"
                    />
                  )}
                />
                {hasCurrentMedications && (
                  <Controller
                    name="currentMedications"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Current Medications"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mt: 2 }}
                        error={!!errors.currentMedications}
                        helperText={errors.currentMedications?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                )}

                <Controller
                  name="familyHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Family Medical History"
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mt: 2 }}
                      error={!!errors.familyHistory}
                      helperText={errors.familyHistory?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PatientRegistrationForm; 