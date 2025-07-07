# Code Patterns & Standards - BabySim Project

*Shared development patterns for consistency across agents*  
*Last Updated: 2025-01-07*

## React Component Patterns

### Standard Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { ComponentProps } from '../types/game';
import { useTranslation } from '../contexts/TranslationContext';

interface LocalProps extends ComponentProps {
  // Additional local props
  onAction: (data: ActionData) => void;
}

export const ComponentName: React.FC<LocalProps> = ({ 
  prop1, 
  prop2, 
  onAction 
}) => {
  // 1. Hooks (order matters)
  const { t } = useTranslation();
  const [localState, setLocalState] = useState<StateType>(initialValue);
  
  // 2. Derived values
  const computedValue = useMemo(() => {
    return expensiveComputation(prop1);
  }, [prop1]);
  
  // 3. Event handlers
  const handleUserAction = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    onAction({ type: 'action', payload: localState });
  }, [localState, onAction]);
  
  // 4. Effects (after handlers)
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  // 5. Early returns for conditional rendering
  if (loadingCondition) {
    return <LoadingSpinner />;
  }
  
  if (errorCondition) {
    return <ErrorMessage error={errorCondition} />;
  }
  
  // 6. Main render
  return (
    <div className="component-name">
      <h2 className="text-2xl font-bold mb-4">
        {t('component_title')}
      </h2>
      {/* Component content */}
    </div>
  );
};
```

### Performance Optimization Patterns

#### React.memo for Pure Components
```typescript
// Use for components that re-render frequently with same props
const TimelineEntry = React.memo<TimelineEntryProps>(({ 
  entry, 
  isActive,
  onSelect 
}) => {
  return (
    <div 
      className={`timeline-entry ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(entry.id)}
    >
      {entry.content}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return (
    prevProps.entry.id === nextProps.entry.id &&
    prevProps.isActive === nextProps.isActive
  );
});
```

#### useCallback for Event Handlers
```typescript
// Always wrap handlers passed as props
const handleDecision = useCallback((choice: string) => {
  setGameState(prev => ({
    ...prev,
    timeline: [
      ...prev.timeline,
      createTimelineEntry(choice, prev.currentAge)
    ]
  }));
}, []);

// Pass to child components
<DecisionInterface onDecision={handleDecision} />
```

#### useMemo for Expensive Computations
```typescript
// For computed values that depend on large datasets
const timelineStatistics = useMemo(() => {
  return {
    totalDecisions: timeline.length,
    averageHappiness: timeline.reduce((sum, entry) => 
      sum + entry.effects.happiness, 0) / timeline.length,
    financialTrend: calculateFinancialTrend(timeline)
  };
}, [timeline]);
```

## State Management Patterns

### Game State Updates
```typescript
// Always use functional updates for complex state
const updateGameState = (updater: (prev: GameState) => GameState) => {
  setGameState(prev => {
    const newState = updater(prev);
    
    // Validate state integrity
    if (process.env.NODE_ENV === 'development') {
      validateGameState(newState);
    }
    
    return newState;
  });
};

// Example usage
updateGameState(prev => ({
  ...prev,
  currentAge: prev.currentAge + 1,
  timeline: [
    ...prev.timeline,
    newTimelineEntry
  ],
  happiness: Math.max(0, Math.min(100, prev.happiness + effectValue))
}));
```

### Service Integration Pattern
```typescript
// Services should be pure and return new objects
export const CharacterDevelopmentService = {
  applyDecisionEffects: (
    character: ChildCharacter, 
    decision: ScenarioOption,
    newAge: number
  ): ChildCharacter => {
    // Never mutate input objects
    const updatedTraits = character.personalityTraits.map(trait => ({
      ...trait,
      value: clamp(
        trait.value + (decision.effects?.traits?.[trait.id] || 0),
        0,
        100
      )
    }));
    
    return {
      ...character,
      age: newAge,
      personalityTraits: updatedTraits,
      developmentHistory: [
        ...character.developmentHistory,
        {
          age: newAge,
          type: 'trait_change',
          description: `Decision: ${decision.label}`,
          impact: decision.effects || {}
        }
      ]
    };
  },
  
  // Always include validation functions
  validateCharacter: (character: ChildCharacter): boolean => {
    return (
      character.name.length > 0 &&
      character.age >= 0 &&
      character.age <= 18 &&
      character.personalityTraits.length > 0
    );
  }
};
```

## TypeScript Patterns

### Type Definitions
```typescript
// Use strict types, avoid any
interface StrictComponentProps {
  // Required props
  data: GameData;
  onAction: (action: ActionType) => void;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  
  // Generic constraints
  children?: React.ReactNode;
}

// Use union types for finite sets
type GamePhase = 'setup' | 'character-gen' | 'gameplay' | 'ended';
type GameStyle = 'Realistic' | 'Fantasy' | 'Thrilling';

// Use mapped types for transformations
type PartialGameState = Partial<GameState>;
type ReadonlyGameState = Readonly<GameState>;
```

### Error Handling Types
```typescript
// Result pattern for operations that can fail
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Usage in services
export const saveGameService = {
  saveGame: async (state: GameState, name?: string): Promise<Result<string>> => {
    try {
      const saveId = await performSave(state, name);
      return { success: true, data: saveId };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
};
```

## CSS/Styling Patterns

### Tailwind CSS Standards
```typescript
// Component-specific class patterns
const styles = {
  // Layout patterns
  container: "max-w-4xl mx-auto px-4 py-8",
  card: "bg-white rounded-lg shadow-lg border p-6",
  flexCenter: "flex items-center justify-center",
  
  // Interactive elements
  buttonPrimary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors",
  buttonSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors",
  
  // State indicators
  success: "bg-green-100 border-green-400 text-green-700",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  error: "bg-red-100 border-red-400 text-red-700",
  
  // Typography
  heading1: "text-3xl font-bold text-gray-900 mb-6",
  heading2: "text-2xl font-semibold text-gray-800 mb-4",
  bodyText: "text-gray-600 leading-relaxed",
};

// Usage in components
<button className={styles.buttonPrimary}>
  {t('save_game')}
</button>
```

### Responsive Design Pattern
```typescript
// Mobile-first responsive classes
const responsiveStyles = {
  // Grid layouts
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  
  // Text sizing
  responsiveText: "text-sm md:text-base lg:text-lg",
  
  // Spacing
  responsivePadding: "p-4 md:p-6 lg:p-8",
  
  // Hidden/shown on different screens
  mobileOnly: "block md:hidden",
  desktopOnly: "hidden md:block",
};
```

## Error Handling Patterns

### Error Boundary Pattern
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to monitoring service
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
// Standard error handling for async operations
const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<Result<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    
    if (errorHandler) {
      errorHandler(err);
    }
    
    return { success: false, error: err };
  }
};

// Usage
const result = await handleAsyncOperation(
  () => saveGameService.saveGame(gameState),
  (error) => console.error('Save failed:', error)
);

if (result.success) {
  setSaveStatus('success');
} else {
  setSaveError(result.error.message);
}
```

## Data Validation Patterns

### Input Validation
```typescript
// Zod-style validation functions
const validateGameInput = {
  specialRequirements: (input: string): boolean => {
    return input.length <= 200 && input.trim().length > 0;
  },
  
  childName: (name: string): boolean => {
    return /^[a-zA-Z\s]{2,20}$/.test(name);
  },
  
  gameState: (state: unknown): state is GameState => {
    return (
      typeof state === 'object' &&
      state !== null &&
      'phase' in state &&
      'currentAge' in state &&
      typeof (state as any).currentAge === 'number' &&
      (state as any).currentAge >= 0 &&
      (state as any).currentAge <= 18
    );
  }
};

// Usage in components
const handleRequirementsChange = (value: string) => {
  if (validateGameInput.specialRequirements(value)) {
    setRequirements(value);
    setError(null);
  } else {
    setError('Requirements must be 1-200 characters');
  }
};
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    data: mockGameData,
    onAction: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<ComponentName {...defaultProps} />);
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<ComponentName {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Action Button' }));
    
    expect(defaultProps.onAction).toHaveBeenCalledWith({
      type: 'action',
      payload: expect.any(Object)
    });
  });

  it('handles error states gracefully', () => {
    const errorProps = { ...defaultProps, data: null };
    
    render(<ComponentName {...errorProps} />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
```

### Service Testing
```typescript
import { CharacterDevelopmentService } from './characterDevelopmentService';
import { mockChildCharacter, mockScenarioOption } from '../test-utils/mocks';

describe('CharacterDevelopmentService', () => {
  it('applies decision effects correctly', () => {
    const character = mockChildCharacter();
    const decision = mockScenarioOption({
      effects: {
        traits: { confidence: 5 },
        skills: { reading: 2 }
      }
    });

    const result = CharacterDevelopmentService.applyDecisionEffects(
      character, 
      decision, 
      character.age + 1
    );

    expect(result.age).toBe(character.age + 1);
    expect(result.developmentHistory).toHaveLength(
      character.developmentHistory.length + 1
    );
    // Assert trait changes...
  });
});
```

## Accessibility Patterns

### ARIA Standards
```typescript
// Standard ARIA patterns for interactive elements
<button
  type="button"
  role="button"
  aria-label={t('save_game')}
  aria-describedby="save-help-text"
  aria-pressed={isSaving}
  disabled={isSaving}
  className={styles.buttonPrimary}
  onClick={handleSave}
>
  {isSaving ? <Spinner /> : t('save')}
</button>

<div id="save-help-text" className="sr-only">
  {t('save_game_help')}
</div>
```

### Keyboard Navigation
```typescript
// Handle keyboard events for accessibility
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleAction();
      break;
    case 'Escape':
      handleCancel();
      break;
    default:
      break;
  }
}, [handleAction, handleCancel]);

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleAction}
  className="interactive-element"
>
  Content
</div>
```

## Performance Monitoring Patterns

### Performance Measurement
```typescript
// Component performance monitoring
const ComponentWithPerf: React.FC<Props> = (props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`Component render time: ${endTime - startTime}ms`);
      };
    }
  });

  // Component implementation...
};

// Custom hook for operation timing
const useOperationTiming = (operationName: string) => {
  return useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} took ${endTime - startTime}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`${operationName} failed after ${endTime - startTime}ms:`, error);
      throw error;
    }
  }, [operationName]);
};
```

---

*These patterns should be followed by all agents for consistency. Update this file when establishing new patterns or refining existing ones.*