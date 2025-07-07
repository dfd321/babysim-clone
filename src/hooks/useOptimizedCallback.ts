import { useCallback, useRef } from 'react';

/**
 * Optimized useCallback hook that provides better performance for complex scenarios
 * - Automatically memoizes callback functions
 * - Prevents unnecessary re-renders in child components
 * - Provides debugging information in development mode
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const callCount = useRef(0);
  const lastCallTime = useRef(0);
  
  const optimizedCallback = useCallback((...args: Parameters<T>) => {
    const startTime = performance.now();
    callCount.current++;
    
    if (process.env.NODE_ENV === 'development' && debugName) {
      const timeSinceLastCall = startTime - lastCallTime.current;
      if (timeSinceLastCall < 16) {
        console.warn(
          `⚠️ Rapid callback execution: ${debugName} called ${callCount.current} times, ` +
          `${timeSinceLastCall.toFixed(1)}ms since last call`
        );
      }
    }
    
    lastCallTime.current = startTime;
    
    try {
      const result = callback(...args);
      
      if (process.env.NODE_ENV === 'development') {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 16) {
          console.warn(
            `🐌 Slow callback execution: ${debugName || 'unnamed'} took ${duration.toFixed(2)}ms`
          );
        }
      }
      
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Callback error in ${debugName || 'unnamed'}:`, error);
      }
      throw error;
    }
  }, deps) as T;
  
  return optimizedCallback;
}

/**
 * Stable callback hook that never changes reference unless explicitly updated
 * Useful for callbacks that don't depend on component state
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Debounced callback hook for performance optimization
 * Prevents rapid successive calls to expensive operations
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList,
  debugName?: string
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callCount = useRef(0);
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    callCount.current++;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (process.env.NODE_ENV === 'development' && debugName) {
        console.log(`🔄 Debounced callback executed: ${debugName} (${callCount.current} calls debounced)`);
        callCount.current = 0;
      }
      
      callback(...args);
    }, delay);
  }, [...deps, delay]) as T;
  
  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  
  // Use effect for cleanup
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return debouncedCallback;
}

/**
 * Throttled callback hook for performance optimization
 * Limits the rate of callback execution
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList,
  debugName?: string
): T {
  const lastCallTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime.current;
    
    if (timeSinceLastCall >= delay) {
      // Execute immediately
      lastCallTime.current = now;
      callback(...args);
      
      if (process.env.NODE_ENV === 'development' && debugName) {
        console.log(`⚡ Throttled callback executed immediately: ${debugName}`);
      }
    } else {
      // Schedule for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallTime.current = Date.now();
        callback(...args);
        
        if (process.env.NODE_ENV === 'development' && debugName) {
          console.log(`⚡ Throttled callback executed after delay: ${debugName}`);
        }
      }, delay - timeSinceLastCall);
    }
  }, [...deps, delay]) as T;
  
  return throttledCallback;
}

// React import for useEffect
import React from 'react';