import { createTheme, Theme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material/styles';

// WCAG AA compliant color palette
const accessibilityColors = {
  primary: {
    main: '#0052CC', // High contrast blue
    light: '#4C9AFF',
    dark: '#0747A6',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF5630', // High contrast orange
    light: '#FF8B73',
    dark: '#DE350B',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F', // High contrast red
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#ED6C02', // High contrast orange
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1', // High contrast blue
    light: '#03DAC6',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D32', // High contrast green
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: '#212121', // High contrast text
    secondary: '#424242',
    disabled: '#9E9E9E',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
  },
  divider: '#E0E0E0',
};

// Create base theme with accessibility focus
let theme = createTheme({
  palette: accessibilityColors,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Ensure minimum font size for readability
    fontSize: 16,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // WCAG minimum touch target
          minWidth: 44,
          padding: '12px 24px',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
          '&:focus-visible': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
        sizeSmall: {
          minHeight: 36,
          minWidth: 36,
          padding: '8px 16px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          minHeight: 48,
          minWidth: 48,
          padding: '16px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            minHeight: 44,
            '&:focus-within': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0052CC',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:focus-within': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
          '&:focus-visible': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
        sizeSmall: {
          minWidth: 36,
          minHeight: 36,
        },
        sizeLarge: {
          minWidth: 48,
          minHeight: 48,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          minHeight: 32,
          fontSize: '0.875rem',
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
            borderRadius: '2px',
          },
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            padding: '16px',
            fontSize: '0.875rem',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: '#F5F5F5',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          '&:focus': {
            outline: '2px solid #0052CC',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem',
          padding: '8px 12px',
          backgroundColor: '#424242',
          color: '#FFFFFF',
          borderRadius: 6,
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

// Extend theme with accessibility utilities
declare module '@mui/material/styles' {
  interface Theme {
    accessibility: {
      focusRing: string;
      highContrast: boolean;
      reducedMotion: boolean;
      fontSize: 'normal' | 'large' | 'extra-large';
    };
  }
  interface ThemeOptions {
    accessibility?: {
      focusRing?: string;
      highContrast?: boolean;
      reducedMotion?: boolean;
      fontSize?: 'normal' | 'large' | 'extra-large';
    };
  }
}

// Add accessibility utilities to theme
theme.accessibility = {
  focusRing: '#0052CC',
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal',
};

export default theme; 