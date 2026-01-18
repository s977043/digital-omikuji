#!/bin/bash
set -e

# Configuration
CONTEXT_PROMPT="[Context: Expo SDK 54, Router v4, NativeWind v4, Japanese Language, AGENTS.md rules]"

# Main logic
if [ -n "$1" ]; then
    # File mode
    FILEPATH="$1"
    if [ ! -f "$FILEPATH" ]; then
        echo "Error: File $FILEPATH not found."
        exit 1
    fi
    RELPATH=$(realpath --relative-to="$(pwd)" "$FILEPATH")
    ABS_PATH=$(realpath "$FILEPATH")
    
    # We ask copilot to read the file explicitly if support tool usage, but here passing content in prompt is safer for 'explain' style if supported.
    # However, copilot CLI usually can read files if instructed.
    # Let's try constructing a prompt telling it to review the file at the path.
    
    PROMPT="${CONTEXT_PROMPT} Review the file at ${ABS_PATH}. Checking for quality, bugs, maintainability, and AGENTS.md violations."
    
    # Execute
    copilot -p "$PROMPT" --allow-all-paths

else
    # Stdin mode
    if [ -p /dev/stdin ]; then
        CONTENT=$(cat)
        PROMPT="${CONTEXT_PROMPT} Review the following code:\n\n${CONTENT}"
        copilot -p "$PROMPT"
    else
        echo "Usage: $0 <file>"
        echo "       cat content | $0"
        exit 1
    fi
fi
