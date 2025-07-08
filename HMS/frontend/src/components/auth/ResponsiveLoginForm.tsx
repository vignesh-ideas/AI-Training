import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  MedicalServices,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { LoginRequest } from '@/types/auth';
import useResponsive from '@/hooks/useResponsive';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

interface ResponsiveLoginFormProps {
  onSwitchToRegister?: () => void;
}

const ResponsiveLoginForm: React.FC<ResponsiveLoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      clearError();
      await login(data);
      if (rememberMe) {
        localStorage.setItem('hms_remember_me', 'true');
      } else {
        localStorage.removeItem('hms_remember_me');
      }
    } catch (error) {
      // Error is handled by the auth service
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'grey.50',
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={isMobile ? 2 : 4}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            width: '100%',
            maxWidth: { xs: '100%', sm: 450, md: 500 },
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <MedicalServices
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  color: 'primary.main',
                }}
              />
            </Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              HMS Login
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Sign in to your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{ mb: { xs: 2, sm: 3 } }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPassword}
                            edge="end"
                            disabled={isLoading}
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Remember me
                    </Typography>
                  }
                />

                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>
          </form>

          {/* Divider */}
          <Box sx={{ my: { xs: 3, sm: 4 } }}>
            <Divider>
              <Chip
                label="or"
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
            </Divider>
          </Box>

          {/* Register Link */}
          {onSwitchToRegister && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToRegister}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          )}

          {/* Demo Info */}
          <Box sx={{ mt: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                display: 'block',
                mb: 1,
              }}
            >
              Demo Credentials
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Chip
                label="Admin: admin/admin123"
                size="small"
                variant="outlined"
                sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
              />
              <Chip
                label="Doctor: doctor/doctor123"
                size="small"
                variant="outlined"
                sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResponsiveLoginForm; 