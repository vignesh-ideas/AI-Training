// ARIA attribute helpers
export const createAriaLabel = (label: string, context?: string): string => {
  return context ? `${label} ${context}` : label;
};

export const createAriaDescribedBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

export const createAriaControls = (controlledId: string): string => {
  return controlledId;
};

export const createAriaOwns = (ownedId: string): string => {
  return ownedId;
};

// Keyboard navigation helpers
export const isKeyboardEvent = (event: KeyboardEvent): boolean => {
  return ['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(event.key);
};

export const isModifierKey = (event: KeyboardEvent): boolean => {
  return event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];
};

export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container);
  let currentFocusIndex = 0;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      
      if (event.shiftKey) {
        currentFocusIndex = currentFocusIndex > 0 ? currentFocusIndex - 1 : focusableElements.length - 1;
      } else {
        currentFocusIndex = currentFocusIndex < focusableElements.length - 1 ? currentFocusIndex + 1 : 0;
      }
      
      focusableElements[currentFocusIndex]?.focus();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Screen reader helpers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

export const createLiveRegion = (priority: 'polite' | 'assertive' = 'polite'): HTMLDivElement => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  
  document.body.appendChild(liveRegion);
  return liveRegion;
};

// Focus management helpers
export const focusFirstElement = (container: HTMLElement): void => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
};

export const focusLastElement = (container: HTMLElement): void => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
  }
};

export const focusNextElement = (currentElement: HTMLElement): void => {
  const container = currentElement.closest('[role="dialog"], [role="menu"], body') as HTMLElement;
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
    focusableElements[currentIndex + 1].focus();
  } else if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
};

export const focusPreviousElement = (currentElement: HTMLElement): void => {
  const container = currentElement.closest('[role="dialog"], [role="menu"], body') as HTMLElement;
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex > 0) {
    focusableElements[currentIndex - 1].focus();
  } else if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
  }
};

// Color contrast helpers
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (c <= 0.03928) {
        return c / 12.92;
      }
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export const isContrastCompliant = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  const minRatio = level === 'AA' ? 4.5 : 7;
  return ratio >= minRatio;
};

// Semantic HTML helpers
export const getHeadingLevel = (level: 1 | 2 | 3 | 4 | 5 | 6): string => {
  return `h${level}`;
};

export const createLandmark = (role: string, label?: string): { role: string; 'aria-label'?: string } => {
  return {
    role,
    ...(label && { 'aria-label': label }),
  };
};

export const createButtonRole = (pressed?: boolean, expanded?: boolean): { role: string; 'aria-pressed'?: boolean; 'aria-expanded'?: boolean } => {
  return {
    role: 'button',
    ...(pressed !== undefined && { 'aria-pressed': pressed }),
    ...(expanded !== undefined && { 'aria-expanded': expanded }),
  };
};

// Form accessibility helpers
export const createFormField = (id: string, label: string, required?: boolean): {
  id: string;
  'aria-labelledby': string;
  'aria-required'?: boolean;
} => {
  return {
    id,
    'aria-labelledby': `${id}-label`,
    ...(required && { 'aria-required': true }),
  };
};

export const createFormLabel = (id: string, label: string, required?: boolean): {
  id: string;
  htmlFor: string;
} => {
  return {
    id: `${id}-label`,
    htmlFor: id,
  };
};

// List accessibility helpers
export const createListRole = (type: 'list' | 'menu' | 'menubar' | 'tablist'): { role: string } => {
  return { role: type };
};

export const createListItemRole = (type: 'listitem' | 'menuitem' | 'tab'): { role: string } => {
  return { role: type };
};

// Table accessibility helpers
export const createTableRole = (): { role: string } => {
  return { role: 'table' };
};

export const createTableHeaderRole = (): { role: string } => {
  return { role: 'columnheader' };
};

export const createTableRowRole = (): { role: string } => {
  return { role: 'row' };
};

export const createTableCellRole = (): { role: string } => {
  return { role: 'cell' };
};

// Dialog accessibility helpers
export const createDialogRole = (modal: boolean = true): { role: string; 'aria-modal'?: boolean } => {
  return {
    role: 'dialog',
    ...(modal && { 'aria-modal': true }),
  };
};

// Progress indicators
export const createProgressRole = (value: number, min: number = 0, max: number = 100): {
  role: string;
  'aria-valuenow': number;
  'aria-valuemin': number;
  'aria-valuemax': number;
} => {
  return {
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
  };
};

// Status messages
export const createStatusRole = (): { role: string; 'aria-live': string } => {
  return {
    role: 'status',
    'aria-live': 'polite',
  };
};

export const createAlertRole = (): { role: string; 'aria-live': string } => {
  return {
    role: 'alert',
    'aria-live': 'assertive',
  };
}; 