import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { CheckCircle, Email } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/authService';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationComplete,
  onBack,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock verification - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate verification success
      toast.success('Email verified successfully!');
      onVerificationComplete();
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock resend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(60);
      setCanResend(false);
      toast.success('Verification code resent!');
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'grey.50',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent a verification code to
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="primary">
            {email}
          </Typography>
        </Box>

        <Stepper activeStep={1} sx={{ mb: 3 }}>
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
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TextField
          label="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          fullWidth
          placeholder="Enter 6-digit code"
          disabled={isLoading}
          inputProps={{ maxLength: 6 }}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleVerifyCode}
          disabled={isLoading || !verificationCode.trim()}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Verify Email'
          )}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Didn't receive the code?
          </Typography>
          
          {canResend ? (
            <Button
              variant="text"
              onClick={handleResendCode}
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
            >
              Resend Code
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Resend available in {timeLeft}s
            </Typography>
          )}
        </Box>

        <Button
          variant="text"
          onClick={onBack}
          disabled={isLoading}
          sx={{ textTransform: 'none' }}
        >
          ← Back to Registration
        </Button>
      </Paper>
    </Box>
  );
};

export default EmailVerification; 