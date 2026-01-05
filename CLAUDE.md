# Claude Code Project Guide (Digital Omikuji)

> **Single source:** Rules are defined in [.agent/AGENTS.md](./.agent/AGENTS.md). This file contains only Claude-specific configurations.

## Critical Rules (Summary)

- **Security**: Do not access secrets (`.env`, `secrets/`).
- **Workflow**: `pnpm test` must pass before PR.
- **SSOT**: See `.agent/AGENTS.md` for tech stack, style guides, and definitions.

## Claude-specific

- **Permissions**: `.claude/settings.json` (See for allowed/denied commands)
- **Hooks**: `.claude/hooks/` (Auto-format on edit)
- **Steering docs**: `.agent/steering/`

## Custom Commands

- `/check` : Run quality checks (lint/test)
- `/pr` : Draft PR description
- `/help` : List these commands details (check `.claude/commands/`)

## Quick reference (from AGENTS.md)

- Package manager: `pnpm` (not npm)
- Test: `pnpm test`
- Build: `pnpm build`
- Safety: No secrets access, no destructive commands without confirmation
- Workflow: Small changes -> test -> PR
