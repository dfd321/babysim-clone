import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, TranslationService } from '../services/translationService';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    TranslationService.setLanguage(newLanguage);
  };

  const t = (key: string) => TranslationService.translate(key);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};