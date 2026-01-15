Goal (成功条件を含む):
- Update agent configuration files (AGENTS.md and thin wrappers) with concise WHAT/WHY/HOW/Constraints guidance and commit changes.

Constraints / Assumptions:
- Follow AGENTS.md instructions across repo; no edits to node_modules, lockfiles, .env*, secrets.
- Must commit changes on current branch and create PR message via make_pr after commit.
- Use minimal diffs; avoid lint-only changes; no bulk generation.
- CONTINUITY.md must be maintained.

Key decisions:
- Replace AGENTS.md content with the concise template aligned to this repo.
- Add CLAUDE.md as a thin pointer to AGENTS.md.
- Simplify Gemini/Copilot instructions to thin wrappers pointing to AGENTS.md.

State:
  Done:
  - Updated AGENTS.md with new concise guidance.
  - Added CLAUDE.md wrapper and simplified GEMINI.md and .github/copilot-instructions.md.
  - Committed changes and prepared PR message.
  Now:
  - Ready to report summary and testing status.
  Next:
  - None.

Open questions (必要なら UNCONFIRMED):
- UNCONFIRMED: Whether other agent instruction files (codex.md, .agent/...) require adjustment.

Working set (files / ids / commands):
- AGENTS.md
- CLAUDE.md
- GEMINI.md
- .github/copilot-instructions.md
- CONTINUITY.md
- git commit 570771e
