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

## 運用体制（エージェント分担）

- **Claude Code = メイン実装**: 要件整理・実装・テスト・docs更新・Androidビルド準備を担う。
- **Codex = サブレビュー**: 着手前の計画レビュー、PR前の差分レビューを担う。広範囲の変更前は計画をCodexレビューに回す。
- 事実・手順・DoDは`AGENTS.md`および[`docs/goals/android-release-readiness.md`](./docs/goals/android-release-readiness.md)を参照（本ファイルは振る舞いのみ）。

## 現在の優先方針

- 現マイルストーンは**Android Google Play 公開準備**。新機能追加より公開準備を優先する。
- 以下はOut of Scope。明示指示がない限り着手しない: iOS公開 / 課金 / 広告 / 大規模新機能 / AI鑑定文生成 / Web版大幅改修。
- 本番package名`com.s977043.digitalomikuji`は確定。**公開後は変更不可**のため、package名を変える変更は必ず確認を取る。

## 報告方針

- `AGENTS.md`「ブランチ / PR / レビュー」セクションのフォーマットに従う。

## Claude固有設定

- 権限・Hook・カスタムコマンド: `.claude/CLAUDE.md`を参照。
- Steering docs: `.agent/steering/`。
