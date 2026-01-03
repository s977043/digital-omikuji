#!/usr/bin/env bash
set -euo pipefail

# PostToolUse hook: format after file edits
# Currently a no-op since this project doesn't have Prettier configured.
# Uncomment below if Prettier is added:
# pnpm -s prettier -w .

echo "Format hook executed (no-op)"
