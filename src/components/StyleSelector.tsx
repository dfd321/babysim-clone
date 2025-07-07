import React from 'react';
import { StyleSelectorProps } from '../types/game';
import { useTranslation } from '../contexts/TranslationContext';

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  disabled = false
}) => {
  const { t } = useTranslation();
  
  const styles = [
    { 
      id: 'Realistic' as const, 
      label: t('realistic'), 
      emoji: '🏠',
      description: t('realistic_desc')
    },
    { 
      id: 'Fantasy' as const, 
      label: t('fantasy'), 
      emoji: '🧙',
      description: t('fantasy_desc')
    },
    { 
      id: 'Thrilling' as const, 
      label: t('thrilling'), 
      emoji: '⚡',
      description: t('thrilling_desc')
    },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, styleId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onStyleSelect(styleId as any);
      }
    }
  };

  return (
    <fieldset className="space-y-4" disabled={disabled}>
      <legend className="sr-only">{t('choose_style')}</legend>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" id="style-selector-heading">{t('choose_style')}</h2>
        <p className="text-gray-600" id="style-selector-description">{t('style_question')}</p>
      </div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        role="radiogroup"
        aria-labelledby="style-selector-heading"
        aria-describedby="style-selector-description"
      >
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            role="radio"
            aria-checked={selectedStyle === style.id}
            aria-describedby={`style-${style.id}-description`}
            onClick={() => !disabled && onStyleSelect(style.id)}
            onKeyDown={(e) => handleKeyDown(e, style.id)}
            disabled={disabled}
            tabIndex={0}
            className={`
              p-6 rounded-lg border-2 transition-all duration-200 text-center
              focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
              ${selectedStyle === style.id
                ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              flex flex-col items-center gap-3
            `}
          >
            <span 
              className="text-3xl" 
              role="img" 
              aria-label={`${style.label} icon`}
            >
              {style.emoji}
            </span>
            <div>
              <h3 className="font-semibold text-lg">{style.label}</h3>
              <p className="text-sm opacity-75 mt-1" id={`style-${style.id}-description`}>
                {style.description}
              </p>
            </div>
            {selectedStyle === style.id && (
              <div className="absolute top-2 right-2" aria-hidden="true">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Screen reader announcement area */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedStyle && `Selected style: ${styles.find(s => s.id === selectedStyle)?.label}`}
      </div>
    </fieldset>
  );
};