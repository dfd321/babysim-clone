import { saveGameService } from '../../src/services/saveGameService';
import {
  GameState,
  SaveGame,
  SaveGameMetadata,
  ChildCharacter,
  ParentCharacter
} from '../../src/types/game';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SaveGameService', () => {
  let mockGameState: GameState;
  let mockChild: ChildCharacter;
  let mockParent: ParentCharacter;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Create mock parent character
    mockParent = {
      name: 'Test Parent',
      age: 30,
      profession: 'Teacher',
      background: 'Loving family background',
      financialLevel: 5
    };

    // Create mock child character
    mockChild = {
      id: 'child-1',
      name: 'Test Child',
      age: 5,
      gender: 'boy',
      personality: 'curious and energetic',
      traits: ['loves animals', 'creative'],
      interests: ['playing', 'art'],
      personalityTraits: [
        { id: 'creativity', name: 'Creativity', category: 'creative', description: 'Creative thinking', value: 85 }
      ],
      skills: [
        { id: 'art', name: 'Art', category: 'artistic', level: 7, experience: 80, unlocked: true }
      ],
      relationships: {
        'parent-child': { type: 'parent-child', quality: 85, trust: 90, communication: 80, lastUpdated: 5 }
      },
      milestones: [
        { id: 'first_words', name: 'First Words', age: 1, achieved: true, impact: {} }
      ],
      developmentHistory: []
    };

    // Create mock game state
    mockGameState = {
      phase: 'gameplay',
      role: 'Mom',
      gameStyle: 'realistic',
      specialRequirements: '',
      parentCharacter: mockParent,
      childCharacter: mockChild,
      children: { 'child-1': mockChild },
      activeChildId: 'child-1',
      currentAge: 5,
      happiness: 85,
      finances: 50000,
      timeline: [
        { age: 1, event: 'First words', impact: 'Language development' },
        { age: 3, event: 'Started preschool', impact: 'Social skills' }
      ],
      achievements: [],
      achievementProgress: {},
      unlockedAchievements: [],
      badges: [],
      unlockedBadges: [],
      familyDynamics: {
        parentChildRelationship: { quality: 85, trust: 90, communication: 80 },
        favoritism: {},
        siblingRelationships: {}
      },
      showSaveMenu: false,
      showLoadMenu: false,
      newAchievementUnlocks: []
    };

    // Mock empty localStorage by default
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('saveGame', () => {
    it('should save a valid game state successfully', async () => {
      localStorageMock.getItem.mockReturnValue('{}'); // Empty saves object
      
      const savedGame = await saveGameService.saveGame(mockGameState);
      
      expect(savedGame).toBeDefined();
      expect(savedGame.id).toMatch(/^save_\d+_[a-z0-9]+$/);
      expect(savedGame.name).toContain('Test Child');
      expect(savedGame.name).toContain('Age 5');
      expect(savedGame.gameState).toEqual(mockGameState);
      expect(savedGame.createdAt).toBeInstanceOf(Date);
      expect(savedGame.lastModified).toBeInstanceOf(Date);
      expect(savedGame.version).toBe('1.0.0');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'babysim_saves',
        expect.any(String)
      );
    });

    it('should save with custom name when provided', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      const customName = 'My Custom Save';
      
      const savedGame = await saveGameService.saveGame(mockGameState, customName);
      
      expect(savedGame.name).toBe(customName);
    });

    it('should throw error for invalid game state', async () => {
      const invalidGameState = { ...mockGameState };
      delete (invalidGameState as any).currentAge;
      
      await expect(saveGameService.saveGame(invalidGameState))
        .rejects.toThrow('Invalid game state provided');
    });

    it('should throw error for game state with missing phase', async () => {
      const invalidGameState = { ...mockGameState };
      delete (invalidGameState as any).phase;
      
      await expect(saveGameService.saveGame(invalidGameState))
        .rejects.toThrow('Invalid game state provided');
    });

    it('should throw error for game state with non-array timeline', async () => {
      const invalidGameState = { ...mockGameState };
      (invalidGameState as any).timeline = 'not an array';
      
      await expect(saveGameService.saveGame(invalidGameState))
        .rejects.toThrow('Invalid game state provided');
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(saveGameService.saveGame(mockGameState))
        .rejects.toThrow('Failed to save game');
    });
  });

  describe('loadGame', () => {
    it('should load an existing game successfully', async () => {
      const savedGame: SaveGame = {
        id: 'test-save-id',
        name: 'Test Save',
        gameState: mockGameState,
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test-save-id': savedGame
      }));
      
      const loadedState = await saveGameService.loadGame('test-save-id');
      
      expect(loadedState).toEqual(mockGameState);
      expect(loadedState).not.toBe(mockGameState); // Should be a copy
    });

    it('should throw error for non-existent save', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      await expect(saveGameService.loadGame('non-existent-id'))
        .rejects.toThrow('Save game with ID non-existent-id not found');
    });

    it('should throw error for corrupted save data', async () => {
      const corruptedSave: SaveGame = {
        id: 'corrupted-save',
        name: 'Corrupted Save',
        gameState: { ...mockGameState },
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      };
      
      // Remove required property to make it invalid
      delete (corruptedSave.gameState as any).currentAge;
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'corrupted-save': corruptedSave
      }));
      
      await expect(saveGameService.loadGame('corrupted-save'))
        .rejects.toThrow('Corrupted save game data');
    });

    it('should handle localStorage errors', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(saveGameService.loadGame('test-id'))
        .rejects.toThrow('Failed to load game');
    });
  });

  describe('getAllSaves', () => {
    it('should return empty array when no saves exist', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const saves = await saveGameService.getAllSaves();
      
      expect(saves).toEqual([]);
    });

    it('should return metadata for all saved games', async () => {
      const savedGames = {
        'save-1': {
          id: 'save-1',
          name: 'Save 1',
          gameState: mockGameState,
          createdAt: new Date('2023-01-01'),
          lastModified: new Date('2023-01-01'),
          version: '1.0.0'
        },
        'save-2': {
          id: 'save-2',
          name: 'Save 2',
          gameState: { ...mockGameState, currentAge: 10 },
          createdAt: new Date('2023-01-02'),
          lastModified: new Date('2023-01-02'),
          version: '1.0.0'
        }
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedGames));
      
      const saves = await saveGameService.getAllSaves();
      
      expect(saves).toHaveLength(2);
      expect(saves[0].id).toBe('save-2'); // Should be sorted by lastModified (newest first)
      expect(saves[1].id).toBe('save-1');
      
      saves.forEach(save => {
        expect(save).toHaveProperty('id');
        expect(save).toHaveProperty('name');
        expect(save).toHaveProperty('createdAt');
        expect(save).toHaveProperty('lastModified');
        expect(save).toHaveProperty('currentAge');
        expect(save).toHaveProperty('childName');
        expect(save).toHaveProperty('parentName');
        expect(save).toHaveProperty('gameStyle');
        expect(save).toHaveProperty('progress');
      });
    });

    it('should handle corrupted localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const saves = await saveGameService.getAllSaves();
      
      expect(saves).toEqual([]);
    });
  });

  describe('deleteSave', () => {
    it('should delete an existing save successfully', async () => {
      const savedGames = {
        'save-1': { id: 'save-1', name: 'Save 1' },
        'save-2': { id: 'save-2', name: 'Save 2' }
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedGames));
      
      await saveGameService.deleteSave('save-1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'babysim_saves',
        JSON.stringify({ 'save-2': { id: 'save-2', name: 'Save 2' } })
      );
    });

    it('should throw error for non-existent save', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      await expect(saveGameService.deleteSave('non-existent-id'))
        .rejects.toThrow('Save game with ID non-existent-id not found');
    });
  });

  describe('renameSave', () => {
    it('should rename an existing save successfully', async () => {
      const savedGame = {
        id: 'test-save',
        name: 'Old Name',
        gameState: mockGameState,
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test-save': savedGame
      }));
      
      await saveGameService.renameSave('test-save', 'New Name');
      
      const expectedSave = { ...savedGame, name: 'New Name' };
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'babysim_saves',
        expect.stringContaining('New Name')
      );
    });

    it('should throw error for non-existent save', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      await expect(saveGameService.renameSave('non-existent-id', 'New Name'))
        .rejects.toThrow('Save game with ID non-existent-id not found');
    });
  });

  describe('exportSave', () => {
    it('should export save as JSON string', async () => {
      const savedGame = {
        id: 'test-save',
        name: 'Test Save',
        gameState: mockGameState,
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test-save': savedGame
      }));
      
      const exportedData = await saveGameService.exportSave('test-save');
      
      expect(typeof exportedData).toBe('string');
      
      const parsed = JSON.parse(exportedData);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('exportedAt');
      expect(parsed).toHaveProperty('saveData');
      expect(parsed.saveData.id).toBe('test-save');
    });

    it('should throw error for non-existent save', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      await expect(saveGameService.exportSave('non-existent-id'))
        .rejects.toThrow('Save game with ID non-existent-id not found');
    });
  });

  describe('importSave', () => {
    it('should import valid save data successfully', async () => {
      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        saveData: {
          id: 'original-id',
          name: 'Exported Save',
          gameState: mockGameState,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      
      localStorageMock.getItem.mockReturnValue('{}');
      
      const importedSave = await saveGameService.importSave(JSON.stringify(exportData));
      
      expect(importedSave.id).not.toBe('original-id'); // Should have new ID
      expect(importedSave.name).toBe('Exported Save (Imported)');
      expect(importedSave.gameState).toEqual(mockGameState);
    });

    it('should throw error for invalid JSON', async () => {
      await expect(saveGameService.importSave('invalid json'))
        .rejects.toThrow('Invalid save data format');
    });

    it('should throw error for corrupted save data', async () => {
      const corruptedData = {
        version: '1.0.0',
        saveData: {
          id: 'test',
          name: 'Test',
          gameState: { invalid: 'state' }
        }
      };
      
      await expect(saveGameService.importSave(JSON.stringify(corruptedData)))
        .rejects.toThrow('Invalid save data format');
    });
  });

  describe('Auto-save functionality', () => {
    describe('setAutoSave', () => {
      it('should save auto-save successfully', async () => {
        await saveGameService.setAutoSave(mockGameState);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'babysim_autosave',
          expect.any(String)
        );
      });

      it('should throw error for invalid game state', async () => {
        const invalidGameState = { ...mockGameState };
        delete (invalidGameState as any).currentAge;
        
        await expect(saveGameService.setAutoSave(invalidGameState))
          .rejects.toThrow('Invalid game state for auto-save');
      });
    });

    describe('getAutoSave', () => {
      it('should return auto-saved game state', async () => {
        const autoSaveData = {
          gameState: mockGameState,
          timestamp: new Date().toISOString()
        };
        
        localStorageMock.getItem.mockReturnValue(JSON.stringify(autoSaveData));
        
        const autoSave = await saveGameService.getAutoSave();
        
        expect(autoSave).toEqual(mockGameState);
      });

      it('should return null when no auto-save exists', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        
        const autoSave = await saveGameService.getAutoSave();
        
        expect(autoSave).toBeNull();
      });

      it('should return null and clean up corrupted auto-save', async () => {
        localStorageMock.getItem.mockReturnValue('invalid json');
        
        const autoSave = await saveGameService.getAutoSave();
        
        expect(autoSave).toBeNull();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_autosave');
      });
    });
  });

  describe('Storage management', () => {
    describe('getStorageInfo', () => {
      it('should return storage information', async () => {
        const savedGames = {
          'save-1': { id: 'save-1', name: 'Save 1' },
          'save-2': { id: 'save-2', name: 'Save 2' }
        };
        
        localStorageMock.getItem.mockReturnValue(JSON.stringify(savedGames));
        
        const storageInfo = await saveGameService.getStorageInfo();
        
        expect(storageInfo).toHaveProperty('used');
        expect(storageInfo).toHaveProperty('available');
        expect(storageInfo).toHaveProperty('saveCount');
        expect(storageInfo.saveCount).toBe(2);
        expect(typeof storageInfo.used).toBe('number');
        expect(typeof storageInfo.available).toBe('number');
      });
    });

    describe('clearAllSaves', () => {
      it('should remove all save data', async () => {
        await saveGameService.clearAllSaves();
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_saves');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_autosave');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_save_metadata');
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing childCharacter in save name generation', async () => {
      const gameStateWithoutChild = { ...mockGameState };
      gameStateWithoutChild.childCharacter = undefined as any;
      
      localStorageMock.getItem.mockReturnValue('{}');
      
      const savedGame = await saveGameService.saveGame(gameStateWithoutChild);
      
      expect(savedGame.name).toContain('Child'); // Should use default name
    });

    it('should validate game state with all required properties', async () => {
      const validGameState = {
        ...mockGameState,
        currentAge: 0, // Edge case: age 0 should be valid
        timeline: [] // Empty timeline should be valid
      };
      
      localStorageMock.getItem.mockReturnValue('{}');
      
      const savedGame = await saveGameService.saveGame(validGameState);
      expect(savedGame).toBeDefined();
    });

    it('should handle null and undefined values in validation', async () => {
      const testCases = [
        null,
        undefined,
        { ...mockGameState, currentAge: null },
        { ...mockGameState, phase: null },
        { ...mockGameState, timeline: null }
      ];
      
      for (const testCase of testCases) {
        await expect(saveGameService.saveGame(testCase as any))
          .rejects.toThrow('Invalid game state provided');
      }
    });

    it('should generate unique save IDs', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      const save1 = await saveGameService.saveGame(mockGameState);
      const save2 = await saveGameService.saveGame(mockGameState);
      
      expect(save1.id).not.toBe(save2.id);
    });
  });

  describe('Security Tests', () => {
    it('should validate data integrity with checksums', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      const savedGame = await saveGameService.saveGame(mockGameState, 'Security Test');
      expect(savedGame.checksum).toBeDefined();
      
      // Mock corrupted checksum
      const corruptedSave = { ...savedGame, checksum: 'invalid-checksum' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        [savedGame.id]: corruptedSave
      }));
      
      await expect(saveGameService.loadGame(savedGame.id))
        .rejects.toThrow('Save game data integrity check failed');
    });

    it('should enforce save count limits', async () => {
      // Mock storage with maximum saves
      const maxSaves: Record<string, any> = {};
      for (let i = 0; i < 50; i++) {
        maxSaves[`save-${i}`] = { id: `save-${i}`, name: `Save ${i}` };
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(maxSaves));
      
      await expect(saveGameService.saveGame(mockGameState, 'Extra Save'))
        .rejects.toThrow('Maximum save limit reached');
    });

    it('should handle encrypted storage operations', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      await saveGameService.saveGame(mockGameState, 'Encrypted Test');
      
      // Verify data is encoded (not plain text)
      const storedData = localStorageMock.setItem.mock.calls[0][1];
      expect(storedData).not.toContain('Test Child');
      expect(storedData).not.toContain('Test Parent');
    });

    it('should validate import data integrity', async () => {
      const validExportData = {
        version: '1.0.0',
        exportedAt: '2024-01-01T00:00:00.000Z',
        saveGame: {
          id: 'test-id',
          name: 'Test Save',
          gameState: mockGameState,
          createdAt: '2024-01-01T00:00:00.000Z',
          lastModified: '2024-01-01T00:00:00.000Z',
          version: '1.0.0'
        },
        exportChecksum: 'valid-checksum'
      };
      
      localStorageMock.getItem.mockReturnValue('{}');
      
      // Mock corrupted export checksum  
      const corruptedData = { ...validExportData, exportChecksum: 'corrupted' };
      
      await expect(saveGameService.importSave(JSON.stringify(corruptedData)))
        .rejects.toThrow('Import data integrity check failed');
    });

    it('should sanitize auto-save data', async () => {
      await saveGameService.setAutoSave(mockGameState);
      
      const autoSaveCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'babysim_autosave'
      );
      
      expect(autoSaveCall).toBeDefined();
      const autoSaveData = JSON.parse(autoSaveCall[1]);
      expect(autoSaveData.checksum).toBeDefined();
      expect(autoSaveData.savedAt).toBeDefined();
    });

    it('should handle storage quota exceeded gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      localStorageMock.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });
      
      await expect(saveGameService.saveGame(mockGameState))
        .rejects.toThrow('Storage quota exceeded');
    });

    it('should clear encryption key when clearing all saves', async () => {
      await saveGameService.clearAllSaves();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_saves');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_autosave');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_save_metadata');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('babysim_storage_key');
    });
  });

  describe('Integration tests', () => {
    it('should handle complete save/load cycle', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      // Save game
      const savedGame = await saveGameService.saveGame(mockGameState, 'Integration Test');
      
      // Mock the saved data for loading
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        [savedGame.id]: savedGame
      }));
      
      // Load game
      const loadedState = await saveGameService.loadGame(savedGame.id);
      
      expect(loadedState).toEqual(mockGameState);
    });

    it('should handle export/import cycle', async () => {
      const savedGame = {
        id: 'test-save',
        name: 'Test Save',
        gameState: mockGameState,
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      };
      
      // Setup for export
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test-save': savedGame
      }));
      
      // Export
      const exportedData = await saveGameService.exportSave('test-save');
      
      // Setup for import (reset storage)
      localStorageMock.getItem.mockReturnValue('{}');
      
      // Import
      const importedSave = await saveGameService.importSave(exportedData);
      
      expect(importedSave.gameState).toEqual(mockGameState);
      expect(importedSave.name).toBe('Test Save (Imported)');
    });
  });
});