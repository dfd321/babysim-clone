import React, { useState } from 'react';
import { Globe, Info, Home } from 'lucide-react';

interface HeaderProps {
  onShowInfo?: () => void;
  onRestart?: () => void;
  currentPhase?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onShowInfo,
  onRestart,
  currentPhase = 'setup'
}) => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
    // TODO: Implement actual language switching
  };

  const texts = {
    en: {
      title: 'BabySim',
      subtitle: 'Parenting Simulator',
      restart: 'New Game',
      info: 'Information',
      language: 'Español'
    },
    es: {
      title: 'BabySim',
      subtitle: 'Simulador de Crianza',
      restart: 'Nuevo Juego', 
      info: 'Información',
      language: 'English'
    }
  };

  const currentTexts = texts[language];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👶</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {currentTexts.title}
              </h1>
              <p className="text-xs text-gray-500">
                {currentTexts.subtitle}
              </p>
            </div>
          </div>

          {/* Phase Indicator */}
          {currentPhase !== 'setup' && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 capitalize">
                {currentPhase.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              title={`Switch to ${currentTexts.language}`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Info Button */}
            {onShowInfo && (
              <button
                onClick={onShowInfo}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                title={currentTexts.info}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">
                  {currentTexts.info}
                </span>
              </button>
            )}

            {/* Restart Button */}
            {onRestart && currentPhase !== 'setup' && (
              <button
                onClick={onRestart}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title={currentTexts.restart}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">
                  {currentTexts.restart}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};