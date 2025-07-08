import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isExtraWide: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

export interface ResponsiveHelpers {
  isScreenSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => boolean;
  isScreenSizeUp: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => boolean;
  isScreenSizeDown: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => boolean;
  getResponsiveValue: <T>(values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  }) => T | undefined;
  getSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => number;
}

export const useResponsive = (): ResponsiveBreakpoints & ResponsiveHelpers => {
  const theme = useTheme();

  // Basic breakpoint checks
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isWide = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraWide = useMediaQuery(theme.breakpoints.up('xl'));

  // Orientation checks
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');

  // Screen size checks
  const isScreenSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): boolean => {
    switch (size) {
      case 'xs':
        return useMediaQuery(theme.breakpoints.only('xs'));
      case 'sm':
        return useMediaQuery(theme.breakpoints.only('sm'));
      case 'md':
        return useMediaQuery(theme.breakpoints.only('md'));
      case 'lg':
        return useMediaQuery(theme.breakpoints.only('lg'));
      case 'xl':
        return useMediaQuery(theme.breakpoints.only('xl'));
      default:
        return false;
    }
  };

  const isScreenSizeUp = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): boolean => {
    return useMediaQuery(theme.breakpoints.up(size));
  };

  const isScreenSizeDown = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): boolean => {
    return useMediaQuery(theme.breakpoints.down(size));
  };

  // Responsive value helper
  const getResponsiveValue = <T>(values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  }): T | undefined => {
    if (isScreenSize('xl') && values.xl !== undefined) return values.xl;
    if (isScreenSize('lg') && values.lg !== undefined) return values.lg;
    if (isScreenSize('md') && values.md !== undefined) return values.md;
    if (isScreenSize('sm') && values.sm !== undefined) return values.sm;
    if (isScreenSize('xs') && values.xs !== undefined) return values.xs;
    
    // Fallback to first defined value
    return values.xl || values.lg || values.md || values.sm || values.xs;
  };

  // Spacing helper
  const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): number => {
    const spacingMap = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    };
    return spacingMap[size];
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isExtraWide,
    isLandscape,
    isPortrait,
    isScreenSize,
    isScreenSizeUp,
    isScreenSizeDown,
    getResponsiveValue,
    getSpacing,
  };
};

export default useResponsive; 