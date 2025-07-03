import { 
  Achievement, 
  AchievementCategory, 
  AchievementRarity,
  AchievementRequirement,
  UnlockedAchievement,
  AchievementProgress,
  AchievementStats,
  Badge,
  GameState
} from '../types/game';

export class AchievementService {
  private achievements: Achievement[] = [];
  private badges: Badge[] = [];

  constructor() {
    this.initializeAchievements();
    this.initializeBadges();
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Family Milestones
      {
        id: 'first_child',
        name: 'First Steps',
        description: 'Welcome your first child into the world',
        category: 'family',
        type: 'bronze',
        rarity: 'common',
        icon: '👶',
        requirements: [
          {
            type: 'custom',
            target: 'child_count',
            value: 1,
            description: 'Have your first child'
          }
        ],
        points: 10
      },
      {
        id: 'happy_family',
        name: 'Happy Family',
        description: 'Maintain family happiness above 80 for 5 years',
        category: 'family',
        type: 'silver',
        rarity: 'uncommon',
        icon: '😊',
        requirements: [
          {
            type: 'family_stat',
            target: 'happiness',
            value: 80,
            description: 'Keep happiness above 80 for 5 years'
          }
        ],
        points: 25
      },
      {
        id: 'big_family',
        name: 'Full House',
        description: 'Raise 3 or more children simultaneously',
        category: 'family',
        type: 'gold',
        rarity: 'rare',
        icon: '👨‍👩‍👧‍👦',
        requirements: [
          {
            type: 'custom',
            target: 'simultaneous_children',
            value: 3,
            description: 'Have 3+ children at the same time'
          }
        ],
        points: 50
      },

      // Individual Child Achievements
      {
        id: 'creative_genius',
        name: 'Creative Genius',
        description: 'Develop a child with creativity trait above 90',
        category: 'individual',
        type: 'silver',
        rarity: 'uncommon',
        icon: '🎨',
        requirements: [
          {
            type: 'trait_level',
            target: 'creativity',
            value: 90,
            description: 'Achieve creativity score of 90+'
          }
        ],
        points: 30
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Raise a child with exceptional social skills',
        category: 'individual',
        type: 'silver',
        rarity: 'uncommon',
        icon: '🦋',
        requirements: [
          {
            type: 'trait_level',
            target: 'social',
            value: 85,
            description: 'Achieve social trait score of 85+'
          }
        ],
        points: 30
      },
      {
        id: 'renaissance_child',
        name: 'Renaissance Child',
        description: 'Develop a well-rounded child with all traits above 70',
        category: 'individual',
        type: 'gold',
        rarity: 'rare',
        icon: '🌟',
        requirements: [
          {
            type: 'custom',
            target: 'all_traits_above',
            value: 70,
            description: 'All personality traits above 70'
          }
        ],
        points: 75
      },

      // Sibling Relationships
      {
        id: 'sibling_bond',
        name: 'Sibling Bond',
        description: 'Foster a strong relationship between siblings',
        category: 'sibling',
        type: 'bronze',
        rarity: 'common',
        icon: '👫',
        requirements: [
          {
            type: 'relationship_quality',
            target: 'sibling_bond',
            value: 80,
            description: 'Achieve sibling bond score of 80+'
          }
        ],
        points: 20
      },
      {
        id: 'peaceful_home',
        name: 'Peaceful Home',
        description: 'Keep sibling rivalry below 20 for 3 years',
        category: 'sibling',
        type: 'silver',
        rarity: 'uncommon',
        icon: '☮️',
        requirements: [
          {
            type: 'custom',
            target: 'low_rivalry',
            value: 20,
            description: 'Keep rivalry below 20 for 3 years'
          }
        ],
        points: 40
      },

      // Parenting Style
      {
        id: 'supportive_parent',
        name: 'Supportive Parent',
        description: 'Consistently make supportive parenting choices',
        category: 'parenting',
        type: 'bronze',
        rarity: 'common',
        icon: '🤗',
        requirements: [
          {
            type: 'scenario_choice',
            target: 'supportive_choices',
            value: 10,
            description: 'Make 10 supportive choices'
          }
        ],
        points: 15
      },
      {
        id: 'balanced_approach',
        name: 'Balanced Approach',
        description: 'Master the art of balanced parenting',
        category: 'parenting',
        type: 'gold',
        rarity: 'rare',
        icon: '⚖️',
        requirements: [
          {
            type: 'custom',
            target: 'balanced_parenting',
            value: 100,
            description: 'Demonstrate balanced parenting across all categories'
          }
        ],
        points: 60
      },

      // Financial Achievements
      {
        id: 'financial_stability',
        name: 'Financial Stability',
        description: 'Maintain high financial level throughout childhood',
        category: 'financial',
        type: 'silver',
        rarity: 'uncommon',
        icon: '💰',
        requirements: [
          {
            type: 'financial_level',
            target: 'stability',
            value: 8,
            description: 'Maintain financial level 8+ for 5 years'
          }
        ],
        points: 35
      },

      // Milestone Achievements
      {
        id: 'milestone_master',
        name: 'Milestone Master',
        description: 'Help your child achieve 20 developmental milestones',
        category: 'milestone',
        type: 'gold',
        rarity: 'rare',
        icon: '🎯',
        requirements: [
          {
            type: 'milestone_count',
            target: 'total_milestones',
            value: 20,
            description: 'Achieve 20 developmental milestones'
          }
        ],
        points: 50
      },

      // Special/Hidden Achievements
      {
        id: 'perfect_parent',
        name: 'Perfect Parent',
        description: 'Achieve the impossible - perfect parenting',
        category: 'parenting',
        type: 'platinum',
        rarity: 'legendary',
        icon: '👑',
        requirements: [
          {
            type: 'custom',
            target: 'perfect_score',
            value: 100,
            description: 'Maintain perfect scores across all metrics'
          }
        ],
        hidden: true,
        points: 200
      }
    ];
  }

  private initializeBadges(): void {
    this.badges = [
      {
        id: 'first_time_parent',
        name: 'First-Time Parent',
        description: 'Started your parenting journey',
        icon: '🍼',
        color: '#4CAF50',
        requirements: ['Complete character creation'],
        displayOrder: 1
      },
      {
        id: 'dedicated_parent',
        name: 'Dedicated Parent',
        description: 'Played for 10+ game years',
        icon: '⏰',
        color: '#2196F3',
        requirements: ['Reach age 10'],
        displayOrder: 2
      },
      {
        id: 'achievement_hunter',
        name: 'Achievement Hunter',
        description: 'Unlocked 10+ achievements',
        icon: '🏆',
        color: '#FF9800',
        requirements: ['Unlock 10 achievements'],
        displayOrder: 3
      }
    ];
  }

  public getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  public getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id);
  }

  public checkAchievementProgress(gameState: GameState): AchievementProgress[] {
    const progress: AchievementProgress[] = [];
    
    for (const achievement of this.achievements) {
      const currentProgress = this.calculateAchievementProgress(achievement, gameState);
      progress.push(currentProgress);
    }
    
    return progress;
  }

  private calculateAchievementProgress(achievement: Achievement, gameState: GameState): AchievementProgress {
    let totalProgress = 0;
    let completedRequirements = 0;
    const currentValues: { [key: string]: number } = {};
    
    for (const requirement of achievement.requirements) {
      const requirementProgress = this.calculateRequirementProgress(requirement, gameState);
      currentValues[requirement.target.toString()] = requirementProgress.currentValue;
      
      if (requirementProgress.isCompleted) {
        completedRequirements++;
      }
      
      totalProgress += requirementProgress.progress;
    }
    
    const overallProgress = Math.min(100, (totalProgress / achievement.requirements.length));
    const isCompleted = completedRequirements === achievement.requirements.length;
    
    return {
      achievementId: achievement.id,
      progress: overallProgress,
      currentValues,
      lastUpdated: new Date(),
      isCompleted,
      canUnlock: isCompleted && !this.isAchievementUnlocked(achievement.id, gameState)
    };
  }

  private calculateRequirementProgress(requirement: AchievementRequirement, gameState: GameState): {
    progress: number;
    currentValue: number;
    isCompleted: boolean;
  } {
    let currentValue = 0;
    let progress = 0;
    let isCompleted = false;
    
    switch (requirement.type) {
      case 'trait_level':
        if (gameState.activeChildId && gameState.children[gameState.activeChildId]) {
          const child = gameState.children[gameState.activeChildId];
          const trait = child.personalityTraits.find(t => t.id === requirement.target);
          if (trait) {
            currentValue = trait.value;
            progress = Math.min(100, (currentValue / requirement.value) * 100);
            isCompleted = currentValue >= requirement.value;
          }
        }
        break;
        
      case 'skill_level':
        if (gameState.activeChildId && gameState.children[gameState.activeChildId]) {
          const child = gameState.children[gameState.activeChildId];
          const skill = child.skills.find(s => s.id === requirement.target);
          if (skill) {
            currentValue = skill.level;
            progress = Math.min(100, (currentValue / requirement.value) * 100);
            isCompleted = currentValue >= requirement.value;
          }
        }
        break;
        
      case 'milestone_count':
        if (gameState.activeChildId && gameState.children[gameState.activeChildId]) {
          const child = gameState.children[gameState.activeChildId];
          currentValue = child.milestones.filter(m => m.achieved).length;
          progress = Math.min(100, (currentValue / requirement.value) * 100);
          isCompleted = currentValue >= requirement.value;
        }
        break;
        
      case 'family_stat':
        if (requirement.target === 'happiness') {
          currentValue = gameState.happiness;
          progress = Math.min(100, (currentValue / requirement.value) * 100);
          isCompleted = currentValue >= requirement.value;
        }
        break;
        
      case 'financial_level':
        if (gameState.parentCharacter) {
          currentValue = gameState.parentCharacter.financialLevel;
          progress = Math.min(100, (currentValue / requirement.value) * 100);
          isCompleted = currentValue >= requirement.value;
        }
        break;
        
      case 'age_reached':
        currentValue = gameState.currentAge;
        progress = Math.min(100, (currentValue / requirement.value) * 100);
        isCompleted = currentValue >= requirement.value;
        break;
        
      case 'custom':
        // Handle custom requirements
        const customProgress = this.calculateCustomRequirement(requirement, gameState);
        currentValue = customProgress.currentValue;
        progress = customProgress.progress;
        isCompleted = customProgress.isCompleted;
        break;
    }
    
    return { progress, currentValue, isCompleted };
  }

  private calculateCustomRequirement(requirement: AchievementRequirement, gameState: GameState): {
    progress: number;
    currentValue: number;
    isCompleted: boolean;
  } {
    let currentValue = 0;
    let progress = 0;
    let isCompleted = false;
    
    switch (requirement.target) {
      case 'child_count':
        currentValue = Object.keys(gameState.children).length;
        progress = Math.min(100, (currentValue / requirement.value) * 100);
        isCompleted = currentValue >= requirement.value;
        break;
        
      case 'simultaneous_children':
        // Count active children (not yet adults)
        const activeChildren = Object.values(gameState.children).filter(child => child.age < 18);
        currentValue = activeChildren.length;
        progress = Math.min(100, (currentValue / requirement.value) * 100);
        isCompleted = currentValue >= requirement.value;
        break;
        
      case 'all_traits_above':
        if (gameState.activeChildId && gameState.children[gameState.activeChildId]) {
          const child = gameState.children[gameState.activeChildId];
          const traitsAboveThreshold = child.personalityTraits.filter(t => t.value >= requirement.value);
          currentValue = traitsAboveThreshold.length;
          const totalTraits = child.personalityTraits.length;
          progress = totalTraits > 0 ? (currentValue / totalTraits) * 100 : 0;
          isCompleted = currentValue === totalTraits && totalTraits > 0;
        }
        break;
        
      case 'supportive_choices':
        // Count supportive choices from timeline
        const supportiveChoices = gameState.timeline.filter(entry => 
          entry.choice.toLowerCase().includes('support') || 
          entry.choice.toLowerCase().includes('encourage') ||
          entry.choice.toLowerCase().includes('comfort')
        );
        currentValue = supportiveChoices.length;
        progress = Math.min(100, (currentValue / requirement.value) * 100);
        isCompleted = currentValue >= requirement.value;
        break;
    }
    
    return { progress, currentValue, isCompleted };
  }

  public unlockAchievement(achievementId: string, gameState: GameState): UnlockedAchievement | null {
    const achievement = this.getAchievementById(achievementId);
    if (!achievement) return null;
    
    if (this.isAchievementUnlocked(achievementId, gameState)) {
      return null; // Already unlocked
    }
    
    const progressData = this.calculateAchievementProgress(achievement, gameState);
    if (!progressData.canUnlock) {
      return null; // Requirements not met
    }
    
    const unlockedAchievement: UnlockedAchievement = {
      achievementId,
      unlockedAt: new Date(),
      gameAge: gameState.currentAge,
      childId: gameState.activeChildId || undefined,
      progress: 100,
      milestoneSnapshot: {
        childName: gameState.activeChildId ? gameState.children[gameState.activeChildId].name : 'Unknown',
        parentName: gameState.parentCharacter?.name || 'Unknown',
        familySize: Object.keys(gameState.children).length,
        totalProgress: gameState.currentAge
      }
    };
    
    return unlockedAchievement;
  }

  public isAchievementUnlocked(achievementId: string, gameState: GameState): boolean {
    return gameState.achievements.unlocked.some(ua => ua.achievementId === achievementId);
  }

  public calculateAchievementStats(gameState: GameState): AchievementStats {
    const unlockedAchievements = gameState.achievements.unlocked;
    const totalAchievements = this.achievements.length;
    
    let totalPoints = 0;
    const rarityCount: { [key in AchievementRarity]: number } = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };
    
    const categoryProgress: { [key in AchievementCategory]: { unlocked: number; total: number; points: number } } = {
      family: { unlocked: 0, total: 0, points: 0 },
      individual: { unlocked: 0, total: 0, points: 0 },
      sibling: { unlocked: 0, total: 0, points: 0 },
      parenting: { unlocked: 0, total: 0, points: 0 },
      milestone: { unlocked: 0, total: 0, points: 0 },
      financial: { unlocked: 0, total: 0, points: 0 },
      social: { unlocked: 0, total: 0, points: 0 }
    };
    
    // Calculate totals by category
    for (const achievement of this.achievements) {
      categoryProgress[achievement.category].total++;
    }
    
    // Calculate unlocked achievements
    for (const unlockedAchievement of unlockedAchievements) {
      const achievement = this.getAchievementById(unlockedAchievement.achievementId);
      if (achievement) {
        totalPoints += achievement.points;
        rarityCount[achievement.rarity]++;
        categoryProgress[achievement.category].unlocked++;
        categoryProgress[achievement.category].points += achievement.points;
      }
    }
    
    return {
      totalPoints,
      achievementsUnlocked: unlockedAchievements.length,
      achievementsAvailable: totalAchievements,
      rarityCount,
      categoryProgress,
      recentUnlocks: unlockedAchievements.slice(-5).reverse()
    };
  }

  public initializeGameStateAchievements(gameState: GameState): void {
    if (!gameState.achievements) {
      gameState.achievements = {
        unlocked: [],
        progress: [],
        stats: this.calculateAchievementStats(gameState)
      };
    }
    
    if (!gameState.badges) {
      gameState.badges = [];
    }
  }

  public updateAchievementProgress(gameState: GameState): UnlockedAchievement[] {
    const newUnlocks: UnlockedAchievement[] = [];
    
    // Update progress for all achievements
    gameState.achievements.progress = this.checkAchievementProgress(gameState);
    
    // Check for new unlocks
    for (const progressData of gameState.achievements.progress) {
      if (progressData.canUnlock) {
        const unlockedAchievement = this.unlockAchievement(progressData.achievementId, gameState);
        if (unlockedAchievement) {
          gameState.achievements.unlocked.push(unlockedAchievement);
          newUnlocks.push(unlockedAchievement);
        }
      }
    }
    
    // Update stats
    gameState.achievements.stats = this.calculateAchievementStats(gameState);
    
    return newUnlocks;
  }

  public getAllBadges(): Badge[] {
    return [...this.badges];
  }

  public checkBadgeEligibility(gameState: GameState): Badge[] {
    const eligibleBadges: Badge[] = [];
    
    for (const badge of this.badges) {
      if (!this.isBadgeUnlocked(badge.id, gameState) && this.canUnlockBadge(badge, gameState)) {
        eligibleBadges.push({
          ...badge,
          unlockedAt: new Date()
        });
      }
    }
    
    return eligibleBadges;
  }

  private isBadgeUnlocked(badgeId: string, gameState: GameState): boolean {
    return gameState.badges.some(b => b.id === badgeId);
  }

  private canUnlockBadge(badge: Badge, gameState: GameState): boolean {
    switch (badge.id) {
      case 'first_time_parent':
        return gameState.phase === 'gameplay' && Object.keys(gameState.children).length > 0;
      case 'dedicated_parent':
        return gameState.currentAge >= 10;
      case 'achievement_hunter':
        return gameState.achievements.unlocked.length >= 10;
      default:
        return false;
    }
  }
}

export const achievementService = new AchievementService();