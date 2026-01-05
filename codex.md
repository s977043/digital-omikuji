# codex.md — OpenAI Codex CLI Agent Guide

> **Single source:** 共通ルールは [.agent/AGENTS.md](./.agent/AGENTS.md)。本ファイルは Codex 向けの最小差分です。

## Codex-specific settings

- Config: See `.codex/config.toml` for approval policy and sandbox mode
- Detailed instructions: See `.codex/AGENTS.md`
- Agent Skills: See `.agent/docs/CodexAgentSkills.md`

## Quick reference (from AGENTS.md)

- Package manager: `pnpm` (not npm)
- Install: `pnpm install`
- Test: `pnpm test`
- Build: `pnpm build`
- Safety: No secrets access, no destructive commands without confirmation
- Workflow: Small changes -> test -> PR
