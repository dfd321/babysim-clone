import { GameStyle } from '../types/game';
import { ScenarioData, ScenarioModule, ScenarioLoader } from '../scenarios/types';

/**
 * Dynamic Scenario Loader Service
 * 
 * Implements lazy loading of scenario modules based on age groups to reduce initial bundle size.
 * Scenarios are loaded on-demand when needed, providing significant performance benefits.
 */
export class DynamicScenarioLoader {
  private static loadedModules: Map<string, ScenarioModule> = new Map();
  private static loadingPromises: Map<string, Promise<ScenarioModule>> = new Map();
  
  // Define age group ranges for lazy loading
  private static readonly AGE_GROUPS = {
    earlyChildhood: { min: 1, max: 3, loader: () => import('../scenarios/earlyChildhood') },
    middleChildhood: { min: 4, max: 8, loader: () => import('../scenarios/middleChildhood') },
    preTeens: { min: 9, max: 12, loader: () => import('../scenarios/preTeens') },
    teenagers: { min: 13, max: 18, loader: () => import('../scenarios/teenagers') }
  };

  /**
   * Get scenario for a specific age and game style with lazy loading
   */
  static async getScenario(age: number, gameStyle: GameStyle): Promise<ScenarioData | null> {
    const ageGroup = this.getAgeGroupForAge(age);
    
    if (!ageGroup) {
      return this.getFallbackScenario(age, gameStyle);
    }

    try {
      const module = await this.loadScenarioModule(ageGroup);
      const scenarioData = module.scenarios[age]?.[gameStyle];
      
      return scenarioData || this.getFallbackScenario(age, gameStyle);
    } catch (error) {
      console.error(`Failed to load scenario for age ${age}, style ${gameStyle}:`, error);
      return this.getFallbackScenario(age, gameStyle);
    }
  }

  /**
   * Preload scenarios for a specific age group
   */
  static async preloadAgeGroup(age: number): Promise<void> {
    const ageGroup = this.getAgeGroupForAge(age);
    if (!ageGroup) return;

    try {
      await this.loadScenarioModule(ageGroup);
    } catch (error) {
      console.error(`Failed to preload age group for age ${age}:`, error);
    }
  }

  /**
   * Preload the next age group in advance
   */
  static async preloadNextAgeGroup(currentAge: number): Promise<void> {
    const nextAge = currentAge + 1;
    const currentAgeGroup = this.getAgeGroupForAge(currentAge);
    const nextAgeGroup = this.getAgeGroupForAge(nextAge);
    
    // Only preload if we're transitioning to a new age group
    if (nextAgeGroup && nextAgeGroup !== currentAgeGroup) {
      await this.preloadAgeGroup(nextAge);
    }
  }

  /**
   * Get all scenarios for an age group (for bulk operations)
   */
  static async getAgeGroupScenarios(ageGroupName: string): Promise<ScenarioModule | null> {
    if (!this.AGE_GROUPS[ageGroupName as keyof typeof this.AGE_GROUPS]) {
      return null;
    }

    try {
      return await this.loadScenarioModule(ageGroupName);
    } catch (error) {
      console.error(`Failed to load age group ${ageGroupName}:`, error);
      return null;
    }
  }

  /**
   * Check if scenarios are available for a specific age
   */
  static hasScenarioForAge(age: number): boolean {
    return this.getAgeGroupForAge(age) !== null;
  }

  /**
   * Get loading status for age groups
   */
  static getLoadingStatus(): {
    loaded: string[];
    loading: string[];
    available: string[];
  } {
    return {
      loaded: Array.from(this.loadedModules.keys()),
      loading: Array.from(this.loadingPromises.keys()),
      available: Object.keys(this.AGE_GROUPS)
    };
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  static clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }

  // Private helper methods

  private static getAgeGroupForAge(age: number): string | null {
    for (const [groupName, config] of Object.entries(this.AGE_GROUPS)) {
      if (age >= config.min && age <= config.max) {
        return groupName;
      }
    }
    return null;
  }

  private static async loadScenarioModule(ageGroup: string): Promise<ScenarioModule> {
    // Return cached module if already loaded
    if (this.loadedModules.has(ageGroup)) {
      return this.loadedModules.get(ageGroup)!;
    }

    // Return existing loading promise if already in progress
    if (this.loadingPromises.has(ageGroup)) {
      return this.loadingPromises.get(ageGroup)!;
    }

    const ageGroupConfig = this.AGE_GROUPS[ageGroup as keyof typeof this.AGE_GROUPS];
    if (!ageGroupConfig) {
      throw new Error(`Unknown age group: ${ageGroup}`);
    }

    // Create and cache loading promise
    const loadingPromise = this.executeModuleLoad(ageGroupConfig.loader);
    this.loadingPromises.set(ageGroup, loadingPromise);

    try {
      const module = await loadingPromise;
      
      // Cache the loaded module
      this.loadedModules.set(ageGroup, module);
      this.loadingPromises.delete(ageGroup);
      
      // Log successful load for performance monitoring
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Loaded scenario module: ${ageGroup}`);
      }
      
      return module;
    } catch (error) {
      // Clean up failed loading promise
      this.loadingPromises.delete(ageGroup);
      throw error;
    }
  }

  private static async executeModuleLoad(loader: () => Promise<any>): Promise<ScenarioModule> {
    const startTime = performance.now();
    
    try {
      const moduleExports = await loader();
      const module = moduleExports.default || moduleExports;
      
      const loadTime = performance.now() - startTime;
      
      // Performance monitoring
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Scenario module loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      return module;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      console.error(`❌ Failed to load scenario module after ${loadTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  private static getFallbackScenario(age: number, gameStyle: GameStyle): ScenarioData {
    return {
      title: "Growing Up",
      description: `Your child is now ${age} years old and facing new challenges appropriate for their age.`,
      options: [
        { label: "A) Handle with care and patience", consequence: "Steady progress. Happiness +10, finances -1000" },
        { label: "B) Seek professional guidance", consequence: "Expert help improves situation. Happiness +15, finances -5000" },
        { label: "C) Let them figure it out themselves", consequence: "Mixed results from independence. Happiness +5, finances -500" },
        { label: "D) Ignore the problem", consequence: "Issues worsen over time. Happiness -10, finances -200" }
      ]
    };
  }

  /**
   * Performance monitoring methods
   */
  static getPerformanceMetrics(): {
    totalModulesLoaded: number;
    cacheHitRate: number;
    averageLoadTime: number;
  } {
    // This would integrate with your performance monitoring service
    return {
      totalModulesLoaded: this.loadedModules.size,
      cacheHitRate: 0, // Calculate based on cache hits vs misses
      averageLoadTime: 0 // Calculate based on load time tracking
    };
  }

  /**
   * Warm up cache by preloading common age groups
   */
  static async warmUpCache(): Promise<void> {
    // Preload the most common starting scenarios
    const commonAgeGroups = ['earlyChildhood', 'middleChildhood'];
    
    const preloadPromises = commonAgeGroups.map(group => 
      this.loadScenarioModule(group).catch(error => {
        console.warn(`Failed to warm up cache for ${group}:`, error);
      })
    );

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Intelligent preloading based on current game state
   */
  static async intelligentPreload(currentAge: number, gameProgression: 'fast' | 'normal' | 'slow' = 'normal'): Promise<void> {
    const preloadDistance = gameProgression === 'fast' ? 2 : gameProgression === 'slow' ? 1 : 1;
    
    for (let age = currentAge + 1; age <= currentAge + preloadDistance; age++) {
      await this.preloadAgeGroup(age);
    }
  }
}

export default DynamicScenarioLoader;