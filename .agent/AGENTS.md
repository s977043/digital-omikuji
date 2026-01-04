# .agent/AGENTS.md — Agent Workspace Supplement

共通の開発ルールはリポジトリ直下の `AGENTS.md` に集約されています。`.agent/` 配下で作業する際も、必ず最初に `AGENTS.md` を参照してください。

## .agent 用メモ

- エージェント設定や Skill は `.agent/` 以下に配置する（プロンプト: `agents/`, Skill: `skills/`, 方針: `steering/`）。
- Codex CLI を使う場合はルートの `codex.md` を起点に、`.agent/docs/CodexAgentSkills.md` と `skills/index.json` を確認する。
- コマンド・コーディング規約・PR ルールは `AGENTS.md` の記載を正とし、重複を避ける。
