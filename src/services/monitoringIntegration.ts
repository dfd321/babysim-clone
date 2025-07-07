import { sentryService } from './sentryService';
import { logRocketService } from './logRocketService';
import { monitoring } from '../utils/monitoring';

/**
 * Unified monitoring service that orchestrates all monitoring tools
 * Provides a single interface for error tracking, performance monitoring, and session replay
 */
class MonitoringIntegration {
  private isInitialized = false;
  private environment = import.meta.env.VITE_APP_ENV;
  private isProduction = this.environment === 'production';
  private isMonitoringEnabled = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';

  public async initialize(): Promise<void> {
    if (this.isInitialized || !this.isMonitoringEnabled) {
      return;
    }

    try {
      // Initialize Sentry for error tracking
      sentryService.initialize();
      
      // Initialize LogRocket for session replay (production only)
      if (this.isProduction) {
        logRocketService.initialize();
        
        // Integrate LogRocket with Sentry
        logRocketService.integrateWithSentry();
      }

      // Set up cross-service error handling
      this.setupErrorHandling();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Set up game-specific tracking
      this.setupGameTracking();

      this.isInitialized = true;
      
      console.log('✅ Monitoring integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize monitoring integration:', error);
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      const error = event.error || new Error(event.message);
      this.reportError(error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const error = new Error(`Unhandled Promise Rejection: ${event.reason}`);
      this.reportError(error, {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      });
    });

    // React Error Boundary integration
    this.setupReactErrorBoundary();
  }

  private setupPerformanceMonitoring(): void {
    // Track Web Vitals
    sentryService.trackWebVitals();
    
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance('page_load', {
            loadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: this.getFirstPaint(),
            largestContentfulPaint: this.getLargestContentfulPaint(),
          });
        }
      }, 0);
    });
  }

  private setupGameTracking(): void {
    // Track game-specific events
    this.trackGameInitialization();
    this.setupGameStateTracking();
    this.setupUserInteractionTracking();
  }

  private setupReactErrorBoundary(): void {
    // This will be used in the main App component
    // See ErrorBoundary component for implementation
  }

  // Public API methods
  public reportError(error: Error, context?: any): void {
    if (!this.isInitialized) return;

    // Report to Sentry
    sentryService.captureException(error, context);
    
    // Report to LogRocket
    if (this.isProduction) {
      logRocketService.trackError(error, context);
    }

    // Add breadcrumb for debugging
    this.addBreadcrumb('Error occurred', 'error', {
      errorMessage: error.message,
      ...context,
    });
  }

  public trackEvent(eventName: string, properties?: any): void {
    if (!this.isInitialized) return;

    // Track in LogRocket
    if (this.isProduction) {
      logRocketService.trackEvent(eventName, properties);
    }

    // Add breadcrumb in Sentry
    sentryService.addBreadcrumb(eventName, 'user_action', properties);

    // Track in analytics
    monitoring.trackEvent(eventName, properties);
  }

  public trackPerformance(metricName: string, data: any): void {
    if (!this.isInitialized) return;

    // Report to Sentry
    sentryService.setExtra(`performance_${metricName}`, data);

    // Report to LogRocket
    if (this.isProduction) {
      logRocketService.trackPerformance(metricName, data.value || 0, data);
    }

    // Report to custom monitoring
    monitoring.reportMetric(metricName, data.value || 0, data);
  }

  public identifyUser(userId: string, userInfo?: any): void {
    if (!this.isInitialized) return;

    // Set user in Sentry
    sentryService.setUserContext(userId, userInfo?.email, userInfo?.username);

    // Identify in LogRocket
    if (this.isProduction) {
      logRocketService.identify(userId, userInfo);
    }

    // Add user context to breadcrumbs
    this.addBreadcrumb('User identified', 'user', { userId, ...userInfo });
  }

  public addBreadcrumb(message: string, category: string, data?: any): void {
    if (!this.isInitialized) return;

    sentryService.addBreadcrumb(message, category, data);
  }

  public setTag(key: string, value: string): void {
    if (!this.isInitialized) return;

    sentryService.setTag(key, value);
  }

  public startTransaction(name: string, operation: string) {
    if (!this.isInitialized) return null;

    return sentryService.startTransaction(name, operation);
  }

  // Game-specific tracking methods
  public trackGameInitialization(): void {
    this.trackEvent('game_initialized', {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      language: navigator.language,
    });
  }

  public trackGameStateChange(fromState: string, toState: string, gameData?: any): void {
    this.trackEvent('game_state_change', {
      fromState,
      toState,
      gameData,
      timestamp: new Date().toISOString(),
    });

    this.addBreadcrumb('Game state changed', 'game', {
      from: fromState,
      to: toState,
    });
  }

  public trackUserDecision(scenario: string, choice: string, outcome?: any): void {
    this.trackEvent('user_decision', {
      scenario,
      choice,
      outcome,
      timestamp: new Date().toISOString(),
    });
  }

  public trackCharacterGeneration(duration: number, success: boolean, character?: any): void {
    this.trackEvent('character_generation', {
      duration,
      success,
      character: character ? {
        personality: character.personality,
        traits: character.traits?.length || 0,
        interests: character.interests?.length || 0,
      } : null,
    });
  }

  public trackAchievement(achievementId: string, achievementName: string): void {
    this.trackEvent('achievement_unlocked', {
      achievementId,
      achievementName,
      timestamp: new Date().toISOString(),
    });
  }

  // Performance helper methods
  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  private getLargestContentfulPaint(): number | null {
    // This would need to be implemented with PerformanceObserver
    // for real-time LCP tracking
    return null;
  }

  private setupGameStateTracking(): void {
    // Monitor localStorage changes for game state
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      if (key.startsWith('babysim_')) {
        monitoringIntegration.addBreadcrumb('Game state saved', 'game_storage', { key });
      }
      originalSetItem.call(this, key, value);
    };
  }

  private setupUserInteractionTracking(): void {
    // Track clicks on important game elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('[data-track="true"]') || 
          target.closest('[data-track="true"]')) {
        const trackingData = target.dataset.trackData || 
                           target.closest('[data-track="true"]')?.dataset.trackData;
        
        this.trackEvent('ui_interaction', {
          element: target.tagName.toLowerCase(),
          trackingData: trackingData ? JSON.parse(trackingData) : {},
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  // Session replay controls
  public startSessionReplay(): void {
    if (this.isProduction) {
      logRocketService.startNewSession();
    }
  }

  public getSessionReplayURL(): string | null {
    if (this.isProduction) {
      return logRocketService.getSessionURL();
    }
    return null;
  }

  // Health monitoring
  public async performHealthCheck(): Promise<boolean> {
    try {
      const healthStatus = await monitoring.performHealthCheck();
      this.trackEvent('health_check', { status: healthStatus ? 'healthy' : 'unhealthy' });
      return healthStatus;
    } catch (error) {
      this.reportError(error as Error, { context: 'health_check' });
      return false;
    }
  }
}

export const monitoringIntegration = new MonitoringIntegration();

// React Hook for monitoring integration
export const useMonitoring = () => {
  return {
    reportError: monitoringIntegration.reportError.bind(monitoringIntegration),
    trackEvent: monitoringIntegration.trackEvent.bind(monitoringIntegration),
    trackPerformance: monitoringIntegration.trackPerformance.bind(monitoringIntegration),
    identifyUser: monitoringIntegration.identifyUser.bind(monitoringIntegration),
    trackGameStateChange: monitoringIntegration.trackGameStateChange.bind(monitoringIntegration),
    trackUserDecision: monitoringIntegration.trackUserDecision.bind(monitoringIntegration),
    trackCharacterGeneration: monitoringIntegration.trackCharacterGeneration.bind(monitoringIntegration),
    trackAchievement: monitoringIntegration.trackAchievement.bind(monitoringIntegration),
    getSessionReplayURL: monitoringIntegration.getSessionReplayURL.bind(monitoringIntegration),
  };
};