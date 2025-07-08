import { Theme } from '@mui/material/styles';

// Responsive spacing utilities
export const getResponsiveSpacing = (
  theme: Theme,
  spacing: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }
) => {
  return {
    [theme.breakpoints.up('xs')]: { padding: theme.spacing(spacing.xs || 1) },
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(spacing.sm || spacing.xs || 1) },
    [theme.breakpoints.up('md')]: { padding: theme.spacing(spacing.md || spacing.sm || spacing.xs || 1) },
    [theme.breakpoints.up('lg')]: { padding: theme.spacing(spacing.lg || spacing.md || spacing.sm || spacing.xs || 1) },
    [theme.breakpoints.up('xl')]: { padding: theme.spacing(spacing.xl || spacing.lg || spacing.md || spacing.sm || spacing.xs || 1) },
  };
};

// Responsive typography utilities
export const getResponsiveTypography = (
  theme: Theme,
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption'
) => {
  const fontSizeMap = {
    h1: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
    h2: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
    h3: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '2rem' },
    h4: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem' },
    h5: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem' },
    h6: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
    body1: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
    body2: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem', lg: '1rem' },
    caption: { xs: '0.5rem', sm: '0.625rem', md: '0.75rem', lg: '0.875rem' },
  };

  const sizes = fontSizeMap[variant];
  return {
    fontSize: sizes.xs,
    [theme.breakpoints.up('sm')]: { fontSize: sizes.sm },
    [theme.breakpoints.up('md')]: { fontSize: sizes.md },
    [theme.breakpoints.up('lg')]: { fontSize: sizes.lg },
  };
};

// Responsive grid utilities
export const getResponsiveGridProps = (
  theme: Theme,
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }
) => {
  return {
    xs: columns.xs || 12,
    sm: columns.sm || columns.xs || 6,
    md: columns.md || columns.sm || columns.xs || 4,
    lg: columns.lg || columns.md || columns.sm || columns.xs || 3,
    xl: columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 2,
  };
};

// Responsive margin/padding utilities
export const getResponsiveSizing = (
  theme: Theme,
  property: 'margin' | 'padding' | 'width' | 'height',
  values: {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
  }
) => {
  return {
    [property]: values.xs,
    [theme.breakpoints.up('sm')]: { [property]: values.sm || values.xs },
    [theme.breakpoints.up('md')]: { [property]: values.md || values.sm || values.xs },
    [theme.breakpoints.up('lg')]: { [property]: values.lg || values.md || values.sm || values.xs },
    [theme.breakpoints.up('xl')]: { [property]: values.xl || values.lg || values.md || values.sm || values.xs },
  };
};

// Mobile-first responsive object
export const createResponsiveObject = <T>(
  theme: Theme,
  values: {
    xs: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  }
) => {
  const result: any = {
    [theme.breakpoints.up('xs')]: values.xs,
  };

  if (values.sm !== undefined) {
    result[theme.breakpoints.up('sm')] = values.sm;
  }
  if (values.md !== undefined) {
    result[theme.breakpoints.up('md')] = values.md;
  }
  if (values.lg !== undefined) {
    result[theme.breakpoints.up('lg')] = values.lg;
  }
  if (values.xl !== undefined) {
    result[theme.breakpoints.up('xl')] = values.xl;
  }

  return result;
};

// Responsive visibility utilities
export const getResponsiveVisibility = (
  theme: Theme,
  visibility: {
    xs?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
  }
) => {
  const result: any = {};

  if (visibility.xs !== undefined) {
    result[theme.breakpoints.up('xs')] = { display: visibility.xs ? 'block' : 'none' };
  }
  if (visibility.sm !== undefined) {
    result[theme.breakpoints.up('sm')] = { display: visibility.sm ? 'block' : 'none' };
  }
  if (visibility.md !== undefined) {
    result[theme.breakpoints.up('md')] = { display: visibility.md ? 'block' : 'none' };
  }
  if (visibility.lg !== undefined) {
    result[theme.breakpoints.up('lg')] = { display: visibility.lg ? 'block' : 'none' };
  }
  if (visibility.xl !== undefined) {
    result[theme.breakpoints.up('xl')] = { display: visibility.xl ? 'block' : 'none' };
  }

  return result;
};

// Responsive flex utilities
export const getResponsiveFlex = (
  theme: Theme,
  direction: {
    xs?: 'row' | 'column';
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
    xl?: 'row' | 'column';
  }
) => {
  return {
    display: 'flex',
    flexDirection: direction.xs || 'column',
    [theme.breakpoints.up('sm')]: { flexDirection: direction.sm || direction.xs || 'column' },
    [theme.breakpoints.up('md')]: { flexDirection: direction.md || direction.sm || direction.xs || 'column' },
    [theme.breakpoints.up('lg')]: { flexDirection: direction.lg || direction.md || direction.sm || direction.xs || 'column' },
    [theme.breakpoints.up('xl')]: { flexDirection: direction.xl || direction.lg || direction.md || direction.sm || direction.xs || 'column' },
  };
};

// Responsive text alignment
export const getResponsiveTextAlign = (
  theme: Theme,
  alignment: {
    xs?: 'left' | 'center' | 'right';
    sm?: 'left' | 'center' | 'right';
    md?: 'left' | 'center' | 'right';
    lg?: 'left' | 'center' | 'right';
    xl?: 'left' | 'center' | 'right';
  }
) => {
  return {
    textAlign: alignment.xs || 'left',
    [theme.breakpoints.up('sm')]: { textAlign: alignment.sm || alignment.xs || 'left' },
    [theme.breakpoints.up('md')]: { textAlign: alignment.md || alignment.sm || alignment.xs || 'left' },
    [theme.breakpoints.up('lg')]: { textAlign: alignment.lg || alignment.md || alignment.sm || alignment.xs || 'left' },
    [theme.breakpoints.up('xl')]: { textAlign: alignment.xl || alignment.lg || alignment.md || alignment.sm || alignment.xs || 'left' },
  };
}; 