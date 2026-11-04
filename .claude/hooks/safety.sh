#!/usr/bin/env bash
set -euo pipefail

tool_input="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$tool_input" ] && [ ! -t 0 ]; then
  tool_input="$(cat)"
fi

command="${CLAUDE_BASH_COMMAND:-}"
if [ -z "$command" ] && [ -n "$tool_input" ]; then
  if command -v node >/dev/null 2>&1; then
    command="$(printf '%s' "$tool_input" | node -e 'const fs=require("fs");const input=fs.readFileSync(0,"utf8");try{const data=JSON.parse(input);if(data&&typeof data.command==="string"){process.stdout.write(data.command);}}catch(e){}')"
  fi
  if [ -z "$command" ]; then
    command="$(printf '%s' "$tool_input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p')"
  fi
fi

if [ -z "$command" ]; then
  exit 0
fi

command_lc="$(printf '%s' "$command" | tr 'A-Z' 'a-z')"

danger_patterns=(
  "rm -rf"
  "rm -fr"
  "git reset --hard"
  "git clean -fd"
  "git clean -fdx"
  "kubectl delete"
  "docker system prune"
  "docker rm"
  "docker rmi"
  "mkfs"
  "dd if="
  "shutdown"
  "reboot"
)

for pattern in "${danger_patterns[@]}"; do
  if [[ "$command_lc" == *"$pattern"* ]]; then
    echo "[safety] Blocked by safety hook: $pattern" >&2
    echo "[safety] Command: $command" >&2
    exit 2
  fi
done

exit 0
