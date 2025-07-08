import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface AccessibleModalProps extends Omit<DialogProps, 'aria-labelledby' | 'aria-describedby'> {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  onClose: () => void;
  closeButtonAriaLabel?: string;
  showFocusRing?: boolean;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  title,
  description,
  children,
  actions,
  showCloseButton = true,
  onClose,
  closeButtonAriaLabel = 'Close dialog',
  showFocusRing = true,
  ...dialogProps
}) => {
  const theme = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (dialogProps.open) {
      // Focus the title when modal opens
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 100);
    }
  }, [dialogProps.open]);

  // Trap focus within modal
  useEffect(() => {
    if (!dialogProps.open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = contentRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogProps.open, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const titleId = `modal-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const descriptionId = description ? `modal-description-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  return (
    <Dialog
      {...dialogProps}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={handleBackdropClick}
      sx={{
        ...dialogProps.sx,
        '& .MuiDialog-paper': {
          ...(showFocusRing && {
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }),
        },
      }}
    >
      <DialogTitle
        ref={titleRef}
        id={titleId}
        tabIndex={-1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600 }}
        >
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            aria-label={closeButtonAriaLabel}
            onClick={onClose}
            size="small"
            sx={{
              ml: 2,
              '&:focus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
              },
            }}
          >
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      {description && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Typography
            id={descriptionId}
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </Box>
      )}

      <DialogContent
        ref={contentRef}
        sx={{
          pt: 2,
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AccessibleModal; 