# AGENTS.md — Digital Omikuji Canonical Guide

Digital Omikuji での開発ルールを一元管理する正本です。Copilot / Claude / Gemini / Codex など、すべてのエージェントと人間開発者はこのファイルを参照してください。

## 1. スコープと禁止事項

- 本ファイルの指示はリポジトリ全体に適用されます。
- 編集禁止: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`（秘密情報の追加・コミットは禁止）。

## 2. 技術スタックの要点

- Expo SDK 52（Managed）, Expo Router v4。
- スタイル: NativeWind v4（React Native コンポーネントに `className` を使用）。
- アニメーション: Moti（Reanimated）。
- 言語: TypeScript（strict）。

## 3. セットアップ & 共通コマンド（pnpm 前提）

- 依存導入: `pnpm install`
- 開発サーバー: `pnpm start`
- テスト: `pnpm test`
- ビルド(Web): `pnpm build`
- Lint: `pnpm lint`（設定がある場合）

## 4. ワークフロー（AI-SDD / AI-TDD）

- **計画先行**: 着手前にタスク計画をまとめ、小さな変更単位で進める。
- **テストファースト**: 可能な限りテストを追加・更新してから実装する。
- **エビデンス**: PR には実行したテスト結果ログを必ず添付する。
- **例外処理**: 外部 API 呼び出しでは例外処理を入れる。インポートに try/catch は使わない。

## 5. コーディング規約

- 命名: 変数/関数は camelCase、コンポーネントは PascalCase。
- React: Functional Component + Hooks を基本とし、NativeWind の `className` を活用。
- TypeScript: `any` 回避、型を明示。バレル（`index.ts` 一括 export）は必要最小限のみ。

## 6. ブランチ / PR / レビュー

- 原則として `main`/`develop` への直接コミットは禁止。作業ブランチは `develop` から切って PR で統合する。
- `develop` が開発メインブランチ。本番リリース時に `develop` → `main` へマージする。
- PR タイトル: `[feat|fix|docs|refactor] summary`
- PR 本文（日本語）: 目的 / 変更点 / テスト結果ログ / 影響範囲 / スクリーンショットや動画（UI 変更時）
- テスト必須: `pnpm test` を Green にする。
- レビュー: 少なくとも Copilot / Gemini / Codex にレビューを依頼する。

## 7. 並行タスクは Git Worktree で分離する

### 目的

- 複数タスクを同時進行しても、作業ディレクトリとブランチを完全に分離し、コンテキスト混乱と手戻りを減らす
- 1 つのリポジトリに複数の作業ツリーを持てる Git worktree を標準手段とする

### 基本ルール

- 並行実行できるタスクが 2 つ以上ある場合、まず「並行計画」を提示し、並行で進めてよいか確認する
- ユーザーが「並行で OK」と回答したら、以降は確認を挟まずに worktree を作って自律的に進める（ユーザーが停止や順次実行を指示したら従う）
- worktree では同一ブランチを複数 worktree で同時チェックアウトできない制約があるため、タスクごとに専用ブランチを切る
- main worktree は統合作業（テスト、マージ、最終調整）に寄せ、各タスクは linked worktree で行う

### 並行実行の判断基準

#### 並行に向く

- 変更範囲が分離している（例: 機能実装 と ドキュメント、UI と バックエンドなど）
- 探索的作業や長時間タスクをサンドボックス化したい

#### 並行を避ける

- 同じファイル群を大きく触る見込み（マージ衝突が高確率）
- 1 つの PR として一体でレビューされるべき変更

### 確認メッセージのテンプレ

> 並行で進められるタスクが見えました。次の分割で worktree を作って並行実行してよいですか。
>
> - Task A: <要約> → worktree: `.worktrees/<slug-a>` / branch: `agent/<slug-a>`
> - Task B: <要約> → worktree: `.worktrees/<slug-b>` / branch: `agent/<slug-b>`
>
> 返答は「並行で OK」か「順番に」でお願いします。

### Worktree 運用規約

| 項目             | 規約                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| 置き場           | リポジトリ直下に `.worktrees/` を作り、タスクごとにサブディレクトリを切る（命名は短く一意） |
| ブランチ命名     | `agent/<task-slug>`（タスク単位で必ず分ける）                                               |
| 作成コマンド     | `git worktree add -b agent/<task-slug> .worktrees/<task-slug> <base-branch>`                |
| 既存ブランチ割当 | `git worktree add .worktrees/<task-slug> <branch>`                                          |
| 使い捨て検証     | ブランチ無しの detached worktree も可                                                       |

### クリーンアップ

- タスク完了後は worktree を削除する

  ```bash
  git worktree remove .worktrees/<task-slug>
  ```

- ディレクトリだけ消してしまった等でメタデータが残ったら prune する

  ```bash
  git worktree prune
  ```

### 進め方の標準

- 各 worktree は「そのタスクの完了に必要な最小変更」に集中する
- こまめにコミットし、main worktree 側で差分確認と統合を行う

## 8. エージェント別エントリーポイント

- **Copilot**: `.github/copilot-instructions.md`（本ファイルを前提に、Copilot 向け要点のみ記載）。
- **Claude Code**: `CLAUDE.md`（共通ルール参照を前提にした薄いラッパー）。
- **Gemini**: `GEMINI.md`（共通ルール参照を前提にした薄いラッパー）。
- **Codex CLI**: `codex.md`（共通ルール参照。Skill は `.agent/skills/` を参照）。
- `.agent/` 配下はエージェント設定と Skill 用の補助ファイルを格納する。

## 9. 参考

- プロジェクト構成: `app/`（画面）, `components/`（UI コンポーネント）, `docs/`（ドキュメント）。
- スクリーンショットやビルド成果物は必要に応じて PR に添付する。
