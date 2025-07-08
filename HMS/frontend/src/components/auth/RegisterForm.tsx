import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  FormHelperText,
  Link,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Business, LocalHospital, Medication, Science } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { RegisterRequest, UserRole } from '@/types/auth';
import EmailVerification from './EmailVerification';
import TermsAndConditions from './TermsAndConditions';

const schema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Please select a role')
    .oneOf(Object.values(UserRole), 'Please select a valid role'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
}).required();

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegisterRequest | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string; acceptTerms: boolean }>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.PATIENT,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return <LocalHospital />;
      case UserRole.NURSE:
        return <Person />;
      case UserRole.PATIENT:
        return <Person />;
      case UserRole.PHARMACIST:
        return <Medication />;
      case UserRole.LAB_TECHNICIAN:
        return <Science />;
      default:
        return <Person />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return 'Medical professionals who diagnose and treat patients';
      case UserRole.NURSE:
        return 'Healthcare professionals who provide patient care';
      case UserRole.PATIENT:
        return 'Individuals seeking medical care and treatment';
      case UserRole.PHARMACIST:
        return 'Healthcare professionals who dispense medications';
      case UserRole.LAB_TECHNICIAN:
        return 'Professionals who perform laboratory tests';
      default:
        return '';
    }
  };

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string; acceptTerms: boolean }) => {
    try {
      clearError();
      const { confirmPassword, acceptTerms, ...registerData } = data;
      
      // Store registration data for email verification
      setRegistrationData(registerData);
      setActiveStep(1);
      setShowEmailVerification(true);
    } catch (error) {
      // Error is handled by the auth service
    }
  };

  const handleEmailVerificationComplete = async () => {
    if (registrationData) {
      try {
        await registerUser(registrationData);
        setActiveStep(2);
      } catch (error) {
        setShowEmailVerification(false);
        setActiveStep(0);
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleTermsAccept = () => {
    setShowTermsDialog(false);
  };

  const handleTermsDecline = () => {
    setShowTermsDialog(false);
  };

  const passwordStrength = getPasswordStrength(password);

  if (showEmailVerification && registrationData) {
    return (
      <EmailVerification
        email={registrationData.email}
        onVerificationComplete={handleEmailVerificationComplete}
        onBack={() => {
          setShowEmailVerification(false);
          setActiveStep(0);
        }}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join HMS as a healthcare professional or patient
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Register</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify Email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>

          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Box>

              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role} disabled={isLoading}>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value={UserRole.PATIENT}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person />
                          Patient
                        </Box>
                      </MenuItem>
                      <MenuItem value={UserRole.DOCTOR}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalHospital />
                          Doctor
                        </Box>
                      </MenuItem>
                      <MenuItem value={UserRole.NURSE}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person />
                          Nurse
                        </Box>
                      </MenuItem>
                      <MenuItem value={UserRole.PHARMACIST}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Medication />
                          Pharmacist
                        </Box>
                      </MenuItem>
                      <MenuItem value={UserRole.LAB_TECHNICIAN}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Science />
                          Lab Technician
                        </Box>
                      </MenuItem>
                    </Select>
                    {errors.role && (
                      <FormHelperText>{errors.role.message}</FormHelperText>
                    )}
                    {field.value && (
                      <FormHelperText sx={{ mt: 1, fontStyle: 'italic' }}>
                        {getRoleDescription(field.value as UserRole)}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPassword}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {password && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor(passwordStrength) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Password strength: {getPasswordStrengthText(passwordStrength)}
                  </Typography>
                </Box>
              )}

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowConfirmPassword}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I accept the{' '}
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => setShowTermsDialog(true)}
                          sx={{ textDecoration: 'underline' }}
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                    disabled={isLoading}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            {onSwitchToLogin && (
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToLogin}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign in
                </Link>
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      <TermsAndConditions
        open={showTermsDialog}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    </>
  );
};

export default RegisterForm; 