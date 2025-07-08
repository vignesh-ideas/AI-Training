import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormHelperText,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface AccessibleTextFieldProps extends Omit<TextFieldProps, 'aria-label'> {
  label: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  showFocusRing?: boolean;
  characterCount?: {
    current: number;
    max: number;
  };
}

const AccessibleTextField: React.FC<AccessibleTextFieldProps> = ({
  label,
  ariaLabel,
  ariaDescribedBy,
  errorMessage,
  helperText,
  required = false,
  showPasswordToggle = false,
  showFocusRing = true,
  characterCount,
  error,
  disabled,
  ...textFieldProps
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (textFieldProps.onFocus) {
      textFieldProps.onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (textFieldProps.onBlur) {
      textFieldProps.onBlur(event);
    }
  };

  const hasError = error || !!errorMessage;
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const characterCountId = `${fieldId}-character-count`;

  const describedBy = [
    ariaDescribedBy,
    hasError ? errorId : null,
    helperText ? helperId : null,
    characterCount ? characterCountId : null,
  ]
    .filter(Boolean)
    .join(' ');

  const inputProps = {
    ...textFieldProps.InputProps,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': hasError,
    'aria-required': required,
  };

  if (showPasswordToggle && textFieldProps.type === 'password') {
    inputProps.endAdornment = (
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={handleShowPassword}
          edge="end"
          disabled={disabled}
          size="small"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        {...textFieldProps}
        id={fieldId}
        label={`${label}${required ? ' *' : ''}`}
        aria-label={ariaLabel || label}
        error={hasError}
        disabled={disabled}
        required={required}
        type={showPasswordToggle && textFieldProps.type === 'password' && showPassword ? 'text' : textFieldProps.type}
        InputProps={inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{
          ...textFieldProps.sx,
          '& .MuiOutlinedInput-root': {
            ...(showFocusRing && {
              '&:focus-within': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
              },
            }),
          },
          '& .MuiInputLabel-root': {
            ...(required && {
              '&::after': {
                content: '" *"',
                color: theme.palette.error.main,
              },
            }),
          },
        }}
      />

      {/* Error Message */}
      {hasError && (
        <FormHelperText
          id={errorId}
          error
          sx={{ mt: 0.5, fontSize: '0.75rem' }}
          role="alert"
          aria-live="polite"
        >
          {errorMessage || 'This field is required'}
        </FormHelperText>
      )}

      {/* Helper Text */}
      {helperText && !hasError && (
        <FormHelperText
          id={helperId}
          sx={{ mt: 0.5, fontSize: '0.75rem' }}
        >
          {helperText}
        </FormHelperText>
      )}

      {/* Character Count */}
      {characterCount && (
        <FormHelperText
          id={characterCountId}
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
            color: characterCount.current > characterCount.max * 0.9 ? 'warning.main' : 'text.secondary',
          }}
        >
          {characterCount.current} / {characterCount.max} characters
        </FormHelperText>
      )}
    </Box>
  );
};

export default AccessibleTextField; 