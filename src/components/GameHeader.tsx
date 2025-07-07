import React from 'react';
import { GamePhase } from '../types/game';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../contexts/TranslationContext';

interface GameHeaderProps {
  gamePhase: GamePhase;
  onSaveClick: () => void;
  onLoadClick: () => void;
}

const GameHeaderComponent: React.FC<GameHeaderProps> = ({ 
  gamePhase, 
  onSaveClick, 
  onLoadClick 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end items-center mb-8">
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Save/Load Buttons - only show during gameplay */}
        {gamePhase === 'gameplay' && (
          <div className="flex gap-2">
            <button
              onClick={onSaveClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              💾 {t('save')}
            </button>
            <button
              onClick={onLoadClick}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              📂 {t('load')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom comparison function for GameHeader
// Only re-render when gamePhase changes (handlers are stable from parent)
const GameHeader = React.memo(GameHeaderComponent, (prevProps, nextProps) => {
  return (
    prevProps.gamePhase === nextProps.gamePhase
    // onSaveClick and onLoadClick are stable functions from parent, no need to compare
  );
});

GameHeader.displayName = 'GameHeader';

export { GameHeader };