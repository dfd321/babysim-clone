#!/bin/bash

# Manager reminder script - sends ping to manager pane every 2 minutes

while true; do
    echo "=== Manager Ping $(date '+%Y-%m-%d %H:%M:%S') ===" >> /home/dfdan/projects/babysim-clone/logs/manager_reminders.log
    
    # Send simple ping to manager pane (pane 0)
    tmux send-keys -t Agent1:0.0 "ping $(date '+%H:%M:%S')"
    tmux send-keys -t Agent1:0.0 Enter
    
    # Wait 2 minutes
    sleep 120
done