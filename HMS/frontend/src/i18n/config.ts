export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
}

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  loadPath: string;
  debug: boolean;
}

// Supported locales configuration
export const locales: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '$',
    },
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before',
    },
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€',
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: '€',
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€',
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'د.ك',
    },
    currency: {
      code: 'KWD',
      symbol: 'د.ك',
      position: 'after',
    },
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹',
    },
    currency: {
      code: 'INR',
      symbol: '₹',
      position: 'before',
    },
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥',
    },
    currency: {
      code: 'CNY',
      symbol: '¥',
      position: 'before',
    },
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥',
    },
    currency: {
      code: 'JPY',
      symbol: '¥',
      position: 'before',
    },
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₩',
    },
    currency: {
      code: 'KRW',
      symbol: '₩',
      position: 'before',
    },
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'R$',
    },
    currency: {
      code: 'BRL',
      symbol: 'R$',
      position: 'before',
    },
  },
};

// Default i18n configuration
export const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: Object.keys(locales),
  fallbackLocale: 'en',
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  debug: process.env.NODE_ENV === 'development',
};

// Get locale configuration
export const getLocaleConfig = (locale: string): LocaleConfig => {
  return locales[locale] || locales[i18nConfig.fallbackLocale];
};

// Check if locale is RTL
export const isRTL = (locale: string): boolean => {
  const config = getLocaleConfig(locale);
  return config.direction === 'rtl';
};

// Get supported locales list
export const getSupportedLocales = (): LocaleConfig[] => {
  return Object.values(locales);
};

// Validate locale
export const isValidLocale = (locale: string): boolean => {
  return Object.keys(locales).includes(locale);
}; 