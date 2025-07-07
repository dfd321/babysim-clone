// Save/Load game service using localStorage
import { 
  GameState, 
  SaveGame, 
  SaveGameMetadata, 
  SaveGameService as ISaveGameService 
} from '../types/game';
import { ValidationService } from './validationService';

const STORAGE_KEYS = {
  SAVES: 'babysim_saves',
  AUTO_SAVE: 'babysim_autosave',
  METADATA: 'babysim_save_metadata',
  ENCRYPTION_KEY: 'babysim_storage_key'
} as const;

const CURRENT_VERSION = '1.0.0';
const MAX_SAVE_SIZE = 1024 * 1024; // 1MB limit for save data
const MAX_SAVES_COUNT = 50; // Maximum number of saves to prevent storage abuse

class LocalStorageSaveGameService implements ISaveGameService {
  
  private generateId(): string {
    return ValidationService.generateSecureId();
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
    const validation = ValidationService.validateGameState(gameState);
    return validation.isValid;
  }

  private calculateDataChecksum(data: any): string {
    // Simple checksum calculation for data integrity
    const dataStr = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      const char = dataStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private validateDataIntegrity(data: any, expectedChecksum: string): boolean {
    const actualChecksum = this.calculateDataChecksum(data);
    return actualChecksum === expectedChecksum;
  }

  private validateSaveSize(saveData: string): boolean {
    const sizeInBytes = new Blob([saveData]).size;
    return sizeInBytes <= MAX_SAVE_SIZE;
  }

  private validateSaveCount(existingSaves: Record<string, SaveGame>): boolean {
    return Object.keys(existingSaves).length < MAX_SAVES_COUNT;
  }

  private getStorageKey(): string {
    // Generate or retrieve encryption key for sensitive data
    let key = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);
    if (!key) {
      key = this.generateStorageKey();
      localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
    }
    return key;
  }

  private generateStorageKey(): string {
    // Generate a simple key for basic obfuscation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  private encodeData(data: string): string {
    // Simple XOR encoding for basic protection
    const key = this.getStorageKey();
    let encoded = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const dataChar = data.charCodeAt(i);
      encoded += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(encoded); // Base64 encode
  }

  private decodeData(encodedData: string): string {
    try {
      const key = this.getStorageKey();
      const data = atob(encodedData); // Base64 decode
      let decoded = '';
      for (let i = 0; i < data.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const dataChar = data.charCodeAt(i);
        decoded += String.fromCharCode(dataChar ^ keyChar);
      }
      return decoded;
    } catch (error) {
      throw new Error('Failed to decode storage data - may be corrupted');
    }
  }

  private secureStorageWrite(key: string, data: string): void {
    try {
      // Validate data size before encoding
      if (!this.validateSaveSize(data)) {
        throw new Error(`Data exceeds maximum size limit (${MAX_SAVE_SIZE / 1024 / 1024}MB)`);
      }
      
      const encodedData = this.encodeData(data);
      localStorage.setItem(key, encodedData);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some saves to free up space.');
      }
      throw error;
    }
  }

  private secureStorageRead(key: string): string | null {
    try {
      const encodedData = localStorage.getItem(key);
      if (!encodedData) return null;
      
      return this.decodeData(encodedData);
    } catch (error) {
      console.warn(`Failed to read secure storage for key ${key}:`, error);
      localStorage.removeItem(key); // Remove corrupted data
      return null;
    }
  }

  async saveGame(gameState: GameState, name?: string): Promise<SaveGame> {
    if (!this.validateGameState(gameState)) {
      throw new Error('Invalid game state provided');
    }

    // Validate custom save name if provided
    let validatedName = name || this.generateSaveName(gameState);
    if (name) {
      const nameValidation = ValidationService.validateSaveName(name);
      if (!nameValidation.isValid) {
        throw new Error(`Invalid save name: ${nameValidation.errors.join(', ')}`);
      }
      validatedName = nameValidation.sanitizedValue || name;
    }

    const saveId = this.generateId();
    const now = new Date();
    const saveName = validatedName;

    const saveGame: SaveGame = {
      id: saveId,
      name: saveName,
      gameState: { ...gameState },
      createdAt: now,
      lastModified: now,
      version: CURRENT_VERSION,
      checksum: this.calculateDataChecksum(gameState)
    };

    try {
      // Get existing saves
      const existingSaves = await this.getAllSaveGames();
      
      // Validate save count limit
      if (!this.validateSaveCount(existingSaves)) {
        throw new Error(`Maximum save limit reached (${MAX_SAVES_COUNT}). Please delete some saves first.`);
      }
      
      existingSaves[saveId] = saveGame;

      // Validate total save size
      const saveDataStr = JSON.stringify(existingSaves);
      if (!this.validateSaveSize(saveDataStr)) {
        throw new Error(`Save data exceeds size limit (${MAX_SAVE_SIZE / 1024 / 1024}MB)`);
      }

      // Store saves securely
      this.secureStorageWrite(STORAGE_KEYS.SAVES, saveDataStr);

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

      // Validate data integrity using checksum
      if (saveGame.checksum && !this.validateDataIntegrity(saveGame.gameState, saveGame.checksum)) {
        throw new Error('Save game data integrity check failed - file may be corrupted');
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
      this.secureStorageWrite(STORAGE_KEYS.SAVES, JSON.stringify(saves));
      
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
      
      this.secureStorageWrite(STORAGE_KEYS.SAVES, JSON.stringify(saves));
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
        saveGame,
        exportChecksum: this.calculateDataChecksum(saveGame)
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`Failed to export save game: ${error}`);
    }
  }

  async importSave(saveData: string): Promise<SaveGame> {
    try {
      // Validate the save data using the validation service
      const validation = ValidationService.validateSaveData(saveData);
      if (!validation.isValid) {
        throw new Error(`Invalid save data: ${validation.errors.join(', ')}`);
      }

      const importData = validation.sanitizedValue;

      // Validate export checksum if present
      if (importData.exportChecksum && !this.validateDataIntegrity(importData.saveGame, importData.exportChecksum)) {
        throw new Error('Import data integrity check failed - file may be corrupted');
      }

      // Generate new ID for imported save to avoid conflicts
      const newSaveId = this.generateId();
      const importedSave: SaveGame = {
        ...importData.saveGame,
        id: newSaveId,
        name: `${importData.saveGame.name} (Imported)`,
        lastModified: new Date(),
        checksum: this.calculateDataChecksum(importData.saveGame.gameState)
      };

      const saves = await this.getAllSaveGames();
      
      // Validate save count limit before importing
      if (!this.validateSaveCount(saves)) {
        throw new Error(`Cannot import: Maximum save limit reached (${MAX_SAVES_COUNT}). Please delete some saves first.`);
      }
      
      saves[newSaveId] = importedSave;
      
      // Validate total save size after import
      const saveDataStr = JSON.stringify(saves);
      if (!this.validateSaveSize(saveDataStr)) {
        throw new Error(`Cannot import: Save data would exceed size limit (${MAX_SAVE_SIZE / 1024 / 1024}MB)`);
      }
      
      this.secureStorageWrite(STORAGE_KEYS.SAVES, saveDataStr);
      await this.updateMetadata();

      return importedSave;
    } catch (error) {
      throw new Error(`Failed to import save game: ${error}`);
    }
  }

  async getAutoSave(): Promise<GameState | null> {
    try {
      const autoSaveData = this.secureStorageRead(STORAGE_KEYS.AUTO_SAVE);
      
      if (!autoSaveData) {
        return null;
      }

      const autoSaveObj = JSON.parse(autoSaveData);
      
      // Handle legacy auto-saves without checksum
      const gameState = autoSaveObj.gameState || autoSaveObj;
      
      if (!this.validateGameState(gameState)) {
        localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
        return null;
      }

      // Validate checksum if present
      if (autoSaveObj.checksum && !this.validateDataIntegrity(gameState, autoSaveObj.checksum)) {
        console.warn('Auto-save integrity check failed, removing corrupted data');
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
      const autoSaveData = {
        gameState,
        checksum: this.calculateDataChecksum(gameState),
        savedAt: new Date().toISOString()
      };
      
      this.secureStorageWrite(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(autoSaveData));
    } catch (error) {
      console.warn('Failed to create auto-save:', error);
    }
  }

  // Private helper methods

  private async getAllSaveGames(): Promise<Record<string, SaveGame>> {
    try {
      const savesData = this.secureStorageRead(STORAGE_KEYS.SAVES);
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
    
    // Estimate storage usage (accounting for encoding overhead)
    const rawData = this.secureStorageRead(STORAGE_KEYS.SAVES) || '';
    const used = new Blob([rawData]).size * 1.5; // Account for encoding overhead
    
    // LocalStorage typically has 5-10MB limit, we'll use 5MB as conservative estimate
    const available = 5 * 1024 * 1024 - used;

    return { used, available, saveCount };
  }

  async clearAllSaves(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SAVES);
    localStorage.removeItem(STORAGE_KEYS.METADATA);
    localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_KEY);
  }
}

// Export singleton instance
export const saveGameService = new LocalStorageSaveGameService();