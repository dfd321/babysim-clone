#!/bin/bash

# BabySim Multi-Agent Spawning Script
# Creates and manages multiple Claude Code agents for parallel development

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COORDINATION_DIR="$PROJECT_ROOT/coordination"
MEMORY_DIR="$PROJECT_ROOT/memory"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Agent configuration
declare -A AGENTS=(
    ["frontend"]="feature/frontend-optimization"
    ["backend"]="feature/backend-api"
    ["ai-ml"]="feature/ai-enhancement"
    ["ux-style"]="feature/ux-improvements"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if git is available
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed or not in PATH"
        exit 1
    fi
    
    # Check if tmux is available
    if ! command -v tmux &> /dev/null; then
        log_error "tmux is not installed. Please install tmux for session management."
        exit 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check if coordination directory exists
    if [ ! -d "$COORDINATION_DIR" ]; then
        log_error "Coordination directory not found: $COORDINATION_DIR"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Initialize git worktrees for agents
setup_worktrees() {
    log_info "Setting up git worktrees for agents..."
    
    # Get current branch
    MAIN_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log_info "Main branch: $MAIN_BRANCH"
    
    # Create worktrees for each agent
    for agent in "${!AGENTS[@]}"; do
        local branch="${AGENTS[$agent]}"
        local worktree_path="../babysim-$agent"
        
        log_info "Setting up worktree for $agent agent..."
        
        # Check if branch exists
        if git show-ref --verify --quiet refs/heads/$branch; then
            log_warning "Branch $branch already exists"
        else
            # Create new branch from main
            git branch "$branch" "$MAIN_BRANCH"
            log_success "Created branch: $branch"
        fi
        
        # Check if worktree directory exists
        if [ -d "$worktree_path" ]; then
            log_warning "Worktree directory already exists: $worktree_path"
        else
            # Create worktree
            git worktree add "$worktree_path" "$branch"
            log_success "Created worktree: $worktree_path"
        fi
        
        # Set up agent-specific configuration in worktree
        setup_agent_environment "$agent" "$worktree_path"
    done
}

# Set up agent-specific environment
setup_agent_environment() {
    local agent=$1
    local worktree_path=$2
    
    log_info "Setting up environment for $agent agent..."
    
    # Create agent-specific coordination file
    cat > "$worktree_path/AGENT_CONFIG.md" << EOF
# $agent Agent Configuration

## Agent Role
$(get_agent_description "$agent")

## Assigned Tasks
- See coordination/active_tasks.md for current assignments
- Focus on $agent-specific features and improvements

## Working Directory
\`$worktree_path\`

## Branch
\`${AGENTS[$agent]}\`

## Coordination Protocol
1. Update coordination/agent_status.md every 30 minutes
2. Check coordination/active_tasks.md for new assignments
3. Document patterns in memory/patterns.md
4. Update memory/CLAUDE.md with discoveries

## Communication
- Status updates: coordination/agent_status.md
- Task completion: coordination/active_tasks.md
- Code patterns: memory/patterns.md
- Architecture decisions: coordination/decisions.md

## Merge Protocol
1. Ensure all tests pass
2. Update documentation
3. Create PR for manager review
4. Wait for approval before merge

## Emergency Contact
Manager agent available in main project directory
EOF

    # Create agent-specific npm scripts (if package.json exists)
    if [ -f "$worktree_path/package.json" ]; then
        setup_agent_npm_scripts "$worktree_path" "$agent"
    fi
    
    log_success "Environment setup complete for $agent agent"
}

# Get agent description based on role
get_agent_description() {
    case $1 in
        "frontend")
            echo "React optimization, UI/UX improvements, accessibility, client-side performance"
            ;;
        "backend")
            echo "API development, database design, WebSocket implementation, server infrastructure"
            ;;
        "ai-ml")
            echo "Scenario generation, character AI, content moderation, machine learning integration"
            ;;
        "ux-style")
            echo "Design system, component styling, responsive design, user experience research"
            ;;
        *)
            echo "General development and support"
            ;;
    esac
}

# Set up agent-specific npm scripts
setup_agent_npm_scripts() {
    local worktree_path=$1
    local agent=$2
    
    # Add agent-specific scripts to package.json
    cat > "$worktree_path/agent-scripts.json" << EOF
{
  "scripts": {
    "agent:status": "echo 'Agent: $agent' && git status",
    "agent:sync": "git fetch origin && git rebase origin/main",
    "agent:test": "npm run test && npm run lint && npm run type-check",
    "agent:report": "node scripts/agent-report.js"
  }
}
EOF
}

# Create tmux session for agent management
setup_tmux_sessions() {
    log_info "Setting up tmux sessions..."
    
    # Kill existing session if it exists
    tmux kill-session -t babysim-agents 2>/dev/null || true
    
    # Create new session
    tmux new-session -d -s babysim-agents -n manager
    
    # Set up manager window
    tmux send-keys -t babysim-agents:manager "cd $PROJECT_ROOT" C-m
    tmux send-keys -t babysim-agents:manager "echo 'Manager Agent Session - BabySim Project'" C-m
    
    # Create windows for each agent
    for agent in "${!AGENTS[@]}"; do
        local worktree_path="../babysim-$agent"
        
        tmux new-window -t babysim-agents -n "$agent"
        tmux send-keys -t "babysim-agents:$agent" "cd $worktree_path" C-m
        tmux send-keys -t "babysim-agents:$agent" "echo '$agent Agent Session - Ready for development'" C-m
        tmux send-keys -t "babysim-agents:$agent" "git status" C-m
    done
    
    # Select manager window
    tmux select-window -t babysim-agents:manager
    
    log_success "tmux sessions created. Use 'tmux attach -t babysim-agents' to connect"
}

# Update coordination files
update_coordination_files() {
    log_info "Updating coordination files..."
    
    # Update agent status
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    
    cat > "$COORDINATION_DIR/agent_spawn_log.md" << EOF
# Agent Spawn Log

*Last spawn: $timestamp*

## Spawned Agents
$(for agent in "${!AGENTS[@]}"; do
    echo "- **$agent Agent**: ${AGENTS[$agent]} ($(get_agent_description "$agent"))"
done)

## Worktree Structure
\`\`\`
babysim-clone/           # Main project (Manager Agent)
├── babysim-frontend/    # Frontend Agent worktree
├── babysim-backend/     # Backend Agent worktree
├── babysim-ai-ml/       # AI/ML Agent worktree
└── babysim-ux-style/    # UX Style Agent worktree
\`\`\`

## tmux Sessions
- Session name: \`babysim-agents\`
- Manager window: \`manager\`
- Agent windows: $(printf '%s, ' "${!AGENTS[@]}" | sed 's/, $//')

## Next Steps
1. Attach to tmux session: \`tmux attach -t babysim-agents\`
2. Assign tasks in coordination/active_tasks.md
3. Start supervision loop: \`scripts/supervision_loop.sh\`

## Agent Communication
All agents should check coordination/ files every 30 minutes and update their status.
EOF

    # Update active tasks with agent assignments
    update_active_tasks_with_agents
    
    log_success "Coordination files updated"
}

# Update active tasks with agent assignments
update_active_tasks_with_agents() {
    # This would normally read and update the existing active_tasks.md
    # For now, we'll add agent availability note
    
    echo "" >> "$COORDINATION_DIR/active_tasks.md"
    echo "## Agent Availability (Updated $(date))" >> "$COORDINATION_DIR/active_tasks.md"
    echo "- Frontend Agent: Available (../babysim-frontend)" >> "$COORDINATION_DIR/active_tasks.md"
    echo "- Backend Agent: Available (../babysim-backend)" >> "$COORDINATION_DIR/active_tasks.md"
    echo "- AI/ML Agent: Available (../babysim-ai-ml)" >> "$COORDINATION_DIR/active_tasks.md"
    echo "- UX Style Agent: Available (../babysim-ux-style)" >> "$COORDINATION_DIR/active_tasks.md"
    echo "" >> "$COORDINATION_DIR/active_tasks.md"
}

# Main execution
main() {
    echo "=================================================="
    echo "🤖 BabySim Multi-Agent Spawning System"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    echo ""
    
    setup_worktrees
    echo ""
    
    setup_tmux_sessions
    echo ""
    
    update_coordination_files
    echo ""
    
    log_success "🚀 All agents spawned successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Attach to tmux session: tmux attach -t babysim-agents"
    echo "2. Start supervision loop: $SCRIPTS_DIR/supervision_loop.sh"
    echo "3. Assign tasks in coordination/active_tasks.md"
    echo ""
    echo "Agent worktrees created:"
    for agent in "${!AGENTS[@]}"; do
        echo "  - $agent: ../babysim-$agent (${AGENTS[$agent]})"
    done
}

# Handle script arguments
case "${1:-}" in
    "cleanup")
        log_info "Cleaning up agent worktrees and sessions..."
        tmux kill-session -t babysim-agents 2>/dev/null || true
        for agent in "${!AGENTS[@]}"; do
            if [ -d "../babysim-$agent" ]; then
                git worktree remove "../babysim-$agent" --force
                log_success "Removed worktree: ../babysim-$agent"
            fi
        done
        log_success "Cleanup complete"
        ;;
    "status")
        log_info "Agent Status:"
        for agent in "${!AGENTS[@]}"; do
            if [ -d "../babysim-$agent" ]; then
                echo "  ✅ $agent: Active (../babysim-$agent)"
            else
                echo "  ❌ $agent: Not spawned"
            fi
        done
        if tmux has-session -t babysim-agents 2>/dev/null; then
            echo "  ✅ tmux session: Active"
        else
            echo "  ❌ tmux session: Not active"
        fi
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Spawn all agents and set up environment"
        echo "  cleanup    Remove all agent worktrees and tmux sessions"
        echo "  status     Show current agent status"
        echo "  help       Show this help message"
        ;;
    "")
        main
        ;;
    *)
        log_error "Unknown command: $1"
        log_info "Use '$0 help' for usage information"
        exit 1
        ;;
esac