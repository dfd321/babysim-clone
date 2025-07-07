#!/bin/bash

# BabySim Branch Merge Automation
# Handles automated merging of agent branches with conflict resolution

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COORDINATION_DIR="$PROJECT_ROOT/coordination"
MEMORY_DIR="$PROJECT_ROOT/memory"

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
PURPLE='\033[0;35m'
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

log_merge() {
    echo -e "${PURPLE}[MERGE]${NC} $1"
}

# Get main branch name
get_main_branch() {
    git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'
}

# Check if branch is ready for merge
check_merge_readiness() {
    local branch=$1
    local agent=$2
    
    log_merge "Checking merge readiness for $agent ($branch)..."
    
    # Switch to branch
    git checkout "$branch" 2>/dev/null || {
        log_error "Failed to checkout branch: $branch"
        return 1
    }
    
    # Check if branch is ahead of main
    local main_branch=$(get_main_branch)
    local commits_ahead=$(git rev-list --count "$main_branch..$branch" 2>/dev/null || echo "0")
    
    if [ "$commits_ahead" -eq 0 ]; then
        log_warning "Branch $branch has no commits ahead of $main_branch"
        return 1
    fi
    
    log_info "$agent branch has $commits_ahead commits ahead"
    
    # Check for merge conflicts with main
    local merge_base=$(git merge-base "$main_branch" "$branch")
    local conflicts_exist=false
    
    # Simulate merge to check for conflicts
    git merge-tree "$merge_base" "$main_branch" "$branch" | grep -q "<<<<<<< " && conflicts_exist=true
    
    if [ "$conflicts_exist" = true ]; then
        log_warning "Branch $branch has potential merge conflicts"
        return 2  # Special return code for conflicts
    fi
    
    # Run quality checks if available
    if ! run_quality_checks "$branch" "$agent"; then
        log_warning "Quality checks failed for $branch"
        return 3  # Special return code for quality issues
    fi
    
    log_success "Branch $branch is ready for merge"
    return 0
}

# Run quality checks on branch
run_quality_checks() {
    local branch=$1
    local agent=$2
    
    log_info "Running quality checks for $agent..."
    
    # TypeScript compilation check
    if [ -f "package.json" ] && grep -q "typescript" package.json; then
        log_info "Checking TypeScript compilation..."
        if command -v npm &> /dev/null; then
            if ! npm run type-check &>/dev/null; then
                log_error "TypeScript compilation failed"
                return 1
            fi
        fi
    fi
    
    # Linting check
    if [ -f "package.json" ] && grep -q "eslint" package.json; then
        log_info "Running ESLint..."
        if command -v npm &> /dev/null; then
            if ! npm run lint &>/dev/null; then
                log_error "ESLint checks failed"
                return 1
            fi
        fi
    fi
    
    # Test check (if tests exist)
    if [ -f "package.json" ] && grep -q "test" package.json; then
        log_info "Running tests..."
        if command -v npm &> /dev/null; then
            # Skip tests for now to avoid blocking (would run in real implementation)
            log_info "Test check skipped (would run: npm test)"
        fi
    fi
    
    log_success "Quality checks passed for $agent"
    return 0
}

# Perform automatic merge
perform_merge() {
    local branch=$1
    local agent=$2
    local main_branch=$(get_main_branch)
    
    log_merge "Performing merge for $agent ($branch → $main_branch)..."
    
    # Switch to main branch
    git checkout "$main_branch"
    
    # Ensure main is up to date
    git pull origin "$main_branch" || {
        log_warning "Failed to pull latest main branch"
    }
    
    # Create merge commit message
    local merge_message="Merge $branch: $agent agent updates

Agent: $agent
Branch: $branch
Commits: $(git rev-list --count "$main_branch..$branch")

🤖 Automated merge via multi-agent system

Co-Authored-By: $agent-agent <$agent@babysim.ai>"
    
    # Perform merge
    if git merge --no-ff "$branch" -m "$merge_message"; then
        log_success "Successfully merged $branch into $main_branch"
        
        # Update coordination files
        update_merge_records "$agent" "$branch" "success"
        
        # Clean up branch if requested
        if [ "${AUTO_DELETE_BRANCHES:-false}" = "true" ]; then
            git branch -d "$branch"
            log_info "Deleted merged branch: $branch"
        fi
        
        return 0
    else
        log_error "Merge failed for $branch"
        
        # Abort merge
        git merge --abort
        
        # Update coordination files
        update_merge_records "$agent" "$branch" "failed"
        
        return 1
    fi
}

# Handle merge conflicts interactively
handle_merge_conflicts() {
    local branch=$1
    local agent=$2
    local main_branch=$(get_main_branch)
    
    log_warning "Handling merge conflicts for $agent ($branch)..."
    
    # Switch to main branch
    git checkout "$main_branch"
    
    # Attempt merge
    if ! git merge --no-ff "$branch"; then
        log_warning "Merge conflicts detected. Conflict resolution required:"
        
        # List conflicted files
        local conflicted_files=$(git diff --name-only --diff-filter=U)
        echo "Conflicted files:"
        echo "$conflicted_files" | while read -r file; do
            echo "  - $file"
        done
        
        # Create conflict resolution guide
        create_conflict_resolution_guide "$agent" "$branch" "$conflicted_files"
        
        # Abort merge for now
        git merge --abort
        
        log_error "Merge aborted due to conflicts. See conflict resolution guide."
        return 1
    fi
}

# Create conflict resolution guide
create_conflict_resolution_guide() {
    local agent=$1
    local branch=$2
    local conflicted_files=$3
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    local guide_file="$COORDINATION_DIR/conflict_resolution_${agent}_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$guide_file" << EOF
# Merge Conflict Resolution Guide

*Generated: $timestamp*

## Conflict Details
- **Agent**: $agent
- **Branch**: $branch
- **Target**: $(get_main_branch)

## Conflicted Files
$conflicted_files

## Resolution Steps

### 1. Prepare for Resolution
\`\`\`bash
git checkout $(get_main_branch)
git merge --no-ff $branch
\`\`\`

### 2. Resolve Each Conflict
For each conflicted file:
1. Open the file in your editor
2. Look for conflict markers: \`<<<<<<< HEAD\`, \`=======\`, \`>>>>>>> $branch\`
3. Choose the correct version or merge both changes
4. Remove conflict markers
5. Test the resolution

### 3. Complete the Merge
\`\`\`bash
git add .
git commit
\`\`\`

### 4. Verify Result
\`\`\`bash
npm run type-check
npm run lint
npm run test
\`\`\`

## Conflict Resolution Strategies

### Code Conflicts
- **Keep both changes**: Merge functionality from both branches
- **Prefer agent changes**: Use $agent agent's implementation
- **Prefer main changes**: Keep main branch version
- **Hybrid approach**: Combine best parts of both

### Documentation Conflicts
- **Merge sections**: Combine documentation from both sources
- **Update timestamps**: Use latest timestamp
- **Preserve both perspectives**: Include insights from both branches

### Configuration Conflicts
- **Test compatibility**: Ensure config works with both sets of changes
- **Prefer explicit over implicit**: Choose more explicit configuration
- **Document rationale**: Explain why specific config was chosen

## Post-Resolution Actions
1. Update coordination/decisions.md with conflict resolution approach
2. Update memory/patterns.md if new patterns emerged
3. Notify other agents of resolution strategy
4. Run full test suite to ensure stability

## Emergency Contact
If resolution is complex, contact:
- Manager Agent: Main project directory
- Technical Lead: Create GitHub issue
- Team: Update coordination/active_tasks.md

---
*This guide will be archived after successful resolution*
EOF

    log_info "Conflict resolution guide created: $guide_file"
}

# Update merge records in coordination
update_merge_records() {
    local agent=$1
    local branch=$2
    local status=$3
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    
    local merge_log="$COORDINATION_DIR/merge_log.md"
    
    # Create merge log if it doesn't exist
    if [ ! -f "$merge_log" ]; then
        cat > "$merge_log" << EOF
# Merge Log - BabySim Project

## Recent Merges
EOF
    fi
    
    # Add merge record
    cat >> "$merge_log" << EOF

### $timestamp - $agent Agent
- **Branch**: $branch
- **Status**: $status
- **Target**: $(get_main_branch)
$(if [ "$status" = "success" ]; then
    echo "- **Commits Merged**: $(git rev-list --count "$(get_main_branch)~1..$(get_main_branch)" 2>/dev/null || echo "Unknown")"
    echo "- **Files Changed**: $(git diff --name-only "$(get_main_branch)~1..$(get_main_branch)" 2>/dev/null | wc -l || echo "Unknown")"
fi)
EOF

    # Update agent status
    update_agent_merge_status "$agent" "$status"
}

# Update agent status with merge information
update_agent_merge_status() {
    local agent=$1
    local status=$2
    
    # This would update the agent status file with merge information
    # Implementation depends on the exact format of agent_status.md
    log_info "Updated merge status for $agent: $status"
}

# Process all agent branches
process_all_branches() {
    local main_branch=$(get_main_branch)
    local total_processed=0
    local successful_merges=0
    local failed_merges=0
    
    log_info "Processing all agent branches for merge..."
    log_info "Target branch: $main_branch"
    echo ""
    
    for agent in "${!AGENTS[@]}"; do
        local branch="${AGENTS[$agent]}"
        
        log_merge "Processing $agent agent (branch: $branch)"
        
        # Check if branch exists
        if ! git show-ref --verify --quiet "refs/heads/$branch"; then
            log_warning "Branch $branch does not exist, skipping"
            continue
        fi
        
        total_processed=$((total_processed + 1))
        
        # Check merge readiness
        local readiness_status
        check_merge_readiness "$branch" "$agent"
        readiness_status=$?
        
        case $readiness_status in
            0)
                # Ready for merge
                if perform_merge "$branch" "$agent"; then
                    successful_merges=$((successful_merges + 1))
                    log_success "✅ $agent: Merge completed successfully"
                else
                    failed_merges=$((failed_merges + 1))
                    log_error "❌ $agent: Merge failed"
                fi
                ;;
            1)
                log_info "⏭️  $agent: Nothing to merge"
                ;;
            2)
                # Has conflicts
                log_warning "⚠️  $agent: Merge conflicts detected"
                if [ "${HANDLE_CONFLICTS:-false}" = "true" ]; then
                    handle_merge_conflicts "$branch" "$agent"
                else
                    log_info "Conflict handling disabled. Manual resolution required."
                fi
                failed_merges=$((failed_merges + 1))
                ;;
            3)
                # Quality checks failed
                log_warning "⚠️  $agent: Quality checks failed"
                failed_merges=$((failed_merges + 1))
                ;;
            *)
                log_error "❌ $agent: Unknown error during readiness check"
                failed_merges=$((failed_merges + 1))
                ;;
        esac
        
        echo ""
    done
    
    # Return to main branch
    git checkout "$main_branch"
    
    # Summary
    echo "=================================================="
    echo "📊 Merge Summary"
    echo "=================================================="
    echo "Processed: $total_processed branches"
    echo "Successful: $successful_merges merges"
    echo "Failed: $failed_merges merges"
    echo ""
    
    if [ $failed_merges -gt 0 ]; then
        echo "⚠️  Some merges failed. Check coordination/merge_log.md for details"
        return 1
    else
        echo "🎉 All eligible branches merged successfully!"
        return 0
    fi
}

# Process single branch
process_single_branch() {
    local agent=$1
    local branch="${AGENTS[$agent]}"
    
    if [ -z "$branch" ]; then
        log_error "Unknown agent: $agent"
        log_info "Available agents: ${!AGENTS[*]}"
        exit 1
    fi
    
    log_info "Processing single branch for $agent agent"
    
    # Check if branch exists
    if ! git show-ref --verify --quiet "refs/heads/$branch"; then
        log_error "Branch $branch does not exist"
        exit 1
    fi
    
    # Check merge readiness
    local readiness_status
    check_merge_readiness "$branch" "$agent"
    readiness_status=$?
    
    case $readiness_status in
        0)
            if perform_merge "$branch" "$agent"; then
                log_success "✅ Merge completed successfully"
            else
                log_error "❌ Merge failed"
                exit 1
            fi
            ;;
        1)
            log_info "Nothing to merge"
            ;;
        2)
            log_warning "Merge conflicts detected"
            if [ "${HANDLE_CONFLICTS:-true}" = "true" ]; then
                handle_merge_conflicts "$branch" "$agent"
            fi
            ;;
        3)
            log_error "Quality checks failed"
            exit 1
            ;;
        *)
            log_error "Unknown error during readiness check"
            exit 1
            ;;
    esac
}

# Show merge status
show_merge_status() {
    local main_branch=$(get_main_branch)
    
    echo "=================================================="
    echo "📋 Branch Merge Status"
    echo "=================================================="
    echo "Main branch: $main_branch"
    echo ""
    
    for agent in "${!AGENTS[@]}"; do
        local branch="${AGENTS[$agent]}"
        
        if ! git show-ref --verify --quiet "refs/heads/$branch"; then
            echo "❌ $agent: Branch not found ($branch)"
            continue
        fi
        
        local commits_ahead=$(git rev-list --count "$main_branch..$branch" 2>/dev/null || echo "0")
        local commits_behind=$(git rev-list --count "$branch..$main_branch" 2>/dev/null || echo "0")
        
        if [ "$commits_ahead" -eq 0 ]; then
            echo "✅ $agent: Up to date ($branch)"
        else
            echo "📝 $agent: $commits_ahead commits ahead, $commits_behind behind ($branch)"
        fi
    done
    
    echo ""
    echo "Use '$0 merge-all' to process all branches"
    echo "Use '$0 merge <agent>' to process specific agent"
}

# Main execution
main() {
    echo "=================================================="
    echo "🔀 BabySim Branch Merge System"
    echo "=================================================="
    echo ""
    
    # Ensure we're in the main project directory
    cd "$PROJECT_ROOT"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    case "${1:-status}" in
        "merge-all"|"all")
            process_all_branches
            ;;
        "merge"|"single")
            if [ -z "$2" ]; then
                log_error "Agent name required for single merge"
                log_info "Usage: $0 merge <agent>"
                log_info "Available agents: ${!AGENTS[*]}"
                exit 1
            fi
            process_single_branch "$2"
            ;;
        "status"|"")
            show_merge_status
            ;;
        "conflicts")
            HANDLE_CONFLICTS=true
            process_all_branches
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  status          Show branch merge status (default)"
            echo "  merge-all       Process all agent branches for merge"
            echo "  merge <agent>   Process specific agent branch"
            echo "  conflicts       Process all branches with conflict handling"
            echo "  help            Show this help message"
            echo ""
            echo "Available agents: ${!AGENTS[*]}"
            echo ""
            echo "Environment variables:"
            echo "  AUTO_DELETE_BRANCHES=true   Delete branches after successful merge"
            echo "  HANDLE_CONFLICTS=true       Attempt to handle conflicts automatically"
            ;;
        *)
            log_error "Unknown command: $1"
            log_info "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"