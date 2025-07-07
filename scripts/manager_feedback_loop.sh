#!/bin/bash

# Manager Agent Feedback Loop - Provides feedback every 2 minutes

LOG_DIR="/home/dfdan/projects/babysim-clone/logs"

while true; do
    echo "=== Manager Feedback $(date '+%Y-%m-%d %H:%M:%S') ==="
    
    # Architecture Agent feedback
    tmux send-keys -t Agent1:0.1 "Architecture progress check: Focus on creating .github/workflows/ci.yml with test, build, and deploy stages. Include Node 18/20 matrix and pnpm caching." Enter
    
    # Frontend-Performance Agent feedback  
    tmux send-keys -t Agent1:0.2 "Performance update: Priority is React.memo on GameplayPhase, DashboardContainer, and Timeline components. Add bundle analyzer to measure impact." Enter
    
    # Game-Mechanics Agent feedback
    tmux send-keys -t Agent1:0.3 "Game mechanics status: Good progress on trait scenarios! Still need: adaptability, humor, patience, leadership traits. Remember to add translation keys." Enter
    
    # Log status
    echo "Feedback sent to all agents at $(date '+%H:%M:%S')" >> "$LOG_DIR/manager_feedback.log"
    
    # Wait 2 minutes
    sleep 120
done