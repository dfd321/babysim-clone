import React, { Suspense } from 'react';
import { SaveGameMetadata, UnlockedAchievement } from '../types/game';
import { AchievementNotificationManager } from './AchievementNotification';
import { SaveLoadMenu, InformationCenter, LoadingFallback } from '../utils/lazyComponents';

interface ModalManagerProps {
  showSaveMenu: boolean;
  showLoadMenu: boolean;
  showInformationCenter: boolean;
  saveGameMetadata: SaveGameMetadata[];
  saveError: string | null;
  loadError: string | null;
  newAchievementUnlocks: UnlockedAchievement[];
  onSave: (customName?: string) => void;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  onExport: (saveId: string) => void;
  onImport: (file: File) => void;
  onCloseSave: () => void;
  onCloseLoad: () => void;
  onCloseInfo: () => void;
  onClearNotifications: () => void;
}

const ModalManagerComponent: React.FC<ModalManagerProps> = ({
  showSaveMenu,
  showLoadMenu,
  showInformationCenter,
  saveGameMetadata,
  saveError,
  loadError,
  newAchievementUnlocks,
  onSave,
  onLoad,
  onDelete,
  onExport,
  onImport,
  onCloseSave,
  onCloseLoad,
  onCloseInfo,
  onClearNotifications
}) => {
  return (
    <>
      {/* Save/Load Menu Modals */}
      {showSaveMenu && (
        <Suspense fallback={<LoadingFallback type="modal" />}>
          <SaveLoadMenu
            saves={saveGameMetadata}
            onSave={onSave}
            onLoad={onLoad}
            onDelete={onDelete}
            onExport={onExport}
            onImport={onImport}
            onClose={onCloseSave}
            mode="save"
            saveError={saveError}
            loadError={loadError}
          />
        </Suspense>
      )}

      {showLoadMenu && (
        <Suspense fallback={<LoadingFallback type="modal" />}>
          <SaveLoadMenu
            saves={saveGameMetadata}
            onSave={onSave}
            onLoad={onLoad}
            onDelete={onDelete}
            onExport={onExport}
            onImport={onImport}
            onClose={onCloseLoad}
            mode="load"
            saveError={saveError}
            loadError={loadError}
          />
        </Suspense>
      )}

      {/* Achievement Notifications */}
      <AchievementNotificationManager
        newUnlocks={newAchievementUnlocks}
        onClearNotifications={onClearNotifications}
      />

      {/* Information Center Modal */}
      {showInformationCenter && (
        <Suspense fallback={<LoadingFallback type="modal" />}>
          <InformationCenter
            isOpen={showInformationCenter}
            onClose={onCloseInfo}
          />
        </Suspense>
      )}
    </>
  );
};

// Custom comparison function for ModalManager
// Re-render when any modal state changes or relevant data changes
const ModalManager = React.memo(ModalManagerComponent, (prevProps, nextProps) => {
  // Modal visibility changes
  const modalVisibilityChanged = (
    prevProps.showSaveMenu !== nextProps.showSaveMenu ||
    prevProps.showLoadMenu !== nextProps.showLoadMenu ||
    prevProps.showInformationCenter !== nextProps.showInformationCenter
  );
  
  if (modalVisibilityChanged) {
    return false; // Re-render
  }
  
  // Error state changes (affects save/load modals)
  const errorStatesChanged = (
    prevProps.saveError !== nextProps.saveError ||
    prevProps.loadError !== nextProps.loadError
  );
  
  if (errorStatesChanged) {
    return false; // Re-render
  }
  
  // Save game metadata changes (affects save/load modals)
  const saveGameMetadataChanged = (
    prevProps.saveGameMetadata.length !== nextProps.saveGameMetadata.length ||
    prevProps.saveGameMetadata !== nextProps.saveGameMetadata
  );
  
  if (saveGameMetadataChanged) {
    return false; // Re-render
  }
  
  // Achievement notifications changes
  const achievementNotificationsChanged = (
    prevProps.newAchievementUnlocks.length !== nextProps.newAchievementUnlocks.length ||
    prevProps.newAchievementUnlocks !== nextProps.newAchievementUnlocks
  );
  
  if (achievementNotificationsChanged) {
    return false; // Re-render
  }
  
  // All props are equal, skip re-render
  return true;
  
  // Event handlers are stable from parent, no need to compare
});

ModalManager.displayName = 'ModalManager';

export { ModalManager };