import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GameState } from '../types/game';
import { PerformanceMonitoringService } from '../services/performanceMonitoringService';
import { useOptimizedCallback, useDebouncedCallback } from './useOptimizedCallback';

/**
 * Performance optimization hook for the main game component
 * Provides optimized handlers and memoized values to reduce re-renders
 */
export function usePerformanceOptimization(gameState: GameState) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  // Track render performance
  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (renderCount.current > 1 && timeSinceLastRender < 16) {
      console.warn(`⚠️ Rapid re-render detected: Component rendered ${renderCount.current} times, ${timeSinceLastRender}ms since last render`);
    }
    
    lastRenderTime.current = now;
    
    // Track memory usage every 10 renders
    if (renderCount.current % 10 === 0) {
      PerformanceMonitoringService.trackMemoryUsage();
    }
  });

  // Memoized stable references for frequently accessed properties
  const memoizedGameState = useMemo(() => ({
    phase: gameState.phase,
    currentAge: gameState.currentAge,
    finances: gameState.finances,
    happiness: gameState.happiness,
    childrenCount: Object.keys(gameState.children).length,
    hasMultipleChildren: Object.keys(gameState.children).length > 1,
    activeChild: gameState.activeChildId ? gameState.children[gameState.activeChildId] : null,
    gameStyle: gameState.gameStyle,
    parentCharacter: gameState.parentCharacter
  }), [
    gameState.phase,
    gameState.currentAge,
    gameState.finances,
    gameState.happiness,
    Object.keys(gameState.children).length,
    gameState.activeChildId,
    gameState.gameStyle,
    gameState.parentCharacter
  ]);

  // Optimized decision handler with performance tracking
  const optimizedDecisionHandler = useOptimizedCallback(
    (choice: string, consequence: string, effects: any) => {
      const startTime = performance.now();
      
      try {
        // Decision processing logic would go here
        console.log('Decision made:', { choice, consequence, effects });
        
        const endTime = performance.now();
        PerformanceMonitoringService.trackGameStateUpdate(startTime, endTime);
      } catch (error) {
        console.error('Error processing decision:', error);
      }
    },
    [gameState.currentAge, gameState.activeChildId],
    'DecisionHandler'
  );

  // Debounced auto-save to prevent excessive saves
  const debouncedAutoSave = useDebouncedCallback(
    (gameStateToSave: GameState) => {
      const startTime = performance.now();
      
      try {
        // Auto-save logic would go here
        localStorage.setItem('babysim_autosave', JSON.stringify(gameStateToSave));
        
        const endTime = performance.now();
        console.log(`💾 Auto-save completed in ${(endTime - startTime).toFixed(2)}ms`);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    },
    2000, // 2 second debounce
    [gameState],
    'AutoSave'
  );

  // Optimized dashboard toggle handlers
  const dashboardHandlers = useMemo(() => ({
    toggleFamily: useOptimizedCallback(
      (show: boolean) => {
        console.log('Toggle family dashboard:', show);
      },
      [],
      'ToggleFamilyDashboard'
    ),
    
    toggleStatistics: useOptimizedCallback(
      (show: boolean) => {
        const startTime = performance.now();
        console.log('Toggle statistics dashboard:', show);
        
        if (show) {
          // Pre-calculate analytics for faster display
          setTimeout(() => {
            const endTime = performance.now();
            PerformanceMonitoringService.trackDashboardLoad('Statistics', startTime, endTime);
          }, 0);
        }
      },
      [],
      'ToggleStatisticsDashboard'
    ),
    
    toggleAchievements: useOptimizedCallback(
      (show: boolean) => {
        const startTime = performance.now();
        console.log('Toggle achievements dashboard:', show);
        
        if (show) {
          setTimeout(() => {
            const endTime = performance.now();
            PerformanceMonitoringService.trackDashboardLoad('Achievements', startTime, endTime);
          }, 0);
        }
      },
      [],
      'ToggleAchievementsDashboard'
    )
  }), []);

  // Optimized child selection handler
  const optimizedChildSelectHandler = useOptimizedCallback(
    (childId: string) => {
      if (childId === gameState.activeChildId) {
        return; // No change needed
      }
      
      console.log('Child selected:', childId);
      // Child selection logic would go here
    },
    [gameState.activeChildId],
    'ChildSelectHandler'
  );

  // Performance-aware scenario generation
  const optimizedScenarioGeneration = useCallback(
    async (age: number, style: string) => {
      const startTime = performance.now();
      
      try {
        // Scenario generation would be called here
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async operation
        
        const endTime = performance.now();
        PerformanceMonitoringService.trackScenarioGeneration(startTime, endTime, style);
      } catch (error) {
        console.error('Scenario generation failed:', error);
      }
    },
    [gameState.gameStyle, gameState.currentAge]
  );

  // Memoized derived state for expensive calculations
  const derivedState = useMemo(() => {
    const startTime = performance.now();
    
    // Expensive calculations here
    const overallProgress = gameState.currentAge / 18 * 100;
    const financialStatus = gameState.finances > 50000 ? 'wealthy' : 
                           gameState.finances > 20000 ? 'comfortable' : 
                           gameState.finances > 5000 ? 'modest' : 'struggling';
    
    const happinessLevel = gameState.happiness > 80 ? 'very happy' :
                          gameState.happiness > 60 ? 'happy' :
                          gameState.happiness > 40 ? 'content' :
                          gameState.happiness > 20 ? 'stressed' : 'struggling';
    
    const endTime = performance.now();
    
    if (endTime - startTime > 10) {
      console.warn(`🐌 Slow derived state calculation: ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    return {
      overallProgress,
      financialStatus,
      happinessLevel,
      calculationTime: endTime - startTime
    };
  }, [gameState.currentAge, gameState.finances, gameState.happiness]);

  // Effect for triggering auto-save
  useEffect(() => {
    if (gameState.phase === 'gameplay') {
      debouncedAutoSave(gameState);
    }
  }, [gameState, debouncedAutoSave]);

  // Performance monitoring effect
  useEffect(() => {
    if (renderCount.current === 1) {
      // First render - initialize performance monitoring
      PerformanceMonitoringService.initialize();
    }
    
    return () => {
      if (renderCount.current === 1) {
        // Component unmounting - cleanup
        PerformanceMonitoringService.cleanup();
      }
    };
  }, []);

  // Return optimized handlers and memoized values
  return {
    // Memoized state
    memoizedGameState,
    derivedState,
    
    // Optimized handlers
    optimizedDecisionHandler,
    optimizedChildSelectHandler,
    dashboardHandlers,
    optimizedScenarioGeneration,
    
    // Performance utilities
    debouncedAutoSave,
    renderCount: renderCount.current,
    
    // Performance tracking
    trackPerformance: {
      startTracking: (metricName: string) => performance.now(),
      endTracking: (metricName: string, startTime: number) => {
        const endTime = performance.now();
        PerformanceMonitoringService.trackComponentRender(metricName, startTime, endTime);
        return endTime - startTime;
      }
    }
  };
}