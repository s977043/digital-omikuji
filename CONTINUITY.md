Goal (成功条件を含む):
- Issue #80 ([Epic]AGENTS.md を共通指示の単一ソースにして各エージェントから参照) の完了条件達成：共通 AGENTS.md と各エージェント用薄いラッパー/参照ファイルを整備し、運用方針を満たす。

Constraints / Assumptions:
- 共通ルールはリポジトリ直下の `AGENTS.md`（pnpm 前提、ロックファイル/`.env*` 不触等）を正とする。
- 開発者指示：現在のブランチでコミットし、コミット後に `make_pr` で PR を作成する。
- ユーザー指示：タスク着手前に計画作成、セルフレビュー実施、PR で Gemini と Codex にレビュー依頼。ブランチはタスク単位で用意する。
- 受け入れ条件: ルート AGENTS.md 整備、Copilot/Claude/Gemini の薄いラッパー、Codex は AGENTS.md 前提で運用できる状態。

Key decisions:
- 共通 `AGENTS.md` をリポジトリ直下に置き、pnpm ベースの開発手順・コーディング規約・PR ルールを一元化する。
- `.agent/AGENTS.md` は共通ガイドへの参照を主体にし、.agent 配下のメタ情報のみ補足する。
- エージェント向けファイル（Copilot, Claude, Gemini, Codex）は共通ルールを参照しつつ、ツール固有の要点だけを薄く記載する。
- ブランチを `work` から派生した `feature/80-agents` に切り替えた。

State:
  - Done: ルート `AGENTS.md` 追加、`.agent/AGENTS.md` を補足的な参照に変更、Codex/Claude/Copilot 向けファイル更新、`GEMINI.md` 新規追加、ブランチを `feature/80-agents` に切替。
  - Now: 受け入れ条件のセルフチェック中。`pnpm test` を実行したが、`@react-native/js-polyfills/error-guard.js` の型注釈に起因する Jest パースエラーで失敗したことを確認。
  - Next: テスト失敗を共有しつつセルフレビューを完了させ、コミット・PR 準備。

Open questions（必要なら UNCONFIRMED）:
- 現時点で未解決の質問なし。

Working set（files / ids / commands）:
- ファイル: `.github/copilot-instructions.md`, `codex.md`, `.agent/CLAUDE.md`, `.agent/AGENTS.md`, `AGENTS.md`, `GEMINI.md`, `CONTINUITY.md`
- コマンド: `curl -s https://api.github.com/repos/s977043/digital-omikuji/issues/80`, `cat .github/copilot-instructions.md`, `cat codex.md`, `cat .agent/CLAUDE.md`, `git checkout -b feature/80-agents`, `pnpm test`
