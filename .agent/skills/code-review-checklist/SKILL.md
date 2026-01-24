---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
allowed-tools: Read, Glob, Grep
---

# Code Review Checklist

## Project-specific
- Use the Digital Omikuji self-review checklist: `docs/guides/SELF_REVIEW_CHECKLIST.md`.
- Prefer it for PR self-review and agent reviews in this repo.

## Minimal fallback (generic)
- [ ] Behavior correct for happy/edge cases; errors handled
- [ ] No secrets or sensitive data in diff; basic input validation present
- [ ] Naming and boundaries follow project conventions
- [ ] Tests updated and passing (or explicitly noted)
- [ ] No obvious performance regressions
