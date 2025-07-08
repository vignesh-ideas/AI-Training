import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
  FormHelperText,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Security,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const schema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeForm: React.FC = () => {
  const { changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordChangeData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

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

  const onSubmit = async (data: PasswordChangeData) => {
    setIsLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Security color="primary" />
            <Typography variant="h6" component="h2">
              Change Password
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your password to keep your account secure. Your new password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {newPassword && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor(passwordStrength) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <FormHelperText>
                    Password strength: {getPasswordStrengthText(passwordStrength)}
                  </FormHelperText>
                </Box>
              )}

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ minWidth: 120 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Change Password'
                  )}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => reset()}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </form>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Password Requirements:</strong>
            </Typography>
            <Typography variant="body2" component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordChangeForm; 