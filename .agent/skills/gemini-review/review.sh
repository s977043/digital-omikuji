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
    # Use relative path if possible
    RELPATH=$(realpath --relative-to="$(pwd)" "$FILEPATH")
    
    # Construct prompt and pipe to gemini
    # Note: gemini acts as a REPL receiving stdin, so we send the prompt and close stdin.
    (
        echo "${CONTEXT_PROMPT}"
        echo "${RELPATH} をレビューして。コードの品質、バグ、保守性、およびAGENTS.mdの規約違反について指摘してください。"
        echo "File Content:"
        cat "$FILEPATH"
    ) | gemini

else
    # Stdin mode
    if [ -p /dev/stdin ]; then
        (
            echo "${CONTEXT_PROMPT}"
            echo "以下のコード/内容をレビューして："
            cat
        ) | gemini
    else
        echo "Usage: $0 <file>"
        echo "       cat content | $0"
        exit 1
    fi
fi
