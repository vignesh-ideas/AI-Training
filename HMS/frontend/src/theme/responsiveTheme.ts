import { createTheme, Theme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material/styles';

// Custom breakpoints for better mobile experience
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  // Custom breakpoints for mobile-first approach
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Responsive font sizes
const fontSizes = {
  h1: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
  h2: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
  h3: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
  h4: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
  h5: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
  h6: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem' },
  body1: { xs: '0.875rem', sm: '1rem', md: '1rem', lg: '1.125rem' },
  body2: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '1rem' },
  caption: { xs: '0.625rem', sm: '0.75rem', md: '0.75rem', lg: '0.875rem' },
};

// Spacing system for responsive layouts
const spacing = {
  xs: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
  sm: { xs: 2, sm: 3, md: 4, lg: 5 },
  md: { xs: 3, sm: 4, md: 6, lg: 8 },
  lg: { xs: 4, sm: 6, md: 8, lg: 12 },
  xl: { xs: 6, sm: 8, md: 12, lg: 16 },
};

// Create base theme
let theme = createTheme({
  breakpoints: {
    values: breakpoints,
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          minHeight: 40,
          '@media (max-width: 600px)': {
            padding: '6px 12px',
            minHeight: 36,
            fontSize: '0.875rem',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          minHeight: 48,
          '@media (max-width: 600px)': {
            padding: '10px 20px',
            minHeight: 44,
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          minHeight: 32,
          fontSize: '0.75rem',
          '@media (max-width: 600px)': {
            padding: '4px 8px',
            minHeight: 28,
            fontSize: '0.7rem',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '@media (max-width: 600px)': {
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width: 600px)': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 280,
          '@media (max-width: 600px)': {
            width: '100%',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          '@media (max-width: 600px)': {
            margin: 16,
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .MuiTable-root': {
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '@media (max-width: 600px)': {
            fontSize: '0.75rem',
            height: 24,
          },
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

// Extend theme with custom responsive utilities
declare module '@mui/material/styles' {
  interface Theme {
    responsive: {
      fontSizes: typeof fontSizes;
      spacing: typeof spacing;
      isMobile: (theme: Theme) => boolean;
      isTablet: (theme: Theme) => boolean;
      isDesktop: (theme: Theme) => boolean;
    };
  }
  interface ThemeOptions {
    responsive?: {
      fontSizes?: typeof fontSizes;
      spacing?: typeof spacing;
    };
  }
}

// Add responsive utilities to theme
theme.responsive = {
  fontSizes,
  spacing,
  isMobile: (theme: Theme) => theme.breakpoints.down('sm'),
  isTablet: (theme: Theme) => theme.breakpoints.between('sm', 'md'),
  isDesktop: (theme: Theme) => theme.breakpoints.up('md'),
};

export default theme; 