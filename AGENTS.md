# Agent Guide (Digital Omikuji)

目的: このリポジトリで作業するコーディングエージェントが、最小の差分で安全に前進できるようにする。

## WHAT（地図）
- Stack:
  - Expo SDK 52 (Managed) / TypeScript
  - Expo Router v4
  - NativeWind v4
  - Moti (Reanimated)
- Layout:
  - app/: 画面・ルーティング
  - components/: 再利用 UI
  - hooks/: 抽選ロジックなどのフック
  - utils/: サウンド管理などのユーティリティ
  - assets/: 静的リソース
  - docs/: 詳細ドキュメント（必要なときだけ参照）
- Entrypoints:
  - app/: 画面の起点
  - hooks/: くじ抽選・状態管理の起点

## WHY（意図）
- Goal: 「新春のデジタルおみくじ」をシェイク/触覚/アニメで体験として成立させる。
- Architecture intent:
  - 画面 (app) と部品 (components) とロジック (hooks/utils) を分離して影響範囲を小さくする。
  - 実機依存（センサー/触覚/音）は Expo API で吸収し、UI から直接呼び出さない。
- Non-goals:
  - 無関係なリファクタ・命名祭り・整形だけの変更
  - “便利そう” という理由だけで新規技術を追加
  - “リンター家事”: 整形だけ、警告潰しだけ、スタイル統一だけの変更
  - 自動生成の乱用: 大量の雛形生成・無根拠なファイル追加
  - 管理外ファイルの編集: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`

## HOW（正解の検証）
- Fast checks:
  - pnpm start
  - pnpm test
- Build / CI parity:
  - pnpm build（必要なときだけ）
  - CI: .github/workflows/ を参照
- When unsure:
  - README → docs/ の順で一次情報を読む
  - 既存の実装パターンを優先し、一般論で上書きしない

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

- `main`/`develop` への直接コミットは禁止（例外なし）。必ず作業ブランチを切り、PR を経由して統合すること。
- 作業ブランチは `develop` から作成し、命名は `feature/`, `fix/`, `docs/`, `refactor/` を基本とする（並行タスクの worktree は 7. の `agent/<task-slug>` に従う）。
- hotfix は `main` から `hotfix/<summary>` を作成し、`main` に PR。マージ後は同内容を `develop` に戻す（cherry-pick か follow-up PR）。
- PR は原則 `develop` を base にして作成する（例外: リリースPRは `develop` → `main`、hotfix PR は `main` を base）。
- `develop` が開発メインブランチ。本番リリース時に `develop` → `main` へマージする。
- PR タイトル: `[feat|fix|docs|refactor] summary`
- PR 本文（日本語）: 目的 / 変更点 / テスト結果ログ / 影響範囲 / スクリーンショットや動画（UI 変更時）
- テスト必須: `pnpm test` を Green にする。
- レビュー: 少なくとも Copilot / Gemini / Codex にレビューを依頼する。**その際、AI エージェントとのやりとりや、チーム内メンバー同士のレビューコメントおよび対応は原則として日本語で行うこと。外部コントリビューターや日本語話者でないレビュワーは英語でコメントしてよいが、必要に応じてメンテナーが日本語の要約コメントを追記する。**

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
- **Antigravity**: `.antigravity/mission.md`（自律実行向けミッション定義）。
- `.agent/` 配下はエージェント設定と Skill 用の補助ファイルを格納する。

## 9. 参考

- プロジェクト構成: `app/`（画面）, `components/`（UI コンポーネント）, `docs/`（ドキュメント）。
- スクリーンショットやビルド成果物は必要に応じて PR に添付する。
