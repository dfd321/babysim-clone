import React from 'react';
import { GameState } from '../types/game';
import { useTranslation } from '../contexts/TranslationContext';
import { FamilyManagementService } from '../services/familyManagementService';

interface GameplayHeaderProps {
  gameState: GameState;
  showFamilyDashboard: boolean;
  showStatisticsDashboard: boolean;
  showAchievementDashboard: boolean;
  onFamilyToggle: () => void;
  onStatisticsToggle: () => void;
  onAchievementToggle: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
}

const GameplayHeaderComponent: React.FC<GameplayHeaderProps> = ({
  gameState,
  showFamilyDashboard,
  showStatisticsDashboard,
  showAchievementDashboard,
  onFamilyToggle,
  onStatisticsToggle,
  onAchievementToggle,
  onSaveClick,
  onLoadClick
}) => {
  const { t } = useTranslation();

  const getTitle = () => {
    const childrenCount = Object.keys(gameState.children).length;
    if (childrenCount > 1) {
      return `${t('babysim')} - ${t('managing_family')}`;
    }
    const childName = gameState.childCharacter?.name || FamilyManagementService.getActiveChild(gameState)?.name;
    return `${t('babysim')} - ${t('raising')} ${childName}`;
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">
        {getTitle()}
      </h1>
      <div className="flex gap-2">
        {Object.keys(gameState.children).length > 0 && (
          <>
            <button
              onClick={onFamilyToggle}
              className={`px-4 py-2 rounded transition-colors ${
                showFamilyDashboard 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {t('family')} ({Object.keys(gameState.children).length})
            </button>
            <button
              onClick={onStatisticsToggle}
              className={`px-4 py-2 rounded transition-colors ${
                showStatisticsDashboard 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {t('analytics')}
            </button>
            <button
              onClick={onAchievementToggle}
              className={`px-4 py-2 rounded transition-colors ${
                showAchievementDashboard 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              🏆 {t('achievements')} ({gameState.achievements.stats.achievementsUnlocked})
            </button>
          </>
        )}
        <button
          onClick={onSaveClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Save Game
        </button>
        <button
          onClick={onLoadClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Load Game
        </button>
      </div>
    </div>
  );
};

// Custom comparison function for GameplayHeader
// Only re-render when relevant parts of gameState or dashboard states change
const GameplayHeader = React.memo(GameplayHeaderComponent, (prevProps, nextProps) => {
  // Check children changes (affects title and family button count)
  const prevChildrenCount = Object.keys(prevProps.gameState.children).length;
  const nextChildrenCount = Object.keys(nextProps.gameState.children).length;
  
  // Check achievement count changes (affects achievement button)
  const prevAchievements = prevProps.gameState.achievements.stats.achievementsUnlocked;
  const nextAchievements = nextProps.gameState.achievements.stats.achievementsUnlocked;
  
  // Check child character name changes (affects title)
  const prevChildName = prevProps.gameState.childCharacter?.name;
  const nextChildName = nextProps.gameState.childCharacter?.name;
  
  // Check dashboard state changes (affects button styling)
  const dashboardStatesEqual = (
    prevProps.showFamilyDashboard === nextProps.showFamilyDashboard &&
    prevProps.showStatisticsDashboard === nextProps.showStatisticsDashboard &&
    prevProps.showAchievementDashboard === nextProps.showAchievementDashboard
  );
  
  return (
    prevChildrenCount === nextChildrenCount &&
    prevAchievements === nextAchievements &&
    prevChildName === nextChildName &&
    dashboardStatesEqual
    // Event handlers are stable from parent, no need to compare
  );
});

GameplayHeader.displayName = 'GameplayHeader';

export { GameplayHeader };