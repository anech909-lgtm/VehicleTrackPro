
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

type Language = 'en' | 'es' | 'fr' | 'ar';
type Translations = Record<string, any>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

async function loadTranslations(locale: Language): Promise<Translations> {
  try {
    const module = await import(`@/locales/${locale}.json`);
    return module.default;
  } catch (error) {
    console.error(`Could not load translations for locale: ${locale}`, error);
    // Fallback to English if the requested locale fails
    const fallbackModule = await import(`@/locales/en.json`);
    return fallbackModule.default;
  }
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const loadedTranslations = await loadTranslations(language);
      setTranslations(loadedTranslations);

      // Set document direction for RTL support
      if (language === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      document.documentElement.lang = language;
    };

    fetchTranslations();
  }, [language]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if not found
      }
    }

    if (typeof value !== 'string') {
        return key;
    }
    
    if (replacements) {
        return Object.entries(replacements).reduce((acc, [placeholder, replacementValue]) => {
            return acc.replace(`{${placeholder}}`, String(replacementValue));
        }, value);
    }
    
    return value;
  }, [translations]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
