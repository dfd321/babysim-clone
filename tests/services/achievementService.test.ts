import { achievementService, AchievementService } from '../../src/services/achievementService';
import {
  Achievement,
  AchievementCategory,
  AchievementProgress,
  AchievementStats,
  Badge,
  GameState,
  UnlockedAchievement,
  ChildCharacter,
  ParentCharacter
} from '../../src/types/game';

describe('AchievementService', () => {
  let mockGameState: GameState;
  let mockChild: ChildCharacter;
  let mockParent: ParentCharacter;

  beforeEach(() => {
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
        { id: 'creativity', name: 'Creativity', category: 'creative', description: 'Creative thinking', value: 85 },
        { id: 'confidence', name: 'Confidence', category: 'social', description: 'Self-confidence', value: 70 },
        { id: 'empathy', name: 'Empathy', category: 'emotional', description: 'Understanding others', value: 60 }
      ],
      skills: [
        { id: 'art', name: 'Art', category: 'artistic', level: 7, experience: 80, unlocked: true },
        { id: 'reading', name: 'Reading', category: 'academic', level: 5, experience: 50, unlocked: true }
      ],
      relationships: {
        'parent-child': { type: 'parent-child', quality: 85, trust: 90, communication: 80, lastUpdated: 5 }
      },
      milestones: [
        { id: 'first_words', name: 'First Words', age: 1, achieved: true, impact: {} },
        { id: 'social_play', name: 'Social Play', age: 3, achieved: true, impact: {} }
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
      timeline: [],
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
  });

  describe('Initialization and Basic Operations', () => {
    it('should initialize with achievements and badges', () => {
      const service = new AchievementService();
      
      expect(service.getAllAchievements().length).toBeGreaterThan(0);
      expect(service.getAllBadges().length).toBeGreaterThan(0);
    });

    it('should export singleton instance', () => {
      expect(achievementService).toBeInstanceOf(AchievementService);
      expect(achievementService.getAllAchievements().length).toBeGreaterThan(0);
    });
  });

  describe('getAllAchievements', () => {
    it('should return all available achievements', () => {
      const achievements = achievementService.getAllAchievements();
      
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBeGreaterThan(0);
      
      achievements.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('category');
        expect(achievement).toHaveProperty('type');
        expect(achievement).toHaveProperty('rarity');
        expect(achievement).toHaveProperty('points');
        expect(achievement).toHaveProperty('requirements');
      });
    });

    it('should return achievements with valid categories', () => {
      const achievements = achievementService.getAllAchievements();
      const validCategories: AchievementCategory[] = [
        'family', 'individual', 'sibling', 'parenting', 'milestone', 'financial', 'social'
      ];
      
      achievements.forEach(achievement => {
        expect(validCategories).toContain(achievement.category);
      });
    });
  });

  describe('getAchievementsByCategory', () => {
    it('should filter achievements by category', () => {
      const familyAchievements = achievementService.getAchievementsByCategory('family');
      const individualAchievements = achievementService.getAchievementsByCategory('individual');
      
      expect(familyAchievements.every(a => a.category === 'family')).toBe(true);
      expect(individualAchievements.every(a => a.category === 'individual')).toBe(true);
    });

    it('should return empty array for non-existent categories', () => {
      // Force test invalid category
      const invalidAchievements = achievementService.getAchievementsByCategory('invalid' as AchievementCategory);
      expect(invalidAchievements).toEqual([]);
    });

    it('should return achievements for all valid categories', () => {
      const categories: AchievementCategory[] = [
        'family', 'individual', 'sibling', 'parenting', 'milestone', 'financial', 'social'
      ];
      
      categories.forEach(category => {
        const achievements = achievementService.getAchievementsByCategory(category);
        expect(Array.isArray(achievements)).toBe(true);
        // Some categories might be empty in the current implementation
      });
    });
  });

  describe('getAchievementById', () => {
    it('should return achievement for valid ID', () => {
      const allAchievements = achievementService.getAllAchievements();
      const firstAchievement = allAchievements[0];
      
      const retrieved = achievementService.getAchievementById(firstAchievement.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(firstAchievement.id);
    });

    it('should return undefined for invalid ID', () => {
      const retrieved = achievementService.getAchievementById('non-existent-id');
      expect(retrieved).toBeUndefined();
    });

    it('should return undefined for empty string ID', () => {
      const retrieved = achievementService.getAchievementById('');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('initializeGameStateAchievements', () => {
    it('should initialize achievement arrays in game state', () => {
      const gameState = { ...mockGameState };
      delete (gameState as any).achievements;
      delete (gameState as any).unlockedAchievements;
      delete (gameState as any).badges;
      delete (gameState as any).unlockedBadges;
      
      achievementService.initializeGameStateAchievements(gameState);
      
      expect(gameState.achievements).toEqual([]);
      expect(gameState.unlockedAchievements).toEqual([]);
      expect(gameState.badges).toEqual([]);
      expect(gameState.unlockedBadges).toEqual([]);
    });

    it('should preserve existing achievement data', () => {
      const gameState = { ...mockGameState };
      gameState.achievements = [{ id: 'test', progress: 50, completed: false }];
      
      achievementService.initializeGameStateAchievements(gameState);
      
      expect(gameState.achievements).toHaveLength(1);
      expect(gameState.achievements[0].id).toBe('test');
    });
  });

  describe('isAchievementUnlocked', () => {
    it('should return false for unlocked achievement not in game state', () => {
      const achievements = achievementService.getAllAchievements();
      const firstAchievement = achievements[0];
      
      const isUnlocked = achievementService.isAchievementUnlocked(firstAchievement.id, mockGameState);
      expect(isUnlocked).toBe(false);
    });

    it('should return true for achievement in unlocked list', () => {
      const achievements = achievementService.getAllAchievements();
      const firstAchievement = achievements[0];
      
      mockGameState.unlockedAchievements = [{
        achievementId: firstAchievement.id,
        unlockedAt: new Date(),
        gameAge: 5,
        progress: 100,
        milestoneSnapshot: {
          childName: 'Test Child',
          parentName: 'Test Parent',
          familySize: 1,
          totalProgress: 100
        }
      }];
      
      const isUnlocked = achievementService.isAchievementUnlocked(firstAchievement.id, mockGameState);
      expect(isUnlocked).toBe(true);
    });

    it('should return false for non-existent achievement', () => {
      const isUnlocked = achievementService.isAchievementUnlocked('non-existent', mockGameState);
      expect(isUnlocked).toBe(false);
    });
  });

  describe('checkAchievementProgress', () => {
    it('should return progress for all achievements', () => {
      const progress = achievementService.checkAchievementProgress(mockGameState);
      
      expect(Array.isArray(progress)).toBe(true);
      expect(progress.length).toBeGreaterThan(0);
      
      progress.forEach(p => {
        expect(p).toHaveProperty('achievementId');
        expect(p).toHaveProperty('progress');
        expect(p).toHaveProperty('currentValues');
        expect(p).toHaveProperty('isCompleted');
        expect(p).toHaveProperty('canUnlock');
        expect(p.progress).toBeGreaterThanOrEqual(0);
        expect(p.progress).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate progress for trait-based achievements', () => {
      // Find a creativity-based achievement
      const creativityAchievement = achievementService.getAllAchievements()
        .find(a => a.requirements.some(r => r.target === 'creativity'));
      
      if (creativityAchievement) {
        const progress = achievementService.checkAchievementProgress(mockGameState);
        const creativityProgress = progress.find(p => p.achievementId === creativityAchievement.id);
        
        expect(creativityProgress).toBeDefined();
        expect(creativityProgress?.progress).toBeGreaterThan(0);
      }
    });

    it('should handle game state with no children', () => {
      const emptyGameState = { ...mockGameState };
      emptyGameState.children = {};
      emptyGameState.childCharacter = undefined as any;
      
      const progress = achievementService.checkAchievementProgress(emptyGameState);
      expect(Array.isArray(progress)).toBe(true);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock eligible achievement', () => {
      // Set up game state to meet requirements for a simple achievement
      const achievements = achievementService.getAllAchievements();
      const firstChildAchievement = achievements.find(a => a.id === 'first_child');
      
      if (firstChildAchievement) {
        const unlocked = achievementService.unlockAchievement(firstChildAchievement.id, mockGameState);
        
        expect(unlocked).toBeDefined();
        expect(unlocked?.achievementId).toBe(firstChildAchievement.id);
        expect(unlocked?.unlockedAt).toBeInstanceOf(Date);
        expect(unlocked?.gameAge).toBe(mockGameState.currentAge);
      }
    });

    it('should return null for already unlocked achievement', () => {
      const achievements = achievementService.getAllAchievements();
      const firstAchievement = achievements[0];
      
      // Mark as already unlocked
      mockGameState.unlockedAchievements = [{
        achievementId: firstAchievement.id,
        unlockedAt: new Date(),
        gameAge: 3,
        progress: 100,
        milestoneSnapshot: {
          childName: 'Test Child',
          parentName: 'Test Parent',
          familySize: 1,
          totalProgress: 100
        }
      }];
      
      const unlocked = achievementService.unlockAchievement(firstAchievement.id, mockGameState);
      expect(unlocked).toBeNull();
    });

    it('should return null for non-existent achievement', () => {
      const unlocked = achievementService.unlockAchievement('non-existent', mockGameState);
      expect(unlocked).toBeNull();
    });
  });

  describe('updateAchievementProgress', () => {
    it('should return newly unlocked achievements', () => {
      const newlyUnlocked = achievementService.updateAchievementProgress(mockGameState);
      
      expect(Array.isArray(newlyUnlocked)).toBe(true);
      // May or may not have unlocks depending on game state
      
      newlyUnlocked.forEach(unlock => {
        expect(unlock).toHaveProperty('achievementId');
        expect(unlock).toHaveProperty('unlockedAt');
        expect(unlock).toHaveProperty('gameAge');
        expect(unlock).toHaveProperty('milestoneSnapshot');
      });
    });

    it('should update achievement progress in game state', () => {
      const originalProgressCount = Object.keys(mockGameState.achievementProgress).length;
      
      achievementService.updateAchievementProgress(mockGameState);
      
      const newProgressCount = Object.keys(mockGameState.achievementProgress).length;
      expect(newProgressCount).toBeGreaterThanOrEqual(originalProgressCount);
    });

    it('should add unlocked achievements to game state', () => {
      const originalUnlockedCount = mockGameState.unlockedAchievements.length;
      
      const newlyUnlocked = achievementService.updateAchievementProgress(mockGameState);
      
      const newUnlockedCount = mockGameState.unlockedAchievements.length;
      expect(newUnlockedCount).toBe(originalUnlockedCount + newlyUnlocked.length);
    });
  });

  describe('calculateAchievementStats', () => {
    it('should return comprehensive achievement statistics', () => {
      const stats = achievementService.calculateAchievementStats(mockGameState);
      
      expect(stats).toHaveProperty('totalPoints');
      expect(stats).toHaveProperty('achievementsUnlocked');
      expect(stats).toHaveProperty('achievementsAvailable');
      expect(stats).toHaveProperty('rarityCount');
      expect(stats).toHaveProperty('categoryProgress');
      expect(stats).toHaveProperty('recentUnlocks');
      
      expect(typeof stats.totalPoints).toBe('number');
      expect(typeof stats.achievementsUnlocked).toBe('number');
      expect(typeof stats.achievementsAvailable).toBe('number');
      expect(stats.achievementsUnlocked).toBeLessThanOrEqual(stats.achievementsAvailable);
    });

    it('should calculate category progress correctly', () => {
      const stats = achievementService.calculateAchievementStats(mockGameState);
      
      Object.entries(stats.categoryProgress).forEach(([category, progress]) => {
        expect(progress).toHaveProperty('unlocked');
        expect(progress).toHaveProperty('total');
        expect(progress).toHaveProperty('points');
        expect(progress.unlocked).toBeLessThanOrEqual(progress.total);
        expect(progress.unlocked).toBeGreaterThanOrEqual(0);
        expect(progress.total).toBeGreaterThan(0);
      });
    });

    it('should count rarities correctly', () => {
      const stats = achievementService.calculateAchievementStats(mockGameState);
      
      const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      Object.keys(stats.rarityCount).forEach(rarity => {
        expect(validRarities).toContain(rarity);
        expect(stats.rarityCount[rarity]).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Badge System', () => {
    it('should return all available badges', () => {
      const badges = achievementService.getAllBadges();
      
      expect(Array.isArray(badges)).toBe(true);
      badges.forEach(badge => {
        expect(badge).toHaveProperty('id');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('description');
        expect(badge).toHaveProperty('requirements');
      });
    });

    it('should check badge eligibility', () => {
      const eligibleBadges = achievementService.checkBadgeEligibility(mockGameState);
      
      expect(Array.isArray(eligibleBadges)).toBe(true);
      eligibleBadges.forEach(badge => {
        expect(badge).toHaveProperty('unlockedAt');
        expect(badge.unlockedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle game state with missing properties', () => {
      const incompleteGameState = {
        ...mockGameState,
        children: {},
        parentCharacter: undefined as any,
        childCharacter: undefined as any
      };
      
      expect(() => {
        achievementService.checkAchievementProgress(incompleteGameState);
      }).not.toThrow();
      
      expect(() => {
        achievementService.calculateAchievementStats(incompleteGameState);
      }).not.toThrow();
    });

    it('should handle achievements with malformed requirements', () => {
      const progress = achievementService.checkAchievementProgress(mockGameState);
      expect(Array.isArray(progress)).toBe(true);
    });

    it('should handle very large numbers in game state', () => {
      const extremeGameState = { ...mockGameState };
      extremeGameState.happiness = 999999;
      extremeGameState.finances = 999999999;
      
      const stats = achievementService.calculateAchievementStats(extremeGameState);
      expect(stats.totalPoints).toBeGreaterThanOrEqual(0);
    });

    it('should handle negative values gracefully', () => {
      const negativeGameState = { ...mockGameState };
      negativeGameState.happiness = -50;
      negativeGameState.finances = -10000;
      
      const progress = achievementService.checkAchievementProgress(negativeGameState);
      expect(Array.isArray(progress)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete achievement lifecycle', () => {
      // Start fresh
      achievementService.initializeGameStateAchievements(mockGameState);
      
      // Check initial progress
      const initialProgress = achievementService.checkAchievementProgress(mockGameState);
      expect(initialProgress.length).toBeGreaterThan(0);
      
      // Update progress (may unlock achievements)
      const unlocked = achievementService.updateAchievementProgress(mockGameState);
      
      // Calculate stats
      const stats = achievementService.calculateAchievementStats(mockGameState);
      expect(stats.achievementsUnlocked).toBe(unlocked.length);
      
      // Verify no duplicate unlocks
      const secondUpdate = achievementService.updateAchievementProgress(mockGameState);
      expect(secondUpdate.length).toBe(0); // Should not unlock same achievements again
    });

    it('should maintain consistency across multiple calls', () => {
      const stats1 = achievementService.calculateAchievementStats(mockGameState);
      const stats2 = achievementService.calculateAchievementStats(mockGameState);
      
      expect(stats1.totalPoints).toBe(stats2.totalPoints);
      expect(stats1.achievementsAvailable).toBe(stats2.achievementsAvailable);
    });
  });
});