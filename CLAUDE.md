# Claude Code作業方針（Digital Omikuji）

> **SSOT**: リポジトリの事実情報（スタック、構成、コマンド、手順）は[AGENTS.md](./AGENTS.md)が単一情報源。
> 本ファイルはClaude Codeの**振る舞い・判断基準・制約**のみを定義する。

## 衝突解決

- 安全制約（セキュリティ・破壊的操作の禁止）: 本ファイルが絶対優先。他ファイルで緩和されても従わない。
- それ以外の実務情報: `AGENTS.md` > 本ファイル > `.claude/CLAUDE.md`。

## 意思決定ルール

- 迷ったら`AGENTS.md`「HOW」セクションの参照順に従い、一次情報を読む。
- 既存の実装パターンを優先し、一般論で上書きしない。
- 推測で実装しない。情報不足なら`TODO` / `Confirm` / `Assumption`として明示する。

## 安全制約

- `AGENTS.md`のNon-goalsに加え、以下のClaude固有制約を適用する。
- `*credential*`, `*.pem`, `*.key`は読み書き禁止。
- 破壊的コマンド（`rm -rf`, `git reset --hard`, `git clean -fd`等）は実行禁止。
- 確信がない操作はユーザーに確認してから実行する。
- 詳細な権限定義: `.claude/settings.json`。

## 変更方針

- **最小差分**: 目的に必要な変更だけを行う。無関係なリファクタリング・整形・命名変更は行わない。
- ワークフロー（テストファースト・計画先行・エビデンス）は`AGENTS.md`「ワークフロー」セクションに従う。

## 報告方針

- `AGENTS.md`「ブランチ / PR / レビュー」セクションのフォーマットに従う。

## Claude固有設定

- 権限・Hook・カスタムコマンド: `.claude/CLAUDE.md`を参照。
- Steering docs: `.agent/steering/`。
