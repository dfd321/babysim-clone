import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

interface LogRocketConfig {
  appId: string;
  shouldCaptureConsoleEvents: boolean;
  shouldParseXHRBlob: boolean;
  shouldCaptureWebVitals: boolean;
  shouldDebugLog: boolean;
}

class LogRocketService {
  private isInitialized = false;
  private environment = import.meta.env.VITE_APP_ENV;
  private logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;
  private isProduction = this.environment === 'production';

  public initialize(): void {
    if (this.isInitialized || !this.logRocketAppId || !this.isProduction) {
      return;
    }

    const config: LogRocketConfig = {
      appId: this.logRocketAppId,
      shouldCaptureConsoleEvents: true,
      shouldParseXHRBlob: false,
      shouldCaptureWebVitals: true,
      shouldDebugLog: !this.isProduction,
    };

    // Initialize LogRocket
    LogRocket.init(config.appId, {
      console: {
        shouldAggregateConsoleErrors: true,
        isEnabled: {
          log: !this.isProduction,
          info: true,
          warn: true,
          error: true,
        },
      },
      
      network: {
        requestSanitizer: (request) => {
          // Sanitize sensitive data from requests
          if (request.url.includes('/auth') || request.url.includes('/login')) {
            request.body = '[REDACTED]';
          }
          return request;
        },
        responseSanitizer: (response) => {
          // Sanitize sensitive data from responses
          if (response.url.includes('/auth') || response.url.includes('/profile')) {
            response.body = '[REDACTED]';
          }
          return response;
        },
      },

      dom: {
        inputSanitizer: true,
        textSanitizer: true,
        baseHref: window.location.origin,
      },

      shouldCaptureWebVitals: config.shouldCaptureWebVitals,
      shouldParseXHRBlob: config.shouldParseXHRBlob,
      shouldDebugLog: config.shouldDebugLog,
    });

    // Setup React integration
    setupLogRocketReact(LogRocket);

    // Set up automatic session identification
    this.setupSessionTracking();

    this.isInitialized = true;
  }

  private setupSessionTracking(): void {
    // Track page views
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      logRocketService.trackPageView(window.location.pathname);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      logRocketService.trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', () => {
      logRocketService.trackPageView(window.location.pathname);
    });
  }

  public identify(userId: string, userInfo?: any): void {
    if (!this.isInitialized) return;

    LogRocket.identify(userId, {
      name: userInfo?.name,
      email: userInfo?.email,
      subscriptionType: userInfo?.subscriptionType,
      // Add other user properties
      ...userInfo,
    });
  }

  public trackEvent(eventName: string, properties?: any): void {
    if (!this.isInitialized) return;

    LogRocket.track(eventName, {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...properties,
    });
  }

  public trackPageView(pageName: string): void {
    if (!this.isInitialized) return;

    this.trackEvent('Page View', {
      pageName,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }

  public trackGameAction(action: string, gameData?: any): void {
    if (!this.isInitialized) return;

    this.trackEvent('Game Action', {
      action,
      gameData,
      sessionId: this.getSessionId(),
    });
  }

  public trackError(error: Error, context?: any): void {
    if (!this.isInitialized) return;

    this.trackEvent('Error', {
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      url: window.location.href,
    });
  }

  public trackPerformance(metricName: string, value: number, additionalData?: any): void {
    if (!this.isInitialized) return;

    this.trackEvent('Performance Metric', {
      metricName,
      value,
      ...additionalData,
    });
  }

  public captureException(error: Error, tags?: any): void {
    if (!this.isInitialized) return;

    LogRocket.captureException(error, {
      tags: {
        environment: this.environment,
        ...tags,
      },
      extra: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    });
  }

  public getSessionURL(): string | null {
    if (!this.isInitialized) return null;
    return LogRocket.sessionURL;
  }

  public startNewSession(): void {
    if (!this.isInitialized) return;
    LogRocket.startNewSession();
  }

  private getSessionId(): string {
    return LogRocket.sessionURL?.split('/').pop() || 'unknown';
  }

  // Integration with other monitoring services
  public integrateWithSentry(): void {
    if (!this.isInitialized) return;

    // Add LogRocket session URL to Sentry events
    import('@sentry/react').then((Sentry) => {
      Sentry.configureScope((scope) => {
        scope.addEventProcessor((event) => {
          const sessionURL = this.getSessionURL();
          if (sessionURL) {
            event.extra = event.extra || {};
            event.extra.logRocketURL = sessionURL;
          }
          return event;
        });
      });
    });
  }

  // Advanced session management
  public pauseRecording(): void {
    if (!this.isInitialized) return;
    LogRocket.pause();
  }

  public resumeRecording(): void {
    if (!this.isInitialized) return;
    LogRocket.resume();
  }

  public addMetadata(key: string, value: any): void {
    if (!this.isInitialized) return;
    LogRocket.addMetadata(key, value);
  }

  // Privacy controls
  public redactElement(element: HTMLElement): void {
    if (!this.isInitialized) return;
    element.classList.add('lr-redact');
  }

  public blockElement(element: HTMLElement): void {
    if (!this.isInitialized) return;
    element.classList.add('lr-block');
  }
}

export const logRocketService = new LogRocketService();

// React Hook for LogRocket integration
export const useLogRocket = () => {
  return {
    trackEvent: logRocketService.trackEvent.bind(logRocketService),
    trackPageView: logRocketService.trackPageView.bind(logRocketService),
    trackGameAction: logRocketService.trackGameAction.bind(logRocketService),
    trackError: logRocketService.trackError.bind(logRocketService),
    trackPerformance: logRocketService.trackPerformance.bind(logRocketService),
    identify: logRocketService.identify.bind(logRocketService),
    getSessionURL: logRocketService.getSessionURL.bind(logRocketService),
  };
};