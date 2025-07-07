import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
          language === 'en' 
            ? 'bg-blue-100 ring-2 ring-blue-500' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
        style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
      >
        <span className="text-lg" style={{ lineHeight: 1 }}>🇺🇸</span>
      </button>
      
      <button
        onClick={() => setLanguage('zh')}
        className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
          language === 'zh' 
            ? 'bg-blue-100 ring-2 ring-blue-500' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="Switch to Chinese"
        style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
      >
        <span className="text-lg" style={{ lineHeight: 1 }}>🇨🇳</span>
      </button>
    </div>
  );
};