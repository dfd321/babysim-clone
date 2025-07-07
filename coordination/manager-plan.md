# BabySim Multi-Agent Manager Plan

*Manager Agent Coordination Document - Master Prompt v0.6 Implementation*

## Agent Roster & TMUX Configuration

### Session Details
- **Session Name**: `babysim-agents`
- **Working Directory**: `/home/dfdan/projects/babysim-clone/`
- **Layout**: Horizontal panes (4 total)
- **Supervision Cycle**: Every 120 seconds

### Agent Assignments

#### Pane 0 - Manager Agent (Current Session)
- **Branch**: `main`
- **Role**: Coordination, architecture decisions, merge conflicts, supervision
- **Responsibilities**:
  - Task distribution and priority management
  - Agent supervision via 120s cycles
  - Merge conflict resolution
  - Risk assessment and mitigation
  - Documentation oversight

#### Pane 1 - Frontend-Performance Agent
- **Branch**: `wt/frontend-perf-agent`
- **Worktree**: `../babysim-frontend-perf/`
- **Primary Focus**: UI optimization, performance, accessibility
- **Key Tasks**:
  - Component decomposition (BabySimulator.tsx 775 lines → modular components)
  - GameplayPhase.tsx breakdown (1,148 lines → scenario-specific components)
  - React.memo implementation for Timeline and character cards
  - Virtual scrolling for large family/timeline displays
  - Bundle size optimization and code splitting
  - WCAG 2.1 AA accessibility compliance audit

#### Pane 2 - Game-Mechanics Agent  
- **Branch**: `wt/game-mechanics-agent`
- **Worktree**: `../babysim-game-mechanics/`
- **Primary Focus**: Game logic enhancement, content generation
- **Key Tasks**:
  - Algorithmic scenario generation system (no API costs)
  - Psychology-based decision consequence modeling
  - Enhanced character development algorithms
  - Sibling relationship and family dynamics modeling
  - Age-appropriate content validation
  - Multiple storyline branching implementation

#### Pane 3 - Architecture Agent
- **Branch**: `wt/architecture-agent`  
- **Worktree**: `../babysim-architecture/`
- **Primary Focus**: Code structure, testing, service layer
- **Key Tasks**:
  - Comprehensive unit test suite for all services
  - Integration testing framework expansion
  - Service layer refactoring with dependency injection
  - Zustand migration planning and implementation
  - Error handling standardization
  - State management optimization

## Supervision Loop Specification

### Automated Monitoring (`scripts/manager-loop.sh`)

#### Every 120 Seconds:
1. **Capture Pane Outputs**
   ```bash
   tmux capture-pane -t babysim-agents.0 -p > coordination/logs/manager_pane.txt
   tmux capture-pane -t babysim-agents.1 -p > coordination/logs/frontend_pane.txt
   tmux capture-pane -t babysim-agents.2 -p > coordination/logs/game_mechanics_pane.txt
   tmux capture-pane -t babysim-agents.3 -p > coordination/logs/architecture_pane.txt
   ```

2. **Deep-Think Analysis**
   - Assess each agent's current progress
   - Identify blockers or integration risks
   - Determine next priority actions
   - Check for merge conflict potential

3. **Send Context-Aware Instructions**
   ```bash
   tmux send-keys -t babysim-agents.1 "[frontend instruction]"
   tmux send-keys -t babysim-agents.1 Enter
   tmux send-keys -t babysim-agents.2 "[game mechanics instruction]"  
   tmux send-keys -t babysim-agents.2 Enter
   tmux send-keys -t babysim-agents.3 "[architecture instruction]"
   tmux send-keys -t babysim-agents.3 Enter
   ```

4. **Update Coordination Files**
   - `coordination/agent_status.md`
   - `coordination/active_tasks.md`
   - `memory/patterns.md` (as needed)

### Supervision Triggers

#### Immediate Intervention Required:
- Agent reports error or blocker
- Merge conflict detected
- Performance regression identified
- Test failures in any worktree

#### Priority Reassignment Triggers:
- Agent completes assigned task early
- Cross-agent dependency discovered
- Integration requirement emerges

## Git Workflow & Branch Management

### Worktree Setup Commands
```bash
# Create agent worktrees
git worktree add ../babysim-frontend-perf wt/frontend-perf-agent
git worktree add ../babysim-game-mechanics wt/game-mechanics-agent  
git worktree add ../babysim-architecture wt/architecture-agent

# Verify worktree creation
git worktree list
```

### Merge Protocol
1. **Quality Gates**: All tests pass, lint clean, TypeScript compiles
2. **Performance Validation**: Benchmarks maintained or improved
3. **Documentation Updates**: CLAUDE.md, patterns.md updated
4. **Manager Review**: Final approval before merge to main

### Auto-Merge Criteria
- All automated tests pass
- No merge conflicts
- Performance benchmarks met
- Agent marks task as DONE

## Agent Communication Protocol

### Status Reporting
- **File**: `coordination/agent_status.md`
- **Frequency**: Every task completion, every 30 minutes minimum
- **Format**: Agent name, current task, progress %, blockers, ETA

### Knowledge Sharing
- **File**: `memory/patterns.md`
- **Purpose**: Document discovered patterns, solutions, best practices
- **Trigger**: Any significant discovery or problem resolution

### Task Coordination
- **File**: `coordination/active_tasks.md`
- **Management**: Manager agent updates task assignments
- **Dependencies**: Cross-agent dependencies tracked and managed

## Success Metrics & Completion Criteria

### Performance Targets (Must Maintain)
- Bundle size: <500KB
- Initial load: <3s
- Time to interactive: <2s
- Memory usage: <100MB

### Quality Gates
- Test coverage: Minimum 80% for new code
- TypeScript: No any types, strict mode
- Accessibility: WCAG 2.1 AA compliance
- Lint: Zero ESLint errors

### Completion Requirements
Each agent must:
1. Complete all assigned Priority 1 tasks
2. Execute `scripts/auto-merge.sh` successfully
3. Open PR and achieve conflict-free auto-merge
4. Update `memory/recap.md` with summary
5. Update `memory/<module>/recap.md` for their domain

## Risk Mitigation Strategies

### Technical Risks
- **Large component conflicts**: Coordinate component boundaries early
- **State management changes**: Implement interface contracts
- **Performance regressions**: Continuous benchmarking during development

### Coordination Risks  
- **Agent communication**: Structured file-based communication protocol
- **Task dependencies**: Explicit dependency tracking in active_tasks.md
- **Timing conflicts**: 120s supervision ensures regular sync

### Recovery Procedures
- **Agent unresponsive**: Kill and respawn pane, restore from last known state
- **Merge conflicts**: Manager agent intervention with conflict resolution
- **Performance degradation**: Rollback to last stable state, investigate

## Development Timeline

### Day 1: Setup & Initialization
- Agent spawning and worktree creation
- Initial task assignment and scoped prompt delivery
- Supervision loop activation
- Agent environment verification

### Days 2-4: Parallel Development Sprint
- Component decomposition (Frontend)
- Scenario enhancement (Game-Mechanics)  
- Testing infrastructure (Architecture)
- Daily integration checkpoints

### Day 5: Integration & Testing
- Cross-agent merge coordination
- Performance validation
- Integration testing
- Documentation consolidation

### Day 6: Completion & Handoff
- Auto-merge execution
- Final validation
- Recap documentation
- Project handoff

---

*This manager plan serves as the definitive coordination document for the BabySim multi-agent development workflow. All agents should reference this document for context and coordination protocols.*