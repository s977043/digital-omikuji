#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[format] pnpm not found, skipping"
  exit 0
fi

if [ ! -d .git ]; then
  echo "[format] Not a git repository, skipping"
  exit 0
fi

# Get changed files (both staged and unstaged, excluding deleted)
# Use -z for null-terminated output to handle spaces in filenames
git diff -z --name-only --diff-filter=ACMRTUXB HEAD 2>/dev/null | while IFS= read -r -d '' file; do
  # Filter for supported extensions
  case "$file" in
    *.js|*.jsx|*.ts|*.tsx|*.json|*.md|*.yml|*.yaml|*.mjs)
      if [ -f "$file" ]; then
        pnpm exec prettier --write "$file" || true
      fi
      ;;
  esac
done

echo "[format] Done"
