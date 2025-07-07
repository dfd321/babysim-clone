// web-vitals types
interface Metric {
  name: string;
  value: number;
  delta: number;
  id: string;
}

// Mock web-vitals functions for build compatibility
const getCLS = (callback: (metric: Metric) => void) => {
  // Mock implementation
  if (typeof window !== 'undefined') {
    callback({ name: 'CLS', value: 0, delta: 0, id: 'cls-mock' });
  }
};

const getFID = (callback: (metric: Metric) => void) => {
  if (typeof window !== 'undefined') {
    callback({ name: 'FID', value: 0, delta: 0, id: 'fid-mock' });
  }
};

const getFCP = (callback: (metric: Metric) => void) => {
  if (typeof window !== 'undefined') {
    callback({ name: 'FCP', value: 0, delta: 0, id: 'fcp-mock' });
  }
};

const getLCP = (callback: (metric: Metric) => void) => {
  if (typeof window !== 'undefined') {
    callback({ name: 'LCP', value: 0, delta: 0, id: 'lcp-mock' });
  }
};

const getTTFB = (callback: (metric: Metric) => void) => {
  if (typeof window !== 'undefined') {
    callback({ name: 'TTFB', value: 0, delta: 0, id: 'ttfb-mock' });
  }
};

export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  lcp?: number; // Largest Contentful Paint
  
  // Other Important Metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom App Metrics
  gameStateUpdateTime?: number;
  componentRenderTime?: number;
  scenarioGenerationTime?: number;
  dashboardLoadTime?: number;
  
  // User Interaction Metrics
  averageDecisionTime?: number;
  totalGameSessions?: number;
  averageSessionLength?: number;
}

export interface PerformanceThresholds {
  // Core Web Vitals thresholds (Google standards)
  cls: { good: 0.1, poor: 0.25 };
  fid: { good: 100, poor: 300 };
  lcp: { good: 2500, poor: 4000 };
  
  // Custom thresholds
  gameStateUpdate: { good: 50, poor: 200 };
  componentRender: { good: 16, poor: 100 };
  scenarioGeneration: { good: 100, poor: 500 };
  dashboardLoad: { good: 1000, poor: 3000 };
}

export class PerformanceMonitoringService {
  private static metrics: PerformanceMetrics = {};
  private static observers: PerformanceObserver[] = [];
  private static thresholds: PerformanceThresholds = {
    cls: { good: 0.1, poor: 0.25 },
    fid: { good: 100, poor: 300 },
    lcp: { good: 2500, poor: 4000 },
    gameStateUpdate: { good: 50, poor: 200 },
    componentRender: { good: 16, poor: 100 },
    scenarioGeneration: { good: 100, poor: 500 },
    dashboardLoad: { good: 1000, poor: 3000 }
  };

  // Initialize performance monitoring
  static initialize() {
    if (typeof window === 'undefined') return;

    console.log('🚀 Initializing Performance Monitoring');

    // Set up Web Vitals tracking
    this.initializeWebVitals();
    
    // Set up custom performance tracking
    this.initializeCustomMetrics();
    
    // Set up React DevTools profiler integration
    this.initializeReactProfiler();
    
    // Set up periodic reporting
    this.initializeReporting();
  }

  // Initialize Core Web Vitals tracking
  private static initializeWebVitals() {
    // Cumulative Layout Shift
    getCLS((metric: Metric) => {
      this.metrics.cls = metric.value;
      this.reportMetric('CLS', metric.value, this.thresholds.cls);
    });

    // First Input Delay
    getFID((metric: Metric) => {
      this.metrics.fid = metric.value;
      this.reportMetric('FID', metric.value, this.thresholds.fid);
    });

    // Largest Contentful Paint
    getLCP((metric: Metric) => {
      this.metrics.lcp = metric.value;
      this.reportMetric('LCP', metric.value, this.thresholds.lcp);
    });

    // First Contentful Paint
    getFCP((metric: Metric) => {
      this.metrics.fcp = metric.value;
      this.reportMetric('FCP', metric.value, { good: 1800, poor: 3000 });
    });

    // Time to First Byte
    getTTFB((metric: Metric) => {
      this.metrics.ttfb = metric.value;
      this.reportMetric('TTFB', metric.value, { good: 800, poor: 1800 });
    });
  }

  // Initialize custom app-specific metrics
  private static initializeCustomMetrics() {
    // Track long tasks that block the main thread
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long Task detected: ${entry.duration}ms`, entry);
            this.reportLongTask(entry.duration, entry.name);
          }
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);

      // Track layout shifts in detail
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.hadRecentInput) return; // Ignore user-initiated shifts
          
          if (entry.value > 0.1) {
            console.warn(`📏 Significant Layout Shift: ${entry.value}`, entry);
            this.reportLayoutShift(entry.value, entry.sources);
          }
        });
      });

      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);
    }
  }

  // Initialize React DevTools profiler integration
  private static initializeReactProfiler() {
    // This would integrate with React DevTools Profiler if available
    // For now, we'll use custom component timing
    if (typeof window !== 'undefined') {
      (window as any).__REACT_DEVTOOLS_PERFORMANCE__ = {
        onCommitFiberRoot: (rendererID: number, root: any) => {
          // Track React fiber commits
          this.trackReactCommit(rendererID, root);
        }
      };
    }
  }

  // Initialize periodic reporting
  private static initializeReporting() {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.generatePerformanceReport();
    }, 30000);

    // Report on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.generateFinalReport();
      });
    }
  }

  // Track game state update performance
  static trackGameStateUpdate(startTime: number, endTime: number) {
    const duration = endTime - startTime;
    this.metrics.gameStateUpdateTime = duration;
    
    if (duration > this.thresholds.gameStateUpdate.poor) {
      console.warn(`🐌 Slow game state update: ${duration}ms`);
    }
    
    this.reportMetric('GameStateUpdate', duration, this.thresholds.gameStateUpdate);
  }

  // Track component render performance
  static trackComponentRender(componentName: string, startTime: number, endTime: number) {
    const duration = endTime - startTime;
    this.metrics.componentRenderTime = duration;
    
    if (duration > this.thresholds.componentRender.poor) {
      console.warn(`🐌 Slow component render: ${componentName} took ${duration}ms`);
    }
    
    this.reportCustomMetric(`${componentName}Render`, duration);
  }

  // Track scenario generation performance
  static trackScenarioGeneration(startTime: number, endTime: number, scenarioType: string) {
    const duration = endTime - startTime;
    this.metrics.scenarioGenerationTime = duration;
    
    if (duration > this.thresholds.scenarioGeneration.poor) {
      console.warn(`🐌 Slow scenario generation: ${scenarioType} took ${duration}ms`);
    }
    
    this.reportCustomMetric('ScenarioGeneration', duration, { scenarioType });
  }

  // Track dashboard load performance
  static trackDashboardLoad(dashboardName: string, startTime: number, endTime: number) {
    const duration = endTime - startTime;
    this.metrics.dashboardLoadTime = duration;
    
    if (duration > this.thresholds.dashboardLoad.poor) {
      console.warn(`🐌 Slow dashboard load: ${dashboardName} took ${duration}ms`);
    }
    
    this.reportCustomMetric('DashboardLoad', duration, { dashboardName });
  }

  // Track user decision time
  static trackDecisionTime(duration: number) {
    const current = this.metrics.averageDecisionTime || 0;
    this.metrics.averageDecisionTime = (current + duration) / 2;
    
    this.reportCustomMetric('DecisionTime', duration);
  }

  // Track memory usage
  static trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // MB
      const total = memory.totalJSHeapSize / 1024 / 1024; // MB
      const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB
      
      console.log(`💾 Memory Usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (limit: ${limit.toFixed(2)}MB)`);
      
      if (used / limit > 0.8) {
        console.warn(`⚠️ High memory usage: ${(used / limit * 100).toFixed(1)}%`);
      }
      
      this.reportCustomMetric('MemoryUsage', used, { total, limit });
    }
  }

  // Report metric with threshold checking
  private static reportMetric(
    name: string, 
    value: number, 
    threshold: { good: number; poor: number }
  ) {
    let status = 'good';
    if (value > threshold.poor) status = 'poor';
    else if (value > threshold.good) status = 'needs-improvement';
    
    const emoji = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌';
    
    console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${status})`);
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        metric_status: status,
        custom_map: { metric1: value }
      });
    }
  }

  // Report custom metrics
  private static reportCustomMetric(name: string, value: number, extra?: any) {
    console.log(`📊 ${name}: ${value.toFixed(2)}ms`, extra || '');
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_performance', {
        metric_name: name,
        metric_value: value,
        ...extra
      });
    }
  }

  // Report long tasks
  private static reportLongTask(duration: number, taskName: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'long_task', {
        task_duration: duration,
        task_name: taskName
      });
    }
  }

  // Report layout shifts
  private static reportLayoutShift(value: number, sources: any[]) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'layout_shift', {
        shift_value: value,
        shift_sources: sources.length
      });
    }
  }

  // Track React commits
  private static trackReactCommit(rendererID: number, root: any) {
    // Custom React performance tracking
    console.log(`⚛️ React commit: Renderer ${rendererID}`, root);
  }

  // Generate comprehensive performance report
  static generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      metrics: { ...this.metrics },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory()
    };
    
    console.log('📊 Performance Report:', report);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_report', report);
    }
    
    return report;
  }

  // Generate final report on page unload
  private static generateFinalReport() {
    const finalReport = this.generatePerformanceReport();
    
    // Use sendBeacon for reliable delivery
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(finalReport)], { type: 'application/json' });
      navigator.sendBeacon('/api/performance', blob);
    }
  }

  // Get connection type information
  private static getConnectionType() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }
    return null;
  }

  // Get device memory information
  private static getDeviceMemory() {
    if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
      return (navigator as any).deviceMemory;
    }
    return null;
  }

  // Get current performance metrics
  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Clean up observers
  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Performance utilities for components
export const performanceUtils = {
  // Higher-order component for performance tracking
  withPerformanceTracking<T extends object>(
    Component: React.ComponentType<T>,
    componentName: string
  ) {
    return function PerformanceTrackedComponent(props: T) {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const endTime = performance.now();
        PerformanceMonitoringService.trackComponentRender(componentName, startTime, endTime);
      });
      
      return React.createElement(Component, props);
    };
  },

  // Hook for tracking custom performance
  usePerformanceTracking: (metricName: string) => {
    const startTime = React.useRef(performance.now());
    
    return {
      start: () => {
        startTime.current = performance.now();
      },
      end: (extra?: any) => {
        const endTime = performance.now();
        const duration = endTime - startTime.current;
        PerformanceMonitoringService.reportCustomMetric(metricName, duration, extra);
        return duration;
      }
    };
  },

  // Measure function execution time
  measureAsync: async <T>(fn: () => Promise<T>, metricName: string): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      PerformanceMonitoringService.reportCustomMetric(metricName, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      PerformanceMonitoringService.reportCustomMetric(
        `${metricName}_error`, 
        endTime - startTime,
        { error: error.message }
      );
      throw error;
    }
  }
};

// React component for displaying performance metrics
export const PerformanceDisplay: React.FC = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({});
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(PerformanceMonitoringService.getMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }
  
  return React.createElement('div', {
    className: 'fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded text-xs font-mono max-w-xs'
  }, [
    React.createElement('div', { 
      key: 'title',
      className: 'text-green-400 font-bold mb-2' 
    }, 'Performance Metrics'),
    metrics.cls && React.createElement('div', { key: 'cls' }, `CLS: ${metrics.cls.toFixed(3)}`),
    metrics.fid && React.createElement('div', { key: 'fid' }, `FID: ${metrics.fid.toFixed(1)}ms`),
    metrics.lcp && React.createElement('div', { key: 'lcp' }, `LCP: ${metrics.lcp.toFixed(1)}ms`),
    metrics.gameStateUpdateTime && React.createElement('div', { key: 'gameUpdate' }, `Game Update: ${metrics.gameStateUpdateTime.toFixed(1)}ms`),
    metrics.componentRenderTime && React.createElement('div', { key: 'render' }, `Render: ${metrics.componentRenderTime.toFixed(1)}ms`)
  ].filter(Boolean));
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}