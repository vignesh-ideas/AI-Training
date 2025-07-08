import { useEffect, useRef, useState, useCallback } from 'react';

export interface AccessibilityOptions {
  enableFocusTrap?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReaderAnnouncements?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
  enableLargeText?: boolean;
}

export interface AccessibilityState {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isLargeText: boolean;
  focusVisible: boolean;
  currentFocus: HTMLElement | null;
}

export interface AccessibilityActions {
  announceToScreenReader: (message: string) => void;
  focusElement: (element: HTMLElement) => void;
  trapFocus: (container: HTMLElement) => void;
  releaseFocus: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  navigateWithKeyboard: (direction: 'next' | 'previous' | 'first' | 'last') => void;
}

export const useAccessibility = (options: AccessibilityOptions = {}): AccessibilityState & AccessibilityActions => {
  const {
    enableFocusTrap = true,
    enableKeyboardNavigation = true,
    enableScreenReaderAnnouncements = true,
    enableHighContrast = true,
    enableReducedMotion = true,
    enableLargeText = true,
  } = options;

  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<HTMLElement | null>(null);

  const focusTrapRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string) => {
    if (!enableScreenReaderAnnouncements) return;

    if (!announcementRef.current) {
      const announcementDiv = document.createElement('div');
      announcementDiv.setAttribute('aria-live', 'polite');
      announcementDiv.setAttribute('aria-atomic', 'true');
      announcementDiv.style.position = 'absolute';
      announcementDiv.style.left = '-10000px';
      announcementDiv.style.width = '1px';
      announcementDiv.style.height = '1px';
      announcementDiv.style.overflow = 'hidden';
      document.body.appendChild(announcementDiv);
      announcementRef.current = announcementDiv;
    }

    announcementRef.current.textContent = message;
  }, [enableScreenReaderAnnouncements]);

  // Focus management
  const focusElement = useCallback((element: HTMLElement) => {
    element.focus();
    setCurrentFocus(element);
    announceToScreenReader(`Focused on ${element.textContent || element.getAttribute('aria-label') || 'element'}`);
  }, [announceToScreenReader]);

  // Focus trap
  const trapFocus = useCallback((container: HTMLElement) => {
    if (!enableFocusTrap) return;

    focusTrapRef.current = container;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElementsRef.current = Array.from(focusableElements) as HTMLElement[];

    if (focusableElementsRef.current.length > 0) {
      focusElement(focusableElementsRef.current[0]);
    }
  }, [enableFocusTrap, focusElement]);

  const releaseFocus = useCallback(() => {
    focusTrapRef.current = null;
    focusableElementsRef.current = [];
    setCurrentFocus(null);
  }, []);

  // Keyboard navigation
  const navigateWithKeyboard = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    if (!enableKeyboardNavigation || focusableElementsRef.current.length === 0) return;

    const currentIndex = focusableElementsRef.current.findIndex(el => el === document.activeElement);
    let newIndex = 0;

    switch (direction) {
      case 'next':
        newIndex = currentIndex < focusableElementsRef.current.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'previous':
        newIndex = currentIndex > 0 ? currentIndex - 1 : focusableElementsRef.current.length - 1;
        break;
      case 'first':
        newIndex = 0;
        break;
      case 'last':
        newIndex = focusableElementsRef.current.length - 1;
        break;
    }

    focusElement(focusableElementsRef.current[newIndex]);
  }, [enableKeyboardNavigation, focusElement]);

  // Accessibility toggles
  const toggleHighContrast = useCallback(() => {
    if (!enableHighContrast) return;

    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    
    if (newValue) {
      document.body.classList.add('high-contrast');
      announceToScreenReader('High contrast mode enabled');
    } else {
      document.body.classList.remove('high-contrast');
      announceToScreenReader('High contrast mode disabled');
    }
  }, [isHighContrast, enableHighContrast, announceToScreenReader]);

  const toggleReducedMotion = useCallback(() => {
    if (!enableReducedMotion) return;

    const newValue = !isReducedMotion;
    setIsReducedMotion(newValue);
    
    if (newValue) {
      document.body.classList.add('reduced-motion');
      announceToScreenReader('Reduced motion enabled');
    } else {
      document.body.classList.remove('reduced-motion');
      announceToScreenReader('Reduced motion disabled');
    }
  }, [isReducedMotion, enableReducedMotion, announceToScreenReader]);

  const toggleLargeText = useCallback(() => {
    if (!enableLargeText) return;

    const newValue = !isLargeText;
    setIsLargeText(newValue);
    
    if (newValue) {
      document.body.classList.add('large-text');
      announceToScreenReader('Large text mode enabled');
    } else {
      document.body.classList.remove('large-text');
      announceToScreenReader('Large text mode disabled');
    }
  }, [isLargeText, enableLargeText, announceToScreenReader]);

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

  // Keyboard event handling
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab navigation
      if (event.key === 'Tab') {
        if (focusTrapRef.current && focusableElementsRef.current.length > 0) {
          const firstElement = focusableElementsRef.current[0];
          const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              focusElement(lastElement);
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              focusElement(firstElement);
            }
          }
        }
      }

      // Arrow key navigation
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        navigateWithKeyboard('next');
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateWithKeyboard('previous');
      }

      // Home/End navigation
      if (event.key === 'Home') {
        event.preventDefault();
        navigateWithKeyboard('first');
      } else if (event.key === 'End') {
        event.preventDefault();
        navigateWithKeyboard('last');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardNavigation, navigateWithKeyboard, focusElement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  return {
    // State
    isHighContrast,
    isReducedMotion,
    isLargeText,
    focusVisible,
    currentFocus,

    // Actions
    announceToScreenReader,
    focusElement,
    trapFocus,
    releaseFocus,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    navigateWithKeyboard,
  };
};

export default useAccessibility; 