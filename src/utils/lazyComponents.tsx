import React, { lazy, Suspense } from 'react';

// Loading component for lazy-loaded components
const ComponentLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-gray-600">Loading component...</span>
  </div>
);

// Lazy load components with proper error boundaries
export const LazyTimeline = lazy(() => 
  import('../components/Timeline').then(module => ({
    default: module.Timeline
  }))
);

export const LazyCharacterDevelopment = lazy(() => 
  import('../components/CharacterDevelopment').then(module => ({
    default: module.CharacterDevelopment
  }))
);

export const LazyGameplayPhase = lazy(() => 
  import('../components/GameplayPhase').then(module => ({
    default: module.GameplayPhase
  }))
);

// Wrapper components with Suspense for easy usage
export const TimelineWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LazyTimeline {...props} />
  </Suspense>
);

export const CharacterDevelopmentWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LazyCharacterDevelopment {...props} />
  </Suspense>
);

export const GameplayPhaseWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ComponentLoadingFallback />}>
    <LazyGameplayPhase {...props} />
  </Suspense>
);