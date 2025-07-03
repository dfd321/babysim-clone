// Save/Load game service using localStorage
import { 
  GameState, 
  SaveGame, 
  SaveGameMetadata, 
  SaveGameService as ISaveGameService 
} from '../types/game';

const STORAGE_KEYS = {
  SAVES: 'babysim_saves',
  AUTO_SAVE: 'babysim_autosave',
  METADATA: 'babysim_save_metadata'
} as const;

const CURRENT_VERSION = '1.0.0';

class LocalStorageSaveGameService implements ISaveGameService {
  
  private generateId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateProgress(gameState: GameState): number {
    const ageProgression = [1, 3, 4, 6, 7, 9, 10, 12, 16, 18];
    const currentIndex = ageProgression.indexOf(gameState.currentAge);
    return Math.round(((currentIndex + 1) / ageProgression.length) * 100);
  }

  private generateSaveName(gameState: GameState): string {
    const childName = gameState.childCharacter?.name || 'Child';
    const age = gameState.currentAge;
    const timestamp = new Date().toLocaleDateString();
    
    return `${childName} (Age ${age}) - ${timestamp}`;
  }

  private validateGameState(gameState: GameState): boolean {
    return !!(
      gameState &&
      typeof gameState.currentAge === 'number' &&
      gameState.phase &&
      Array.isArray(gameState.timeline)
    );
  }

  async saveGame(gameState: GameState, name?: string): Promise<SaveGame> {
    if (!this.validateGameState(gameState)) {
      throw new Error('Invalid game state provided');
    }

    const saveId = this.generateId();
    const now = new Date();
    const saveName = name || this.generateSaveName(gameState);

    const saveGame: SaveGame = {
      id: saveId,
      name: saveName,
      gameState: { ...gameState },
      createdAt: now,
      lastModified: now,
      version: CURRENT_VERSION
    };

    try {
      // Get existing saves
      const existingSaves = await this.getAllSaveGames();
      existingSaves[saveId] = saveGame;

      // Store saves
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(existingSaves));

      // Update metadata
      await this.updateMetadata();

      return saveGame;
    } catch (error) {
      throw new Error(`Failed to save game: ${error}`);
    }
  }

  async loadGame(saveId: string): Promise<GameState> {
    try {
      const saves = await this.getAllSaveGames();
      const saveGame = saves[saveId];

      if (!saveGame) {
        throw new Error(`Save game with ID ${saveId} not found`);
      }

      if (!this.validateGameState(saveGame.gameState)) {
        throw new Error('Corrupted save game data');
      }

      return { ...saveGame.gameState };
    } catch (error) {
      throw new Error(`Failed to load game: ${error}`);
    }
  }

  async getAllSaves(): Promise<SaveGameMetadata[]> {
    try {
      const saves = await this.getAllSaveGames();
      
      return Object.values(saves).map(save => ({
        id: save.id,
        name: save.name,
        createdAt: new Date(save.createdAt),
        lastModified: new Date(save.lastModified),
        currentAge: save.gameState.currentAge,
        childName: save.gameState.childCharacter?.name || 'Unknown',
        parentName: save.gameState.parentCharacter?.name || 'Unknown',
        gameStyle: save.gameState.gameStyle || 'Realistic',
        progress: this.calculateProgress(save.gameState)
      })).sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    } catch (error) {
      console.warn('Failed to load save metadata:', error);
      return [];
    }
  }

  async deleteSave(saveId: string): Promise<void> {
    try {
      const saves = await this.getAllSaveGames();
      
      if (!saves[saveId]) {
        throw new Error(`Save game with ID ${saveId} not found`);
      }

      delete saves[saveId];
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(saves));
      
      await this.updateMetadata();
    } catch (error) {
      throw new Error(`Failed to delete save game: ${error}`);
    }
  }

  async renameSave(saveId: string, newName: string): Promise<void> {
    try {
      const saves = await this.getAllSaveGames();
      const saveGame = saves[saveId];
      
      if (!saveGame) {
        throw new Error(`Save game with ID ${saveId} not found`);
      }

      saveGame.name = newName;
      saveGame.lastModified = new Date();
      
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(saves));
      await this.updateMetadata();
    } catch (error) {
      throw new Error(`Failed to rename save game: ${error}`);
    }
  }

  async exportSave(saveId: string): Promise<string> {
    try {
      const saves = await this.getAllSaveGames();
      const saveGame = saves[saveId];
      
      if (!saveGame) {
        throw new Error(`Save game with ID ${saveId} not found`);
      }

      const exportData = {
        version: CURRENT_VERSION,
        exportedAt: new Date().toISOString(),
        saveGame
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`Failed to export save game: ${error}`);
    }
  }

  async importSave(saveData: string): Promise<SaveGame> {
    try {
      const importData = JSON.parse(saveData);
      
      if (!importData.saveGame || !this.validateGameState(importData.saveGame.gameState)) {
        throw new Error('Invalid save data format');
      }

      // Generate new ID for imported save to avoid conflicts
      const newSaveId = this.generateId();
      const importedSave: SaveGame = {
        ...importData.saveGame,
        id: newSaveId,
        name: `${importData.saveGame.name} (Imported)`,
        lastModified: new Date()
      };

      const saves = await this.getAllSaveGames();
      saves[newSaveId] = importedSave;
      
      localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(saves));
      await this.updateMetadata();

      return importedSave;
    } catch (error) {
      throw new Error(`Failed to import save game: ${error}`);
    }
  }

  async getAutoSave(): Promise<GameState | null> {
    try {
      const autoSaveData = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
      
      if (!autoSaveData) {
        return null;
      }

      const gameState = JSON.parse(autoSaveData);
      
      if (!this.validateGameState(gameState)) {
        localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
        return null;
      }

      return gameState;
    } catch (error) {
      console.warn('Failed to load auto-save:', error);
      localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
      return null;
    }
  }

  async setAutoSave(gameState: GameState): Promise<void> {
    if (!this.validateGameState(gameState)) {
      throw new Error('Invalid game state for auto-save');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(gameState));
    } catch (error) {
      console.warn('Failed to create auto-save:', error);
    }
  }

  // Private helper methods

  private async getAllSaveGames(): Promise<Record<string, SaveGame>> {
    try {
      const savesData = localStorage.getItem(STORAGE_KEYS.SAVES);
      return savesData ? JSON.parse(savesData) : {};
    } catch (error) {
      console.warn('Failed to parse save games, returning empty object:', error);
      return {};
    }
  }

  private async updateMetadata(): Promise<void> {
    try {
      const saves = await this.getAllSaveGames();
      const metadata = {
        totalSaves: Object.keys(saves).length,
        lastUpdated: new Date().toISOString(),
        version: CURRENT_VERSION
      };
      
      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to update metadata:', error);
    }
  }

  // Utility methods for storage management

  async getStorageInfo(): Promise<{ used: number; available: number; saveCount: number }> {
    const saves = await this.getAllSaveGames();
    const saveCount = Object.keys(saves).length;
    
    // Estimate storage usage
    const totalData = localStorage.getItem(STORAGE_KEYS.SAVES) || '';
    const used = new Blob([totalData]).size;
    
    // LocalStorage typically has 5-10MB limit, we'll use 5MB as conservative estimate
    const available = 5 * 1024 * 1024 - used;

    return { used, available, saveCount };
  }

  async clearAllSaves(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SAVES);
    localStorage.removeItem(STORAGE_KEYS.METADATA);
    localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
  }
}

// Export singleton instance
export const saveGameService = new LocalStorageSaveGameService();