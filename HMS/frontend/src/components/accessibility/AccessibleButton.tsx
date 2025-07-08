import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  Box,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AccessibleButtonProps extends Omit<ButtonProps, 'aria-label'> {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  loading?: boolean;
  loadingText?: string;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  showFocusRing?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaLabel,
  ariaDescribedBy,
  loading = false,
  loadingText = 'Loading...',
  tooltip,
  tooltipPlacement = 'top',
  showFocusRing = true,
  disabled,
  onClick,
  ...buttonProps
}) => {
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!loading && !disabled && onClick) {
        onClick(event as any);
      }
    }
  };

  const buttonContent = (
    <Button
      {...buttonProps}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      aria-live="polite"
      sx={{
        ...buttonProps.sx,
        ...(showFocusRing && {
          '&:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        }),
        ...(loading && {
          '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            opacity: 0,
          },
        }),
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="inherit" />
          <span>{loadingText}</span>
        </Box>
      ) : (
        children
      )}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
        arrow
        enterDelay={500}
        leaveDelay={0}
      >
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
};

export default AccessibleButton; 