# TMUX Automation Guide - Multi-Agent Spawning Nuances

*Critical implementation details for reliable agent spawning and coordination*

## Agent Spawning Sequence

### Prerequisites
- Active TMUX session named `babysim-agents`
- Manager agent running in pane 0
- Working directory: `/home/dfdan/projects/babysim-clone/`

### Pane Creation Commands

#### Command Sequence for Each Agent
```bash
# Step 1: Create new horizontal pane
tmux new-pane -h

# Step 2: Initialize Claude Code session (CRITICAL)
tmux send-keys -t babysim-agents.[pane-number] "c"
tmux send-keys -t babysim-agents.[pane-number] Enter

# Step 3: Wait for Claude Code initialization (2-3 seconds recommended)
sleep 3

# Step 4: Send scoped prompt content
tmux send-keys -t babysim-agents.[pane-number] "[scoped prompt content]"

# Step 5: Send Enter as separate command (CRITICAL)
tmux send-keys -t babysim-agents.[pane-number] Enter
```

### Complete Agent Spawning Script

```bash
#!/bin/bash
# spawn_agents.sh - Automated agent creation with proper initialization

SESSION_NAME="babysim-agents"
BASE_DIR="/home/dfdan/projects/babysim-clone"

# Ensure we're in the correct session
tmux has-session -t $SESSION_NAME 2>/dev/null || {
    echo "Error: TMUX session $SESSION_NAME not found"
    exit 1
}

# Function to spawn individual agent
spawn_agent() {
    local pane_number=$1
    local agent_name=$2
    local prompt_file=$3
    
    echo "Spawning $agent_name in pane $pane_number..."
    
    # Create new pane
    tmux new-pane -h -t $SESSION_NAME
    
    # Initialize Claude Code session
    tmux send-keys -t $SESSION_NAME.$pane_number "c"
    tmux send-keys -t $SESSION_NAME.$pane_number Enter
    
    # Wait for initialization
    echo "Waiting for Claude Code initialization..."
    sleep 3
    
    # Send scoped prompt
    if [ -f "$prompt_file" ]; then
        tmux send-keys -t $SESSION_NAME.$pane_number "$(cat $prompt_file)"
        tmux send-keys -t $SESSION_NAME.$pane_number Enter
        echo "$agent_name initialized successfully"
    else
        echo "Error: Prompt file $prompt_file not found"
        return 1
    fi
}

# Spawn all agents
spawn_agent 1 "Frontend-Performance-Agent" "$BASE_DIR/coordination/prompts/frontend-performance-prompt.md"
spawn_agent 2 "Game-Mechanics-Agent" "$BASE_DIR/coordination/prompts/game-mechanics-prompt.md"  
spawn_agent 3 "Architecture-Agent" "$BASE_DIR/coordination/prompts/architecture-prompt.md"

echo "All agents spawned successfully"
echo "Use 'tmux attach -t $SESSION_NAME' to view agents"
```

## Supervision Loop Automation

### Critical Command Patterns

#### Pane Output Capture
```bash
# Capture pane content to file
tmux capture-pane -t babysim-agents.0 -p > coord/logs/manager_pane.txt
tmux capture-pane -t babysim-agents.1 -p > coord/logs/frontend_pane.txt
tmux capture-pane -t babysim-agents.2 -p > coord/logs/game_mechanics_pane.txt
tmux capture-pane -t babysim-agents.3 -p > coord/logs/architecture_pane.txt
```

#### Instruction Delivery
```bash
# ALWAYS use separate commands for instruction and Enter
tmux send-keys -t babysim-agents.[pane] "[instruction content]"
tmux send-keys -t babysim-agents.[pane] Enter

# NEVER combine in single command like this:
# tmux send-keys -t babysim-agents.[pane] "[instruction]" Enter  # WRONG
```

#### Pane Status Check
```bash
# Check if pane is responsive
tmux list-panes -t babysim-agents -F "#{pane_index}: #{pane_active} #{pane_current_command}"

# Check if Claude Code is running in pane
tmux capture-pane -t babysim-agents.[pane] -p | grep -q "Claude Code" && echo "Active" || echo "Inactive"
```

## Error Handling & Recovery

### Common Issues and Solutions

#### Issue: Claude Code Session Not Starting
```bash
# Symptoms: Pane shows shell prompt instead of Claude Code
# Solution: Re-initialize session
tmux send-keys -t babysim-agents.[pane] "c"
tmux send-keys -t babysim-agents.[pane] Enter
sleep 3
```

#### Issue: Commands Not Being Received
```bash
# Symptoms: Instructions appear in pane but not processed
# Solution: Check pane focus and re-send
tmux select-pane -t babysim-agents.[pane]
tmux send-keys -t babysim-agents.[pane] "[instruction]"
tmux send-keys -t babysim-agents.[pane] Enter
```

#### Issue: Pane Becomes Unresponsive
```bash
# Solution: Kill and respawn pane
tmux kill-pane -t babysim-agents.[pane]
# Re-run spawn_agent function for that specific agent
```

### Session Recovery Commands
```bash
# List all sessions
tmux list-sessions

# Attach to existing session
tmux attach -t babysim-agents

# Kill session if needed
tmux kill-session -t babysim-agents

# Create new session
tmux new-session -s babysim-agents -d
```

## Supervision Loop Implementation

### manager-loop.sh Template
```bash
#!/bin/bash
# Supervision loop with proper command separation

SESSION_NAME="babysim-agents"
COORD_DIR="/home/dfdan/projects/babysim-clone/coordination"
LOGS_DIR="$COORD_DIR/logs"

while true; do
    echo "$(date): Starting supervision cycle..."
    
    # Capture all pane outputs
    for pane in {0..3}; do
        tmux capture-pane -t $SESSION_NAME.$pane -p > "$LOGS_DIR/pane_${pane}.txt"
    done
    
    # Deep-think analysis (implement your logic here)
    # analyze_pane_outputs()
    
    # Send instructions (CRITICAL: separate commands)
    if [ -n "$instruction_for_pane_1" ]; then
        tmux send-keys -t $SESSION_NAME.1 "$instruction_for_pane_1"
        tmux send-keys -t $SESSION_NAME.1 Enter
    fi
    
    if [ -n "$instruction_for_pane_2" ]; then
        tmux send-keys -t $SESSION_NAME.2 "$instruction_for_pane_2"
        tmux send-keys -t $SESSION_NAME.2 Enter
    fi
    
    if [ -n "$instruction_for_pane_3" ]; then
        tmux send-keys -t $SESSION_NAME.3 "$instruction_for_pane_3"
        tmux send-keys -t $SESSION_NAME.3 Enter
    fi
    
    # Wait for next cycle
    sleep 120
done
```

## Pane Layout Management

### Expected Layout
```
┌─────────────────────────────────────────────────────────┐
│                  babysim-agents                         │
├─────────────────┬─────────────────┬───────────────────┤
│  Pane 0         │  Pane 1         │  Pane 2           │
│  MANAGER        │  FRONTEND-      │  GAME-MECHANICS   │
│  AGENT          │  PERFORMANCE    │  AGENT            │
│  (Current)      │  AGENT          │                   │
├─────────────────┴─────────────────┼───────────────────┤
│                                   │  Pane 3           │
│                                   │  ARCHITECTURE     │
│                                   │  AGENT            │
└───────────────────────────────────┴───────────────────┘
```

### Navigation Commands
```bash
# Switch to specific pane
tmux select-pane -t babysim-agents.0  # Manager
tmux select-pane -t babysim-agents.1  # Frontend
tmux select-pane -t babysim-agents.2  # Game-Mechanics  
tmux select-pane -t babysim-agents.3  # Architecture

# Keyboard shortcuts (from within tmux)
Ctrl+b + 0/1/2/3  # Direct pane selection
Ctrl+b + o        # Cycle through panes
Ctrl+b + z        # Zoom current pane
Ctrl+b + {/}      # Swap panes
```

## Critical Timing Considerations

### Initialization Delays
- **Claude Code startup**: 2-3 seconds minimum wait
- **Prompt processing**: 1-2 seconds for complex prompts
- **Session establishment**: 3-5 seconds total per agent

### Supervision Timing
- **Capture interval**: 120 seconds (as per master prompt v0.6)
- **Instruction processing**: Allow 5-10 seconds between instructions
- **Pane switching delay**: 1 second minimum between pane operations

## Debugging Commands

### Session State Inspection
```bash
# List all panes with details
tmux list-panes -t babysim-agents -F "#{pane_index}: #{pane_width}x#{pane_height} #{pane_current_command}"

# Show pane content (last 20 lines)
tmux capture-pane -t babysim-agents.[pane] -p | tail -20

# Monitor pane activity
tmux monitor-activity -t babysim-agents.[pane]
```

### Log File Monitoring
```bash
# Real-time log monitoring
tail -f coordination/logs/pane_*.txt

# Check latest pane captures
ls -la coordination/logs/pane_*.txt
```

## Best Practices

1. **Always wait for Claude Code initialization** before sending prompts
2. **Use separate send-keys commands** for instruction and Enter
3. **Implement error checking** for pane responsiveness
4. **Log all automation actions** for debugging
5. **Test spawning sequence** in isolation before full automation
6. **Keep session recovery commands** readily available
7. **Monitor pane health** during supervision cycles

---

*This document should be referenced during all multi-agent automation implementation to ensure reliable agent spawning and coordination.*