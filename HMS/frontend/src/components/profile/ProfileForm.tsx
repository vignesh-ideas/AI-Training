import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Save, Cancel, Person } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  emergencyContact: yup
    .string()
    .required('Emergency contact is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  bloodType: yup
    .string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Please select a valid blood type'),
  allergies: yup
    .string()
    .optional(),
  medicalConditions: yup
    .string()
    .optional(),
}).required();

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies?: string;
  medicalConditions?: string;
}

const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || '',
      emergencyContact: user?.emergencyContact || '',
      bloodType: user?.bloodType || '',
      allergies: user?.allergies || '',
      medicalConditions: user?.medicalConditions || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        bloodType: user.bloodType || '',
        allergies: user.allergies || '',
        medicalConditions: user.medicalConditions || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return 'primary';
      case UserRole.NURSE:
        return 'secondary';
      case UserRole.PATIENT:
        return 'success';
      case UserRole.PHARMACIST:
        return 'warning';
      case UserRole.LAB_TECHNICIAN:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip
              label={user?.role}
              color={getRoleColor(user?.role as UserRole)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        
        {!isEditing ? (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !isDirty}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={!isEditing || isLoading}
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
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={!isEditing || isLoading}
                />
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
                  disabled={!isEditing || isLoading}
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
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  disabled={!isEditing || isLoading}
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
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  disabled={!isEditing || isLoading}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="bloodType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.bloodType} disabled={!isEditing || isLoading}>
                  <InputLabel>Blood Type</InputLabel>
                  <Select {...field} label="Blood Type">
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
                    <Typography variant="caption" color="error">
                      {errors.bloodType.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={!isEditing || isLoading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="emergencyContact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact"
                  fullWidth
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                  disabled={!isEditing || isLoading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="allergies"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Allergies (Optional)"
                  fullWidth
                  error={!!errors.allergies}
                  helperText={errors.allergies?.message}
                  disabled={!isEditing || isLoading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="medicalConditions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Medical Conditions (Optional)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.medicalConditions}
                  helperText={errors.medicalConditions?.message}
                  disabled={!isEditing || isLoading}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfileForm; 