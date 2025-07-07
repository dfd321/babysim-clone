import React, { Suspense } from 'react';
import { GameState } from '../types/game';
import { GameplayPhase } from './GameplayPhase';
import { 
  FamilyDashboard, 
  StatisticsDashboard, 
  AchievementDashboard,
  LoadingFallback 
} from '../utils/lazyComponents';

interface DashboardContainerProps {
  gameState: GameState;
  showFamilyDashboard: boolean;
  showStatisticsDashboard: boolean;
  showAchievementDashboard: boolean;
  onChildSelect: (childId: string) => void;
  onAddChild: () => void;
  onDecision: (choice: string, consequence: string, effects: any) => void;
  onRestart: () => void;
  onAchievementClose: () => void;
}

const DashboardContainerComponent: React.FC<DashboardContainerProps> = ({
  gameState,
  showFamilyDashboard,
  showStatisticsDashboard,
  showAchievementDashboard,
  onChildSelect,
  onAddChild,
  onDecision,
  onRestart,
  onAchievementClose
}) => {
  if (showFamilyDashboard) {
    return (
      <Suspense fallback={<LoadingFallback type="dashboard" />}>
        <FamilyDashboard
          gameState={gameState}
          onChildSelect={onChildSelect}
          onAddChild={onAddChild}
        />
      </Suspense>
    );
  }

  if (showStatisticsDashboard) {
    return (
      <Suspense fallback={<LoadingFallback type="dashboard" />}>
        <StatisticsDashboard
          gameState={gameState}
        />
      </Suspense>
    );
  }

  if (showAchievementDashboard) {
    return (
      <Suspense fallback={<LoadingFallback type="dashboard" />}>
        <AchievementDashboard
          gameState={gameState}
          onClose={onAchievementClose}
        />
      </Suspense>
    );
  }

  return (
    <GameplayPhase
      gameState={gameState}
      onDecision={onDecision}
      onRestart={onRestart}
    />
  );
};

// Custom comparison function for DashboardContainer
// Re-render when dashboard state changes or when gameState changes for the active dashboard
const DashboardContainer = React.memo(DashboardContainerComponent, (prevProps, nextProps) => {
  // Always re-render if dashboard selection changes
  const dashboardSelectionChanged = (
    prevProps.showFamilyDashboard !== nextProps.showFamilyDashboard ||
    prevProps.showStatisticsDashboard !== nextProps.showStatisticsDashboard ||
    prevProps.showAchievementDashboard !== nextProps.showAchievementDashboard
  );
  
  if (dashboardSelectionChanged) {
    return false; // Re-render
  }
  
  // For gameState changes, only re-render if it affects the currently displayed component
  // This is a shallow comparison - child components will handle their own deep comparisons
  
  // If no dashboard is shown (GameplayPhase), compare gameState reference
  if (!nextProps.showFamilyDashboard && !nextProps.showStatisticsDashboard && !nextProps.showAchievementDashboard) {
    return prevProps.gameState === nextProps.gameState;
  }
  
  // For dashboards, compare gameState reference (dashboards will handle their own optimization)
  return prevProps.gameState === nextProps.gameState;
  
  // Event handlers are stable from parent, no need to compare
});

DashboardContainer.displayName = 'DashboardContainer';

export { DashboardContainer };
export default React.memo(DashboardContainer);