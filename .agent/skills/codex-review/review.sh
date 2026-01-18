#!/bin/bash
set -e

# Configuration
PANE_TARGET="dev:0.1"
TIMEOUT_SECONDS=60
CONTEXT_PROMPT="[Context: Expo SDK 54, Router v4, NativeWind v4, Japanese Language, AGENTS.md rules]"

# Function to run tmux commands
run_review() {
    local input_text="$1"
    
    # Check tmux session
    if ! tmux has-session -t "${PANE_TARGET%%:*}" 2>/dev/null; then
        echo "Error: tmux session '${PANE_TARGET%%:*}' not found."
        echo "Please start the dev environment with 'dev' command."
        exit 1
    fi

    # Clear history
    tmux clear-history -t "$PANE_TARGET"

    # Send input
    tmux send-keys -t "$PANE_TARGET" "$input_text" C-m

    # Wait for response (detected by prompt '›')
    local waiting=true
    local counter=0
    
    echo "Waiting for Codex response..." >&2
    
    while [ $counter -lt $TIMEOUT_SECONDS ]; do
        if tmux capture-pane -t "$PANE_TARGET" -p | grep -q "^›"; then
            waiting=false
            break
        fi
        sleep 1
        counter=$((counter + 1))
    done

    if [ "$waiting" = true ]; then
        echo "Timeout waiting for Codex response." >&2
        return 1
    fi

    # Capture and output result (last 100 lines)
    tmux capture-pane -t "$PANE_TARGET" -p -S -100
}

# Main logic
if [ -n "$1" ]; then
    # File mode
    FILEPATH="$1"
    if [ ! -f "$FILEPATH" ]; then
        echo "Error: File $FILEPATH not found."
        exit 1
    fi
    # Use relative path if possible for cleaner prompt
    RELPATH=$(realpath --relative-to="$(pwd)" "$FILEPATH")
    PROMPT="${CONTEXT_PROMPT} ${RELPATH} をレビューして。コードの品質、バグ、保守性、およびAGENTS.mdの規約違反について指摘してください。"
    run_review "$PROMPT"
else
    # Stdin/Direct mode (read from stdin if available, otherwise usage)
    if [ -p /dev/stdin ]; then
        CONTENT=$(cat)
        PROMPT="${CONTEXT_PROMPT} 以下のコード/内容をレビューして：\n\n${CONTENT}"
        run_review "$PROMPT"
    else
        echo "Usage: $0 <file>"
        echo "       cat content | $0"
        exit 1
    fi
fi
