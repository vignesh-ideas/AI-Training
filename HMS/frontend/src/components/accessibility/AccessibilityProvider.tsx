import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import accessibilityTheme from '@/theme/accessibilityTheme';

interface AccessibilityContextType {
  // Settings
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
  
  // Actions
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  announceToScreenReader: (message: string) => void;
  
  // Utilities
  isKeyboardUser: boolean;
  isScreenReaderUser: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [isScreenReaderUser, setIsScreenReaderUser] = useState(false);

  // Announcement element for screen readers
  const [announcementElement, setAnnouncementElement] = useState<HTMLDivElement | null>(null);

  // Initialize announcement element
  useEffect(() => {
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    div.style.position = 'absolute';
    div.style.left = '-10000px';
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.overflow = 'hidden';
    document.body.appendChild(div);
    setAnnouncementElement(div);

    return () => {
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };
  }, []);

  // Announce to screen reader
  const announceToScreenReader = (message: string) => {
    if (announcementElement) {
      announcementElement.textContent = message;
    }
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (newValue) {
      document.body.classList.add('high-contrast');
      announceToScreenReader('High contrast mode enabled');
    } else {
      document.body.classList.remove('high-contrast');
      announceToScreenReader('High contrast mode disabled');
    }
    
    // Save to localStorage
    localStorage.setItem('hms-high-contrast', newValue.toString());
  };

  // Toggle reduced motion
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    
    if (newValue) {
      document.body.classList.add('reduced-motion');
      announceToScreenReader('Reduced motion enabled');
    } else {
      document.body.classList.remove('reduced-motion');
      announceToScreenReader('Reduced motion disabled');
    }
    
    // Save to localStorage
    localStorage.setItem('hms-reduced-motion', newValue.toString());
  };

  // Toggle large text
  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    
    if (newValue) {
      document.body.classList.add('large-text');
      announceToScreenReader('Large text mode enabled');
    } else {
      document.body.classList.remove('large-text');
      announceToScreenReader('Large text mode disabled');
    }
    
    // Save to localStorage
    localStorage.setItem('hms-large-text', newValue.toString());
  };

  // Detect keyboard users
  useEffect(() => {
    const handleKeyDown = () => {
      setIsKeyboardUser(true);
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Detect screen reader users
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsScreenReaderUser(e.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    setIsScreenReaderUser(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Focus visible detection
  useEffect(() => {
    const handleFocusVisible = () => {
      setFocusVisible(true);
    };

    const handleFocusInvisible = () => {
      setFocusVisible(false);
    };

    document.addEventListener('focusin', handleFocusVisible);
    document.addEventListener('focusout', handleFocusInvisible);

    return () => {
      document.removeEventListener('focusin', handleFocusVisible);
      document.removeEventListener('focusout', handleFocusInvisible);
    };
  }, []);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('hms-high-contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('hms-reduced-motion') === 'true';
    const savedLargeText = localStorage.getItem('hms-large-text') === 'true';

    if (savedHighContrast) {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }

    if (savedReducedMotion) {
      setReducedMotion(true);
      document.body.classList.add('reduced-motion');
    }

    if (savedLargeText) {
      setLargeText(true);
      document.body.classList.add('large-text');
    }
  }, []);

  // Apply accessibility CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.style.setProperty('--focus-ring-color', '#FFFFFF');
      root.style.setProperty('--focus-ring-width', '3px');
    } else {
      root.style.setProperty('--focus-ring-color', '#0052CC');
      root.style.setProperty('--focus-ring-width', '2px');
    }

    if (reducedMotion) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--transition-duration', '0.2s');
    }

    if (largeText) {
      root.style.setProperty('--font-size-multiplier', '1.2');
    } else {
      root.style.setProperty('--font-size-multiplier', '1');
    }
  }, [highContrast, reducedMotion, largeText]);

  const contextValue: AccessibilityContextType = {
    // Settings
    highContrast,
    reducedMotion,
    largeText,
    focusVisible,
    
    // Actions
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    announceToScreenReader,
    
    // Utilities
    isKeyboardUser,
    isScreenReaderUser,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <ThemeProvider theme={accessibilityTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context
export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider; 