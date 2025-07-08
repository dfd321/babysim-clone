# CLAUDE.md - Persistent AI Agent Memory

*AI Agent Knowledge Base for BabySim Project*  
*Last Updated: 2025-07-08

## Project Context Summary

### What is BabySim?
BabySim is a comprehensive parenting simulator that guides users through raising a child from birth to age 18. Players make critical decisions that shape personality development, family dynamics, and life outcomes. The project features multiple game styles (Realistic, Fantasy, Thrilling), advanced character development systems, and AI-generated content.

### Current Development State
- **Phase**: Foundation Complete → Multi-Agent Framework Implementation
- **Architecture**: React 18 + TypeScript, service-based, component architecture
- **Features**: Complete single-child gameplay, multiple children support, achievements, save/load
- **Status**: Production-ready core game, implementing multi-agent development workflow

## Critical Technical Knowledge

### Architecture Decisions
1. **Component Hierarchy**: BabySimulator (root) → OnboardingPhase/GameplayPhase → specialized components
2. **State Management**: Context API for translations, useState for game state, considering Zustand for complex state
3. **Service Layer**: Dedicated services for character development, family management, achievements, analytics
4. **Data Persistence**: Local storage with save/load system, export/import capabilities

### Key Files & Locations
```
/src/components/BabySimulator.tsx     - Main orchestrator, game state management
/src/types/game.ts                    - Complete TypeScript definitions
/src/services/                        - Business logic layer
  ├── characterDevelopmentService.ts  - Individual child development
  ├── familyManagementService.ts      - Multiple children coordination
  ├── achievementService.ts           - Badge and achievement system
  └── saveGameService.ts              - Persistence layer

/coordination/                        - Multi-agent coordination
/memory/                             - This file + shared knowledge
/scripts/                            - Automation scripts (to be created)
```

### Code Patterns to Follow

#### State Update Pattern
```typescript
// Always use functional state updates for complex objects
setGameState(prev => ({
  ...prev,
  [property]: newValue,
  // For nested updates:
  nestedObject: {
    ...prev.nestedObject,
    [nestedProperty]: newNestedValue
  }
}));
```

#### Service Integration Pattern
```typescript
// Services should be stateless and pure when possible
export const SomeService = {
  // Always return new objects, never mutate inputs
  processData: (input: DataType): ProcessedData => {
    return {
      ...input,
      processed: true,
      timestamp: Date.now()
    };
  }
};
```

#### Component Structure Pattern
```typescript
// Standard component structure for consistency
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks and state
  const [localState, setLocalState] = useState(initialValue);
  const { t } = useTranslation();
  
  // 2. Event handlers
  const handleEvent = (data: EventData) => {
    // Handler logic
  };
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 4. Early returns
  if (conditionalRender) {
    return <AlternativeComponent />;
  }
  
  // 5. Main render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};
```

## Multi-Agent Coordination Knowledge

### Agent Responsibilities
- **Manager Agent**: Task coordination, architecture decisions, merge conflict resolution
- **Frontend Agent**: React optimization, UI/UX, accessibility, performance
- **Backend Agent**: API design, database planning, WebSocket infrastructure
- **AI/ML Agent**: Content generation, scenario algorithms, character modeling

### Git Workflow for Agents
```bash
# Standard workflow for feature development
git worktree add ../babysim-[agent-name] [branch-name]
cd ../babysim-[agent-name]
# ... make changes ...
git add . && git commit -m "descriptive message"
git push origin [branch-name]
# Create PR, get review, merge
```

### Communication Protocol
1. **Coordination Files**: Update coordination/*.md files for status
2. **Memory Updates**: Document patterns and decisions in memory/*.md
3. **Code Reviews**: All agents review each other's work
4. **Daily Sync**: Check coordination/agent_status.md for updates

## Domain-Specific Knowledge

### Child Development Psychology (for AI content)
- **Ages 0-2**: Attachment formation, basic trust, sensory development
- **Ages 3-5**: Independence, emotional regulation, social skills
- **Ages 6-8**: Academic foundation, peer relationships, self-concept
- **Ages 9-12**: Identity formation, moral reasoning, autonomy
- **Ages 13-15**: Peer influence, risk-taking, abstract thinking
- **Ages 16-18**: Identity consolidation, future planning, relationships

### Game Mechanics Knowledge
- **Decision Impact System**: Choices affect happiness (-100 to +100), finances (-100k to +100k), character traits
- **Timeline System**: Visual progression showing age, scenario, choice, consequence, effects
- **Character Development**: Traits, skills, relationships evolve based on decisions
- **Family Dynamics**: Multiple children create sibling relationships, resource competition

### Technical Performance Knowledge
- **Critical Metrics**: <2s load time, <500KB bundle, 60fps animations
- **Memory Management**: Careful with timeline entries (can exceed 1000+ items)
- **State Optimization**: Large families (10+ children) require performance consideration
- **Mobile Performance**: 2GB RAM minimum, touch-friendly interface required

## Common Patterns & Solutions

### Timeline Performance Optimization
```typescript
// Use React.memo for timeline entries to prevent unnecessary re-renders
const TimelineEntry = React.memo<TimelineEntryProps>(({ entry }) => {
  return (
    <div className="timeline-entry">
      {/* Entry content */}
    </div>
  );
});

// Virtual scrolling for large timelines
const VirtualizedTimeline = () => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  // Implementation details...
};
```

### Character Development Effects
```typescript
// Pattern for applying decision effects to character development
const applyDecisionEffects = (character: ChildCharacter, decision: Decision): ChildCharacter => {
  return {
    ...character,
    personalityTraits: character.personalityTraits.map(trait => ({
      ...trait,
      value: Math.max(0, Math.min(100, trait.value + (decision.effects.traits?.[trait.id] || 0)))
    })),
    skills: character.skills.map(skill => ({
      ...skill,
      level: Math.max(1, Math.min(10, skill.level + (decision.effects.skills?.[skill.id] || 0)))
    }))
  };
};
```

### Save System Best Practices
```typescript
// Always validate save data before loading
const validateSaveData = (data: any): data is GameState => {
  return (
    data &&
    typeof data.phase === 'string' &&
    ['setup', 'character-gen', 'gameplay', 'ended'].includes(data.phase) &&
    // Additional validations...
  );
};
```

## Known Issues & Solutions

### Issue: Timeline Green Circle Positioning
**Problem**: Timeline dots were being clipped by container boundaries  
**Solution**: Added paddingLeft: 1.5rem to container, paddingLeft: 2rem to items, left: 0.25rem for absolute positioning

### Issue: Form Re-render Performance
**Problem**: RequirementsInput component caused entire form re-render on every keystroke  
**Solution**: Implemented local state pattern with useEffect sync to parent state

### Issue: Memory Usage with Large Families
**Problem**: Performance degrades with 10+ children  
**Solution**: Implement virtual scrolling, React.memo for child components, selective state updates

## Development Guidelines for Agents

### Code Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types in new code
- **Testing**: Write tests for all new components and services
- **Accessibility**: All interactive elements must be keyboard accessible
- **Performance**: Profile changes with Chrome DevTools before committing

### Commit Message Standards
```
feat: add multiplayer WebSocket support
fix: resolve timeline scroll performance issue
docs: update API documentation for character service
refactor: optimize family state management
test: add unit tests for achievement system
```

### Review Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] No accessibility regressions
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Breaking changes noted

## Future Considerations

### Planned Technical Debt
- Migration from Context API to Zustand for complex state
- Implementation of proper error boundaries throughout app
- Addition of comprehensive test suite (currently minimal)
- Performance optimization for mobile devices

### Scaling Considerations
- Database migration planning (currently local storage only)
- CDN implementation for faster loading
- WebSocket infrastructure for real-time features
- API rate limiting and caching strategies

## Troubleshooting Guide

### Common Build Issues
```bash
# TypeScript errors
npm run type-check

# Dependency issues
rm -rf node_modules package-lock.json
npm install

# Bundle size issues
npm run build
npm run analyze
```

### Development Server Issues
```bash
# Port conflicts
npm run dev -- --port 3001

# Cache issues
rm -rf .vite
npm run dev
```

### State Management Debugging
```typescript
// Add to BabySimulator.tsx for debugging
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Game State Changed:', gameState);
  }
}, [gameState]);
```

---

*This memory file should be updated by all agents when they discover new patterns, solve issues, or make architectural decisions. It serves as the persistent knowledge base for the project.*