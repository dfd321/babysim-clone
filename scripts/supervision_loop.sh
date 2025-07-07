#!/bin/bash

# BabySim Agent Supervision Loop
# Monitors agent health, coordinates tasks, and manages the development process

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COORDINATION_DIR="$PROJECT_ROOT/coordination"
MEMORY_DIR="$PROJECT_ROOT/memory"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Supervision settings
SUPERVISION_INTERVAL=120  # 2 minutes
MAX_ITERATIONS=0          # 0 = infinite loop
LOG_FILE="$PROJECT_ROOT/logs/supervision.log"
PID_FILE="$PROJECT_ROOT/logs/supervision.pid"

# Agent configuration - Updated for current tmux session
declare -A AGENTS=(
    ["frontend-perf"]="Agent1:0.1"
    ["game-mechanics"]="Agent1:0.2"
    ["architecture"]="Agent1:0.3"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log_with_timestamp() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] ${level} $message" | tee -a "$LOG_FILE"
}

log_info() {
    log_with_timestamp "${BLUE}[INFO]${NC}" "$1"
}

log_success() {
    log_with_timestamp "${GREEN}[SUCCESS]${NC}" "$1"
}

log_warning() {
    log_with_timestamp "${YELLOW}[WARNING]${NC}" "$1"
}

log_error() {
    log_with_timestamp "${RED}[ERROR]${NC}" "$1"
}

log_supervision() {
    log_with_timestamp "${PURPLE}[SUPERVISION]${NC}" "$1"
}

# Initialize logging
init_logging() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting supervision loop" > "$LOG_FILE"
    echo $$ > "$PID_FILE"
}

# Cleanup function
cleanup() {
    log_info "Stopping supervision loop..."
    rm -f "$PID_FILE"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if supervision is already running
check_existing_supervision() {
    if [ -f "$PID_FILE" ]; then
        local existing_pid=$(cat "$PID_FILE")
        if kill -0 "$existing_pid" 2>/dev/null; then
            log_error "Supervision loop already running (PID: $existing_pid)"
            log_info "Use 'kill $existing_pid' to stop it, or run with --force to override"
            exit 1
        else
            log_warning "Stale PID file found, removing..."
            rm -f "$PID_FILE"
        fi
    fi
}

# Agent health check
check_agent_health() {
    local agent=$1
    local pane_target="${AGENTS[$agent]}"
    local status="unknown"
    local last_activity=""
    local agent_responsive="unknown"
    
    log_supervision "Checking health of $agent agent..."
    
    # Check if tmux pane exists
    if tmux list-panes -t "$pane_target" >/dev/null 2>&1; then
        # Capture recent pane output to check activity
        local pane_content=$(tmux capture-pane -t "$pane_target" -p | tail -10)
        
        # Check if Claude Code is running
        if echo "$pane_content" | grep -q "Claude Code\|Bypassing Permissions\|>"; then
            status="active"
            agent_responsive="yes"
        elif echo "$pane_content" | grep -q "Error\|Failed"; then
            status="error"
            agent_responsive="no"
        else
            status="idle"
            agent_responsive="unknown"
        fi
        
        # Get last activity timestamp (simplified)
        last_activity=$(echo "$pane_content" | tail -1 | cut -c1-50)
    else
        status="not_spawned"
        agent_responsive="no"
    fi
    
    # Update agent status file
    update_agent_status "$agent" "$status" "$last_activity" "$agent_responsive"
    
    log_supervision "$agent agent status: $status"
    
    # Capture pane output for analysis
    if [ "$status" = "active" ]; then
        local pane_log_file="$PROJECT_ROOT/logs/${agent}_pane.txt"
        tmux capture-pane -t "$pane_target" -p > "$pane_log_file"
    fi
}

# Update agent status in coordination file
update_agent_status() {
    local agent=$1
    local status=$2
    local last_commit=$3
    local uncommitted_changes=$4
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    
    # Create or update agent status file
    local status_file="$COORDINATION_DIR/agent_status.md"
    
    # Read current content and update specific agent section
    if [ -f "$status_file" ]; then
        # Update existing file (simplified approach - in real implementation would parse and update)
        sed -i "s/Last Update: .*/Last Update: $timestamp/" "$status_file" 2>/dev/null || true
    fi
    
    # Log status for monitoring
    echo "[$timestamp] Agent: $agent, Status: $status, Changes: $uncommitted_changes" >> "$PROJECT_ROOT/logs/agent_health.log"
}

# Task coordination check
check_task_assignments() {
    log_supervision "Checking task assignments..."
    
    local active_tasks_file="$COORDINATION_DIR/active_tasks.md"
    
    if [ ! -f "$active_tasks_file" ]; then
        log_warning "Active tasks file not found: $active_tasks_file"
        return
    fi
    
    # Check for unassigned tasks (simplified - would parse markdown in real implementation)
    local unassigned_count=$(grep -c "Agent: Not assigned" "$active_tasks_file" 2>/dev/null | head -1 || echo "0")
    
    if [ "$unassigned_count" -gt 0 ]; then
        log_warning "Found $unassigned_count unassigned tasks"
        
        # Could implement auto-assignment logic here
        suggest_task_assignments
    else
        log_info "All tasks are assigned"
    fi
}

# Suggest task assignments based on agent capabilities
suggest_task_assignments() {
    log_supervision "Analyzing task assignment opportunities..."
    
    # This would implement intelligent task assignment
    # For now, just log the need for manual assignment
    log_info "Manual task assignment recommended - check coordination/active_tasks.md"
}

# Memory consolidation
consolidate_memory() {
    log_supervision "Consolidating shared memory..."
    
    local claude_file="$MEMORY_DIR/CLAUDE.md"
    local patterns_file="$MEMORY_DIR/patterns.md"
    
    # Update last consolidated timestamp
    if [ -f "$claude_file" ]; then
        local timestamp=$(date -u +"%Y-%m-%d")
        sed -i "s/Last Updated: .*/Last Updated: $timestamp/" "$claude_file" 2>/dev/null || true
    fi
    
    # Check if memory files are growing too large
    check_memory_file_sizes
}

# Check memory file sizes and suggest cleanup
check_memory_file_sizes() {
    local max_size=1048576  # 1MB in bytes
    
    for file in "$MEMORY_DIR"/*.md; do
        if [ -f "$file" ]; then
            local size=$(stat -c%s "$file" 2>/dev/null || echo "0")
            if [ "$size" -gt "$max_size" ]; then
                log_warning "Memory file growing large: $(basename "$file") (${size} bytes)"
                log_info "Consider archiving or summarizing older content"
            fi
        fi
    done
}

# Performance metrics collection
collect_metrics() {
    log_supervision "Collecting performance metrics..."
    
    local metrics_file="$PROJECT_ROOT/logs/performance_metrics.log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # System metrics
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "0")
    local memory_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}' 2>/dev/null || echo "0")
    local disk_usage=$(df "$PROJECT_ROOT" | tail -1 | awk '{print $5}' | cut -d'%' -f1 2>/dev/null || echo "0")
    
    # Project metrics
    local total_files=$(find "$PROJECT_ROOT" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)
    local total_lines=$(find "$PROJECT_ROOT" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
    
    # Log metrics
    echo "[$timestamp] CPU: ${cpu_usage}%, Memory: ${memory_usage}%, Disk: ${disk_usage}%, Files: $total_files, Lines: $total_lines" >> "$metrics_file"
}

# Merge conflict detection
check_merge_conflicts() {
    log_supervision "Checking for merge conflicts..."
    
    local conflicts_found=false
    
    # Check for merge conflicts in main project
    if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
        log_warning "Merge conflicts detected in main branch"
        conflicts_found=true
    fi
    
    if [ "$conflicts_found" = false ]; then
        log_info "No merge conflicts detected"
    fi
}

# Auto-merge eligible branches
auto_merge_eligible_branches() {
    log_supervision "Checking for auto-merge eligible branches..."
    
    # Check if current branch has uncommitted changes that could be merged
    local uncommitted_files=$(git status --porcelain | wc -l)
    
    if [ "$uncommitted_files" -gt 0 ]; then
        log_info "Found $uncommitted_files modified files ready for potential commit"
        # In real implementation, would check quality gates
    else
        log_info "Working directory clean, no changes to merge"
    fi
}

# Check if branch is ready for merge
check_branch_ready_for_merge() {
    local agent=$1
    local worktree_path=$2
    
    # Simplified check - in real implementation would run tests, linting, etc.
    # For now, just check if there are no obvious issues
    
    # Check for TypeScript compilation errors
    if [ -f "$worktree_path/package.json" ]; then
        # Would run: npm run type-check
        return 0  # Assume success for now
    fi
    
    return 0
}

# Generate supervision report
generate_supervision_report() {
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    local report_file="$PROJECT_ROOT/logs/supervision_report_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# Supervision Report

*Generated: $timestamp*

## Agent Health Summary
$(for agent in "${!AGENTS[@]}"; do
    if [ -d "${AGENTS[$agent]}" ]; then
        echo "- **$agent**: Active ✅"
    else
        echo "- **$agent**: Not spawned ❌"
    fi
done)

## System Health
- CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "N/A")%
- Memory Usage: $(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}' 2>/dev/null || echo "N/A")%
- Disk Usage: $(df "$PROJECT_ROOT" | tail -1 | awk '{print $5}' 2>/dev/null || echo "N/A")

## Recent Activity
$(tail -20 "$LOG_FILE" 2>/dev/null || echo "No recent activity logged")

## Recommendations
- Check coordination/active_tasks.md for task assignments
- Review memory/ files for knowledge updates
- Monitor logs/ directory for issues

*Next supervision cycle in $SUPERVISION_INTERVAL seconds*
EOF

    log_info "Supervision report generated: $report_file"
}

# Main supervision cycle
supervision_cycle() {
    local iteration=$1
    
    log_supervision "=== Supervision Cycle #$iteration ==="
    
    # Check all agents
    for agent in "${!AGENTS[@]}"; do
        check_agent_health "$agent"
    done
    
    # Task coordination
    check_task_assignments
    
    # Memory management
    consolidate_memory
    
    # Performance monitoring
    collect_metrics
    
    # Merge management
    check_merge_conflicts
    auto_merge_eligible_branches
    
    # Generate report every 10 cycles
    if [ $((iteration % 10)) -eq 0 ]; then
        generate_supervision_report
    fi
    
    # Send context-aware instructions to agents
    send_agent_instructions "$iteration"
    
    log_supervision "=== Cycle #$iteration Complete ==="
}

# Send context-aware instructions to agents
send_agent_instructions() {
    local iteration=$1
    
    log_supervision "Analyzing agent outputs and sending instructions..."
    
    # Check if agents need guidance based on their recent output
    for agent in "${!AGENTS[@]}"; do
        local pane_target="${AGENTS[$agent]}"
        local pane_log_file="$PROJECT_ROOT/logs/${agent}_pane.txt"
        
        if [ -f "$pane_log_file" ]; then
            local recent_output=$(tail -20 "$pane_log_file")
            
            # Simple heuristics for instruction generation
            if echo "$recent_output" | grep -q "Done\|Complete\|Finished"; then
                local next_instruction=$(generate_next_instruction "$agent" "completed_task")
                if [ -n "$next_instruction" ]; then
                    log_info "Sending next task to $agent agent"
                    tmux send-keys -t "$pane_target" "$next_instruction"
                    tmux send-keys -t "$pane_target" Enter
                fi
            elif echo "$recent_output" | grep -q "Error\|Failed\|Issue"; then
                local help_instruction=$(generate_next_instruction "$agent" "needs_help")
                if [ -n "$help_instruction" ]; then
                    log_warning "Sending assistance to $agent agent"
                    tmux send-keys -t "$pane_target" "$help_instruction"
                    tmux send-keys -t "$pane_target" Enter
                fi
            fi
        fi
    done
}

# Generate context-aware instructions for agents
generate_next_instruction() {
    local agent=$1
    local context=$2
    local instruction=""
    
    case "$agent:$context" in
        "frontend-perf:completed_task")
            instruction="Continue with the next component decomposition. Extract the next largest component and implement React.memo optimization."
            ;;
        "game-mechanics:completed_task")
            instruction="Great progress! Move to the next priority: implement seasonal cycles or peer interaction systems."
            ;;
        "architecture:completed_task")
            instruction="Excellent work! Continue with service layer refactoring or state management optimization."
            ;;
        "frontend-perf:needs_help")
            instruction="If you encounter issues, check the existing component patterns in src/components/ for reference."
            ;;
        "game-mechanics:needs_help")
            instruction="Review the existing service files in src/services/ for implementation patterns."
            ;;
        "architecture:needs_help")
            instruction="Check the existing test structure in tests/ and follow the established patterns."
            ;;
    esac
    
    echo "$instruction"
}

# Main execution
main() {
    echo "=================================================="
    echo "🔍 BabySim Agent Supervision System"
    echo "=================================================="
    echo ""
    
    check_existing_supervision
    init_logging
    
    log_info "Starting supervision loop (interval: ${SUPERVISION_INTERVAL}s)"
    log_info "Monitoring agents: ${!AGENTS[*]}"
    log_info "Logs: $LOG_FILE"
    echo ""
    
    local iteration=1
    
    while true; do
        supervision_cycle "$iteration"
        
        # Check if we should stop
        if [ "$MAX_ITERATIONS" -gt 0 ] && [ "$iteration" -ge "$MAX_ITERATIONS" ]; then
            log_info "Reached maximum iterations ($MAX_ITERATIONS), stopping"
            break
        fi
        
        # Sleep for supervision interval
        sleep "$SUPERVISION_INTERVAL"
        
        iteration=$((iteration + 1))
    done
    
    cleanup
}

# Handle script arguments
case "${1:-}" in
    "status")
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                echo "✅ Supervision loop is running (PID: $pid)"
                echo "📁 Log file: $LOG_FILE"
                echo "⏱️  Interval: ${SUPERVISION_INTERVAL}s"
            else
                echo "❌ Supervision loop is not running (stale PID file)"
            fi
        else
            echo "❌ Supervision loop is not running"
        fi
        ;;
    "stop")
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                echo "Stopping supervision loop (PID: $pid)..."
                kill "$pid"
                sleep 2
                if kill -0 "$pid" 2>/dev/null; then
                    echo "Force stopping..."
                    kill -9 "$pid"
                fi
                echo "✅ Supervision loop stopped"
            else
                echo "❌ Supervision loop is not running"
            fi
        else
            echo "❌ No supervision loop to stop"
        fi
        ;;
    "logs")
        if [ -f "$LOG_FILE" ]; then
            tail -f "$LOG_FILE"
        else
            echo "❌ No log file found: $LOG_FILE"
        fi
        ;;
    "report")
        generate_supervision_report
        ;;
    "--force")
        rm -f "$PID_FILE"
        main
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Start supervision loop"
        echo "  status     Show supervision status"
        echo "  stop       Stop running supervision loop"
        echo "  logs       Follow supervision logs"
        echo "  report     Generate supervision report"
        echo "  --force    Force start (remove stale PID)"
        echo "  help       Show this help message"
        echo ""
        echo "Configuration:"
        echo "  Interval: ${SUPERVISION_INTERVAL}s"
        echo "  Log file: $LOG_FILE"
        echo "  PID file: $PID_FILE"
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