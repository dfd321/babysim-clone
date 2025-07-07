# BabySim Multi-Agent Development Setup

*Complete guide for transitioning from single-agent to multi-agent development*

## Quick Start

### 1. Spawn Agents
```bash
# Initialize all agent worktrees and tmux sessions
./scripts/spawn_agents.sh

# Check agent status
./scripts/spawn_agents.sh status
```

### 2. Start Supervision
```bash
# Start automated supervision loop
./scripts/supervision_loop.sh

# Check supervision status
./scripts/supervision_loop.sh status

# Follow supervision logs
./scripts/supervision_loop.sh logs
```

### 3. Manage Development
```bash
# Check merge status
./scripts/merge_branches.sh status

# Merge all ready branches
./scripts/merge_branches.sh merge-all

# Attach to agent sessions
tmux attach -t babysim-agents
```

## Multi-Agent Architecture Overview

### Agent Roles & Responsibilities

#### Manager Agent (Main Directory)
- **Location**: `/home/dfdan/projects/babysim-clone/`
- **Branch**: `main`
- **Responsibilities**:
  - Task coordination and assignment
  - Architecture decisions
  - Merge conflict resolution
  - Agent supervision
  - Documentation oversight

#### Frontend Agent
- **Location**: `../babysim-frontend/`
- **Branch**: `feature/frontend-optimization`
- **Responsibilities**:
  - React component optimization
  - UI/UX improvements
  - Accessibility enhancements
  - Client-side performance
  - Animation and interactions

#### Backend Agent
- **Location**: `../babysim-backend/`
- **Branch**: `feature/backend-api`
- **Responsibilities**:
  - API service development
  - Database design and optimization
  - WebSocket implementation
  - Server infrastructure
  - Authentication systems

#### AI/ML Agent
- **Location**: `../babysim-ai-ml/`
- **Branch**: `feature/ai-enhancement`
- **Responsibilities**:
  - Scenario generation algorithms
  - Character AI improvements
  - Content moderation systems
  - Machine learning integration
  - Natural language processing

#### UX Style-Guide Agent
- **Location**: `../babysim-ux-style/`
- **Branch**: `feature/ux-improvements`
- **Responsibilities**:
  - Design system maintenance
  - Component styling patterns
  - Responsive design implementation
  - User experience research
  - Brand consistency

## Directory Structure

```
babysim-clone/                    # Manager Agent (Main)
├── coordination/                 # Agent coordination files
│   ├── active_tasks.md          # Task assignments
│   ├── agent_status.md          # Agent health monitoring
│   ├── architecture.md          # System architecture docs
│   └── decisions.md             # Technical decisions log
├── memory/                       # Shared knowledge base
│   ├── CLAUDE.md                # AI agent memory
│   ├── patterns.md              # Code patterns & standards
│   └── domain_knowledge.md      # Domain expertise
├── scripts/                      # Automation scripts
│   ├── spawn_agents.sh          # Agent creation
│   ├── supervision_loop.sh      # Agent monitoring
│   └── merge_branches.sh        # Branch management
├── docs/project-management/      # Project planning
│   ├── VISION.md                # Project vision & goals
│   ├── METRICS.md               # Success metrics & KPIs
│   └── CONSTRAINTS.md           # Technical & business limits
└── src/                         # Source code (existing)

../babysim-frontend/             # Frontend Agent Worktree
../babysim-backend/              # Backend Agent Worktree
../babysim-ai-ml/                # AI/ML Agent Worktree
../babysim-ux-style/             # UX Style Agent Worktree
```

## Agent Coordination Protocol

### Daily Workflow
1. **Morning Check-in**: All agents check `coordination/active_tasks.md`
2. **Status Updates**: Update `coordination/agent_status.md` every 30 minutes
3. **Knowledge Sharing**: Document discoveries in `memory/` files
4. **Evening Sync**: Merge ready branches via `scripts/merge_branches.sh`

### Communication Channels
- **Task Assignment**: `coordination/active_tasks.md`
- **Status Reporting**: `coordination/agent_status.md`
- **Architecture Decisions**: `coordination/decisions.md`
- **Code Patterns**: `memory/patterns.md`
- **Persistent Knowledge**: `memory/CLAUDE.md`

### Merge Protocol
1. **Quality Gates**: All tests pass, linting clean, TypeScript compiles
2. **Documentation**: Update relevant docs and patterns
3. **Review Process**: Manager agent reviews all merges
4. **Conflict Resolution**: Automated handling with manual fallback

## Development Guidelines

### Code Quality Standards
- **TypeScript**: Strict mode, no `any` types
- **Testing**: 80% coverage minimum for new code
- **Linting**: ESLint rules enforced
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Bundle size <500KB, load time <2s

### Commit Message Format
```
type(agent): brief description

Longer description if needed

Agent: agent-name
Related-Tasks: coordination/active_tasks.md#123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Branch Naming Convention
- `feature/agent-specific-feature`
- `fix/agent-specific-bugfix`
- `docs/agent-documentation-update`

## Troubleshooting

### Agent Spawn Issues
```bash
# Clean up existing agents
./scripts/spawn_agents.sh cleanup

# Check git worktree status
git worktree list

# Force respawn
./scripts/spawn_agents.sh
```

### Merge Conflicts
```bash
# Check conflict status
./scripts/merge_branches.sh status

# Handle conflicts interactively
HANDLE_CONFLICTS=true ./scripts/merge_branches.sh merge-all

# Manual resolution
git checkout main
git merge feature/branch-name
# Resolve conflicts manually
git commit
```

### Supervision Issues
```bash
# Check supervision status
./scripts/supervision_loop.sh status

# Stop supervision
./scripts/supervision_loop.sh stop

# Restart supervision
./scripts/supervision_loop.sh
```

### tmux Session Management
```bash
# List all sessions
tmux list-sessions

# Attach to agent session
tmux attach -t babysim-agents

# Kill session
tmux kill-session -t babysim-agents

# Navigate between windows
# Ctrl+b then 0-9 for window numbers
# Ctrl+b then 'n' for next window
# Ctrl+b then 'p' for previous window
```

## Performance Monitoring

### Metrics Collection
- **System Health**: CPU, memory, disk usage
- **Development Velocity**: Commits per day, merge frequency
- **Code Quality**: Test coverage, lint score, TypeScript errors
- **Agent Productivity**: Tasks completed, communication frequency

### Logs & Reports
```bash
# View supervision logs
tail -f logs/supervision.log

# Generate performance report
./scripts/supervision_loop.sh report

# View agent health history
cat logs/agent_health.log
```

## Migration from Single-Agent

### What Changed
1. **Directory Structure**: Added coordination/, memory/, scripts/
2. **Git Workflow**: Introduced worktrees for parallel development
3. **Documentation**: Structured project management docs
4. **Automation**: Agent spawning and supervision scripts
5. **Communication**: Formal coordination protocols

### What Stayed the Same
1. **Source Code**: All existing React/TypeScript code unchanged
2. **Build Process**: npm scripts and Vite configuration intact
3. **Testing**: Playwright and existing test setup preserved
4. **Dependencies**: No new runtime dependencies added

### Migration Steps
1. ✅ **Framework Setup**: Multi-agent structure created
2. 🔄 **Agent Spawning**: Use `./scripts/spawn_agents.sh`
3. 📋 **Task Assignment**: Populate `coordination/active_tasks.md`
4. 🚀 **Development**: Start parallel agent development
5. 🔄 **Continuous Integration**: Regular merging and supervision

## Integration with Original Workflow

### Existing npm Scripts (Still Work)
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Playwright tests
npm run lint         # ESLint
npm run type-check   # TypeScript validation
```

### New Multi-Agent Commands
```bash
# Agent management
./scripts/spawn_agents.sh
./scripts/supervision_loop.sh
./scripts/merge_branches.sh

# Session management
tmux attach -t babysim-agents
```

### Hybrid Development
- **Single Developer**: Can work in main directory as before
- **Multi-Agent**: Use agent worktrees for parallel development
- **Team Development**: Each team member can be assigned agent role
- **AI Collaboration**: AI agents work in dedicated worktrees

## Next Steps

1. **Spawn Agents**: Run `./scripts/spawn_agents.sh`
2. **Assign Tasks**: Populate `coordination/active_tasks.md` with specific work items
3. **Start Supervision**: Run `./scripts/supervision_loop.sh` in background
4. **Begin Development**: Each agent works in their assigned worktree
5. **Monitor Progress**: Use tmux and coordination files to track work

---

*This multi-agent framework is fully backward compatible with existing single-agent development. You can continue working in the main directory while gradually adopting multi-agent features.*