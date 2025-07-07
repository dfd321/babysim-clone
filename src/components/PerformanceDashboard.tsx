import React, { useState, useEffect } from 'react';
import { PerformanceMonitoringService, PerformanceMetrics } from '../services/performanceMonitoringService';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMetrics(PerformanceMonitoringService.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getMetricStatus = (value: number | undefined, thresholds: { good: number; poor: number }) => {
    if (!value) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🚀 Performance Dashboard</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Core Web Vitals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📊 Core Web Vitals
              <span className="text-sm font-normal text-gray-500 ml-2">(Google Standards)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cumulative Layout Shift</span>
                  {getStatusEmoji(getMetricStatus(metrics.cls, { good: 0.1, poor: 0.25 }))}
                </div>
                <div className="text-2xl font-bold">
                  {metrics.cls ? metrics.cls.toFixed(3) : 'Measuring...'}
                </div>
                <div className={`text-sm px-2 py-1 rounded mt-2 inline-block ${
                  getStatusColor(getMetricStatus(metrics.cls, { good: 0.1, poor: 0.25 }))
                }`}>
                  {metrics.cls ? (metrics.cls <= 0.1 ? 'Good' : metrics.cls <= 0.25 ? 'Needs Improvement' : 'Poor') : 'Unknown'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">First Input Delay</span>
                  {getStatusEmoji(getMetricStatus(metrics.fid, { good: 100, poor: 300 }))}
                </div>
                <div className="text-2xl font-bold">
                  {metrics.fid ? `${metrics.fid.toFixed(1)}ms` : 'Measuring...'}
                </div>
                <div className={`text-sm px-2 py-1 rounded mt-2 inline-block ${
                  getStatusColor(getMetricStatus(metrics.fid, { good: 100, poor: 300 }))
                }`}>
                  {metrics.fid ? (metrics.fid <= 100 ? 'Good' : metrics.fid <= 300 ? 'Needs Improvement' : 'Poor') : 'Unknown'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Largest Contentful Paint</span>
                  {getStatusEmoji(getMetricStatus(metrics.lcp, { good: 2500, poor: 4000 }))}
                </div>
                <div className="text-2xl font-bold">
                  {metrics.lcp ? `${metrics.lcp.toFixed(1)}ms` : 'Measuring...'}
                </div>
                <div className={`text-sm px-2 py-1 rounded mt-2 inline-block ${
                  getStatusColor(getMetricStatus(metrics.lcp, { good: 2500, poor: 4000 }))
                }`}>
                  {metrics.lcp ? (metrics.lcp <= 2500 ? 'Good' : metrics.lcp <= 4000 ? 'Needs Improvement' : 'Poor') : 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Custom App Metrics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">🎮 Game Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-medium text-blue-800 mb-2">Game State Update</div>
                <div className="text-xl font-bold text-blue-900">
                  {metrics.gameStateUpdateTime ? `${metrics.gameStateUpdateTime.toFixed(1)}ms` : 'No data'}
                </div>
                <div className="text-sm text-blue-600 mt-1">Target: &lt;50ms</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-medium text-green-800 mb-2">Component Render</div>
                <div className="text-xl font-bold text-green-900">
                  {metrics.componentRenderTime ? `${metrics.componentRenderTime.toFixed(1)}ms` : 'No data'}
                </div>
                <div className="text-sm text-green-600 mt-1">Target: &lt;16ms</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="font-medium text-purple-800 mb-2">Scenario Generation</div>
                <div className="text-xl font-bold text-purple-900">
                  {metrics.scenarioGenerationTime ? `${metrics.scenarioGenerationTime.toFixed(1)}ms` : 'No data'}
                </div>
                <div className="text-sm text-purple-600 mt-1">Target: &lt;100ms</div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="font-medium text-orange-800 mb-2">Dashboard Load</div>
                <div className="text-xl font-bold text-orange-900">
                  {metrics.dashboardLoadTime ? `${metrics.dashboardLoadTime.toFixed(1)}ms` : 'No data'}
                </div>
                <div className="text-sm text-orange-600 mt-1">Target: &lt;1000ms</div>
              </div>
            </div>
          </div>

          {/* Optimization Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">⚡ Performance Optimizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-700">✅ Implemented Optimizations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    React.memo for Timeline, CharacterDevelopment, GameplayHeader
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lazy loading for Dashboard components
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Bundle splitting for modal components
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Performance monitoring with Web Vitals
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Optimized callback hooks (debounced, throttled)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom comparison functions for memo
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Loading fallbacks with skeleton UI
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Performance tracking for game operations
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-blue-700">🎯 Key Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Reduced initial bundle size with lazy loading
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Fewer unnecessary re-renders with React.memo
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Improved user experience with loading states
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Real-time performance monitoring
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Optimized decision processing
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Better mobile performance
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Proactive error boundaries
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    Memory usage tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Metrics (Expandable) */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
              Advanced Metrics & Debug Info
            </button>

            {isExpanded && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Additional Web Vitals</h5>
                    <div>First Contentful Paint: {metrics.fcp ? `${metrics.fcp.toFixed(1)}ms` : 'Measuring...'}</div>
                    <div>Time to First Byte: {metrics.ttfb ? `${metrics.ttfb.toFixed(1)}ms` : 'Measuring...'}</div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">User Interaction</h5>
                    <div>Avg Decision Time: {metrics.averageDecisionTime ? `${metrics.averageDecisionTime.toFixed(1)}ms` : 'No data'}</div>
                    <div>Total Sessions: {metrics.totalGameSessions || 'No data'}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Performance Tips</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Dashboard components are lazy-loaded for faster initial page load</div>
                    <div>• React.memo prevents unnecessary re-renders in complex components</div>
                    <div>• Custom hooks optimize callback functions and reduce memory usage</div>
                    <div>• Performance monitoring helps identify bottlenecks in real-time</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PerformanceDashboard);