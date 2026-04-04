# AI Design Skills

このディレクトリには、11 体構成のレビューエージェントが使う専門スキルを配置します。

## ルール

- 各スキルは `SKILL.md` を正本とする
- 補助ファイルは `checklist.md`, `rules.md`, `template.md`, `glossary.md` など必要最小限にする
- 実運用では `AGENTS.md` と `DESIGN.md` を優先し、このスキル群は判断補助として使う
- 追加・更新時は `CHECKLIST.md` を参照する

## 主なカテゴリ

- Experience: `ui-review`, `ux-review`, `microcopy-review`
- Design System / Accessibility: `component-design-review`, `design-token-governance`, `accessibility-audit`
- Engineering / QA / Performance: `pr-review`, `ui-regression-check`, `e2e-test-review`, `web-vitals-audit`, `bundle-review`
- Architecture / Governance / Operations: `architecture-review`, `quality-gate-review`, `production-readiness-review`, `observability-review`

## 追加時の読み順

1. `AGENTS.md`
2. `.agent/ai-design-agents/README.md`
3. `.agent/ai-design-agents/skills/CHECKLIST.md`
4. 対象 skill の `SKILL.md`
