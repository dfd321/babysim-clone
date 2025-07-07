import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface GameFooterProps {
  onInfoClick: () => void;
}

const GameFooterComponent: React.FC<GameFooterProps> = ({ onInfoClick }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
      <button
        onClick={onInfoClick}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
        title={t('open_info_center')}
      >
        <span className="text-xl">ℹ️</span>
      </button>
      <a
        href="mailto:dfdaniels@gmail.com"
        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
        title={t('send_feedback')}
      >
        <span className="text-xl">📧</span>
      </a>
    </div>
  );
};

// GameFooter is essentially static - only the onInfoClick handler can change
// Since the handler is stable from parent, we can use a simple memo with no comparison function
// This component will almost never re-render unnecessarily
const GameFooter = React.memo(GameFooterComponent);

GameFooter.displayName = 'GameFooter';

export { GameFooter };