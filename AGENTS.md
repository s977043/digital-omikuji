---
description: "コーディングエージェントのための統合開発ガイド — SSOT"
version: "4.0"
last_updated: "2026-04-08"
target_audience: ["ai_agent", "developer"]
status: "active"
---

# Agent Guide（Digital Omikuji）

目的: このリポジトリで作業するコーディングエージェントが、最小の差分で安全に前進できるようにする。
**言語**: エージェントとのやり取り、思考ログ、PRの記述、コミットメッセージ等は原則として日本語を使用する。

> **責務分担**: 本ファイルはリポジトリの「事実・手順・構成・完了条件」を定義するSSOT。
> エージェントの「振る舞い・判断基準・制約」は各エージェント固有ファイル（`CLAUDE.md`, `GEMINI.md`等）に記載する。
> 詳細: `.agent/steering/development.md`。

---

## 1. WHAT（地図）

- Stack:
  - Expo SDK 54（Managed）/ TypeScript
  - React 19 / React Native 0.84
  - Expo Router
  - NativeWind v4
  - Moti（Reanimated v4）
- Layout:
  - `app/`: 画面・ルーティング
  - `components/`: 再利用UI
  - `hooks/`: 抽選ロジックなどのフック
  - `utils/`: サウンド管理などのユーティリティー
  - `assets/`: 静的リソース
  - `docs/`: 詳細ドキュメント（`guides/` / `project/` / `design/` / `design-system/`に分類）
- Entrypoints:
  - `app/`: 画面の起点
  - `hooks/`: くじ抽選・状態管理の起点

## 2. WHY（意図）

- Goal:「新春のデジタルおみくじ」をシェイク/触覚/アニメで体験として成立させる。
- Architecture intent:
  - 画面（`app`）と部品（`components`）とロジック（`hooks`/`utils`）を分離して影響範囲を小さくする。
  - 実機依存（センサー/触覚/音）はExpo APIで吸収し、UIから直接呼び出さない。
- Non-goals:
  - 無関係なリファクタリング・命名祭り・整形だけの変更
  - "便利そう"という理由だけで新規技術を追加
  - "リンター家事": 整形だけ、警告潰しだけ、スタイル統一だけの変更
  - 自動生成の乱用: 大量の雛形生成・無根拠なファイル追加
  - 管理外ファイルの編集: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`

## 3. HOW（正解の検証）

- Fast checks:
  - `pnpm start`
  - `pnpm test`
- Build / CI parity:
  - `pnpm build`（必要なときだけ）
  - CI: `.github/workflows/`を参照
  - セルフレビュー: `docs/guides/SELF_REVIEW_CHECKLIST.md`
- When unsure:
  - `README` → `DESIGN.md` → `docs/design-system/` → `docs/design/design_guidelines.md` → `docs/guides/`の順で一次情報を読む
  - 既存の実装パターンを優先し、一般論で上書きしない

## 4. セットアップ & 共通コマンド

パッケージマネージャーは`pnpm`（`npm`ではない）。

| 操作                     | コマンド               |
| ------------------------ | ---------------------- |
| 依存導入                 | `pnpm install`         |
| 開発サーバー             | `pnpm start`           |
| テスト                   | `pnpm test`            |
| カバレッジ               | `pnpm test:coverage`   |
| ビルド（Web）            | `pnpm build`           |
| Lint                     | `pnpm lint`            |
| Lint自動修正             | `pnpm lint:fix`        |
| Markdown Lint            | `pnpm lint:md`         |
| E2Eテスト（Web）         | `pnpm test:e2e:web`    |
| 全品質チェック（CI相当） | `pnpm ci:check`        |
| スキル検証               | `pnpm validate:skills` |

> E2E（Web）の初回実行時は `pnpm exec playwright install` でブラウザを取得しておく。`pnpm test:e2e:web` は内部で `pnpm build` → `pnpm exec serve` を起動するため、コールドビルドでは数分かかる（詳細は `playwright.config.ts` の `webServer.timeout` 設定を参照）。

## 5. ワークフロー（AI-SDD / AI-TDD）

- **計画先行**: 着手前にタスク計画をまとめ、小さな変更単位で進める。
- **テストファースト**: 可能な限りテストを追加・更新してから実装する。
- **エビデンス**: PRには実行したテスト結果ログを必ず添付する。
- **例外処理**: 外部API呼び出しでは例外処理を入れる。インポートにtry/catchは使わない。

## 6. コーディング規約

- 命名: 変数/関数はcamelCase、コンポーネントはPascalCase。
- React: Functional Component + Hooksを基本とし、NativeWindの`className`を活用。
- TypeScript: `any`回避、型を明示。バレル（`index.ts`一括export）は必要最小限のみ。

## 7. ブランチ / PR / レビュー

### ブランチ戦略

- `main`/`develop`への直接コミットは禁止（例外なし）。必ず作業ブランチを切り、PRを経由して統合すること。
- 作業ブランチは`develop`から作成する。
  - **通常作業**: `feature/`, `fix/`, `docs/`, `refactor/`を基本とする。
  - **Worktreeによる並行タスク**: `agent/<task-slug>`を使う（「並行タスク」セクション参照）。
- hotfixは`main`から`hotfix/<summary>`を作成し、`main`にPR。マージ後は同内容を`develop`に戻す（cherry-pickかfollow-up PR）。
- `develop`が開発メインブランチ。本番リリース時に`develop` → `main`へマージする。

### PRルール

- PRは原則`develop`をbaseにして作成する（例外: リリースPRは`develop` → `main`、hotfix PRは`main`をbase）。
- PRタイトル: `[feat|fix|docs|refactor] summary`
- PR本文（日本語）: 目的 / 変更点 / テスト結果ログ / 影響範囲 / スクリーンショットや動画（UI変更時）

### レビュー

- テスト必須: `pnpm test`をGreenにする。
- 少なくともCopilot / Gemini / Codexにレビューを依頼する。
- AIエージェントとのやりとりやレビューコメントは原則として日本語で行う。外部コントリビューターは英語でコメントしてよいが、必要に応じてメンテナーが日本語の要約コメントを追記する。

### PRマージ前チェックリスト

- [ ] `pnpm test`がGreen
- [ ] `pnpm lint`が通過
- [ ] PRタイトルが`[feat|fix|docs|refactor] summary`形式
- [ ] PR本文に目的・変更点・テスト結果ログ・影響範囲を記載
- [ ] UI変更時はスクリーンショットまたは動画を添付
- [ ] Copilot / Gemini / Codexのいずれかにレビュー依頼済み
- [ ] `develop`をbaseにしている（例外: release PR, hotfix PR）

### dependabot 大量PRの消化（ランブック）

dependabot PR が複数滞留している場合、**1件ずつ手動マージしない**。1件マージするたび他PRの`pnpm-lock.yaml`が競合(DIRTY)化し、`recreate`待ち→再競合の往復で時間を浪費する。

1. まず CI グリーンかつ`CLEAN`のものだけ先にマージする。
2. 残りは個別にpollせず、`gh pr merge <n> --auto --squash --delete-branch`で**auto-merge**を仕掛ける（`.github/workflows/dependabot-auto-merge.yml`がminor/patchを自動処理）。
3. `DIRTY`なものは`@dependabot recreate`をコメントし、auto-mergeに任せて放置する。
4. CIが恒久的に失敗するもの（破壊的メジャー、非互換bump）はマージせず**理由付きでクローズ**する（例: SDK非互換の`expo-router`メジャー）。
5. dependabotが無反応で最後の1件が`DIRTY`なら、worktreeで`git merge origin/develop`→`pnpm install --lockfile-only`→pushして手動解決する。

### gh CLI 複数アカウント運用での push

このリポジトリは push 権限が特定アカウント（例: `s977043`）に限定される。複数アカウントを`gh auth`に登録している場合の注意:

- `gh auth token`は**非アクティブ垢のトークンを返すことがある**。push用は必ず`gh auth token --user <push権限垢>`で取得する。
- `/tmp`配下のworktreeはgit credential helperを継承せず`could not read Password`で失敗する。
  - **推奨**: `gh auth switch --user <push権限垢> && gh auth setup-git` 後に通常の`git push`。gh のcredential helper経由でトークンが解決され、シェル履歴・プロセス一覧にトークンが残らない。
  - 一時的に解決したい場合は credential helper をその場で渡す:
    `git -c credential.helper='!f(){ echo username=x-access-token; echo "password=$(gh auth token --user <垢>)"; };f' push origin <branch>`
  - **非推奨**: `https://x-access-token:<token>@github.com/...` のトークンURL直書き。シェル履歴・`ps`・reflog 等にトークンが露出するため使わない。
- `.claude/worktrees/`配下のworktreeは親リポジトリの認証を継承するため通常pushでよい。

## 8. 並行タスク（Git Worktree）

### 目的

- 複数タスクを同時進行しても、作業ディレクトリーとブランチを完全に分離し、コンテキスト混乱と手戻りを減らす
- 1つのリポジトリーに複数の作業ツリーを持てるGit Worktreeを標準手段とする

### 基本ルール

- **ブランチ切り替えよりWorktreeを優先**: 作業中に別ブランチへ移動する必要がある場合、`git stash` + `git checkout`ではなく`git worktree add`を使う。これにより作業中の変更を失うリスクを減らし、複数タスクを安全に並行できる
- 並行実行できるタスクが2つ以上ある場合、まず「並行計画」を提示し、並行で進めてよいか確認する
- ユーザーが「並行でOK」と回答したら、以降は確認を挟まずにWorktreeを作って自律的に進める（ユーザーが停止や順次実行を指示したら従う）
- Worktreeでは同一ブランチを複数Worktreeで同時チェックアウトできない制約があるため、タスクごとに専用ブランチを切る
- main Worktreeは統合作業（テスト、マージ、最終調整）に寄せ、各タスクはlinked Worktreeで行う

### 並行実行の判断基準

#### 並行に向く

- 変更範囲が分離している（例: 機能実装とドキュメント、UIとバックエンドなど）
- 探索的作業や長時間タスクをサンドボックス化したい

#### 並行を避ける

- 同じファイル群を大きく触る見込み（マージ衝突が高確率）
- 1つのPRとして一体でレビューされるべき変更

### 確認メッセージのテンプレ

> 並行で進められるタスクが見えました。次の分割でWorktreeを作って並行実行してよいですか。
>
> - Task A: \<要約\> → worktree: `.worktrees/<slug-a>` / branch: `agent/<slug-a>`
> - Task B: \<要約\> → worktree: `.worktrees/<slug-b>` / branch: `agent/<slug-b>`
>
> 返答は「並行でOK」か「順番に」でお願いします。

### Worktree運用規約

| 項目             | 規約                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| 置き場           | リポジトリー直下に`.worktrees/`を作り、タスクごとにサブディレクトリーを切る（命名は短く一意） |
| ブランチ命名     | `agent/<task-slug>`（タスク単位で必ず分ける）                                                 |
| 作成コマンド     | `git worktree add -b agent/<task-slug> .worktrees/<task-slug> <base-branch>`                  |
| 既存ブランチ割当 | `git worktree add .worktrees/<task-slug> <branch>`                                            |
| 使い捨て検証     | ブランチ無しのdetached Worktreeも可                                                           |

### クリーンアップ

- タスク完了後はWorktreeを削除する

  ```bash
  git worktree remove .worktrees/<task-slug>
  ```

- ディレクトリーだけ消してしまった等でメタデータが残ったらpruneする

  ```bash
  git worktree prune
  ```

### 進め方の標準

- 各Worktreeは「そのタスクの完了に必要な最小変更」に集中する
- こまめにコミットし、main Worktree側で差分確認と統合を行う

## 9. エージェント別エントリーポイント

| エージェント | 固有ファイル                      | 責務                         |
| ------------ | --------------------------------- | ---------------------------- |
| Copilot      | `.github/copilot-instructions.md` | Copilot向け要点              |
| Claude Code  | `CLAUDE.md` + `.claude/CLAUDE.md` | 作業方針 + 技術設定          |
| Gemini       | `GEMINI.md`                       | 自律化モード設定             |
| Codex CLI    | `.codex/codex.md`                 | Kickoffプロンプト + 環境制限 |
| Antigravity  | `.antigravity/mission.md`         | 自律実行ミッション定義       |

- `.agent/`配下はエージェント設定とSkill用の補助ファイルを格納する。
- **Agent Skills**: `.agent/skills/`にAIエージェントの知識を拡張する`SKILL.md`を配置する。
- **AI Design Agents Overlay**: `.agent/ai-design-agents/`にUI / UX / Frontend / Design System / Accessibility / QA / Performance / Content / Architecture / Quality / Productionの11体構成ひな形を配置する。既存`.agent/agents/`を置き換えるものではなく、専門レビュー用の補助レイヤーとして扱う。
- UI実装やUIレビューでは`DESIGN.md`を入口として読み、詳細なtoken/component契約は`docs/design-system/`、ムードと表現の補助線は`docs/design/design_guidelines.md`を参照する。

## 10. Browser Automation（agent-browser）

- いつ使うか: 実際の画面挙動確認、フォーム操作、スクショ取得が必要なとき（DOMだけでは不安な場合）。
- 基本手順: `open <url>` → `snapshot -i`でref（@e1…）を取る → refで`click/fill/type` → 画面が変わったら再`snapshot` → `wait`（`--load networkidle`等）で安定化 → `screenshot` → `close`。
- セレクターはref優先（CSSは最後の手段）。詳細は`.agent/skills/agent-browser/SKILL.md`を参照。

## 11. エージェントスキルの管理

### 構成

- スキル定義: `.agent/skills/<skill-name>/SKILL.md`
- スキル一覧: `.agent/skills/`配下
- 専門レビュー用スキル群: `.agent/ai-design-agents/skills/<skill-name>/SKILL.md`

### 11体構成オーバーレイの扱い

- `.agent/ai-design-agents/`は、既存の汎用スキルやペルソナに対して、UI / UX / 品質 / 運用のレビュー観点を補うためのひな形として扱う
- 新画面追加やUI改善では`ui-manager`, `ux-manager`, `frontend-manager`, `design-system-manager`を優先して使う
- リリース前確認では`qa-ui-test-manager`, `quality-manager`, `performance-manager`, `production-manager`を組み合わせる
- 詳細な使い分けは`.agent/ai-design-agents/usage-guide.md`を参照する

### 新規スキルの追加手順

1. 汎用スキルは`.agent/skills/`、11体構成オーバーレイ用スキルは`.agent/ai-design-agents/skills/`配下に新しいディレクトリーを作成する。
2. `SKILL.md`を作成し、スキルの説明と具体的な指示を記述する。
3. `.agent/skills/CHECKLIST.md`または`.agent/ai-design-agents/skills/CHECKLIST.md`を必ず参照する。
4. `pnpm validate:skills`を実行し、必要ならMarkdown Lintも通す。
5. PR段階でエージェントに「新しいスキルを試して」と指示し、動作を確認する。

## 12. テスト環境（Jest 30 + Reanimated v4）

### 概要

- Jest 30 + jest-expoを使用
- Reanimated v4はworkletsエンジンを必要とするため、Node.js環境では適切なモックが必須

### 必須設定

#### jest.setup.js

```javascript
// react-native-workletsのモック（Reanimated v4より前に定義必須）
jest.mock("react-native-worklets", () => ({
  init: jest.fn(),
  Worklets: { createRunInContext: jest.fn(), createContext: jest.fn() },
  createSerializable: (val) => val,
  isWorklet: () => false,
  isWorkletCallable: () => false,
  WorkletsError: class extends Error {},
  serializableMappingCache: new Map(),
  scheduleOnUI: (fn) => fn,
  scheduleOnRN: (fn) => fn,
}));

// 公式セットアップを使用
require("react-native-reanimated").setUpTests();
```

#### jest.config.js（pnpm対応）

```javascript
transformIgnorePatterns: [
  "node_modules/(?!(.pnpm|react-native|@react-native|expo|@expo|moti|react-native-reanimated|react-native-css-interop|react-native-worklets|react-native-worklets-core|@react-native-community|@testing-library))"
],
```

### 非同期テストのパターン

React 19では状態更新の非同期処理が変更されたため、以下のパターンを使用:

```typescript
// NG: 同じact内でリセットとドローを実行
await act(async () => {
  await result.current.debugResetDailyLimit();
  await result.current.drawFortune();
});

// OK: 別々のactブロックに分離し、waitForで待機
await act(async () => {
  await result.current.debugResetDailyLimit();
});
await act(async () => {
  await result.current.drawFortune();
});
await waitFor(() => {
  expect(result.current.fortune).not.toBeNull();
});
```

### トラブルシューティング

| エラー                                                      | 原因                               | 解決策                                                 |
| ----------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| `WorkletsError: Native part doesn't seem initialized`       | workletsモック不足                 | `jest.setup.js`でworkletsをReanimatedより先にモック    |
| `SyntaxError: Cannot use import statement outside a module` | ESM変換漏れ                        | `transformIgnorePatterns`にパッケージを追加            |
| テストが不安定（flaky）                                     | 非同期状態更新の競合               | `act()`を分離し`waitFor()`を使用                       |
| `Git command failed: stdout maxBuffer length exceeded`      | diffが大きすぎる（River Reviewer） | `river-reviewer/src/lib/git.mjs`の`maxBuffer`を拡大    |
| CIで`River Reviewer`が失敗する                              | サブモジュールの更新漏れ           | サブモジュールをプッシュし、親リポジトリーで参照を更新 |

## 13. サブモジュール（river-reviewer）

- `river-reviewer/`はGitサブモジュールとして管理
- 変更手順:
  1. サブモジュール内でコミット・プッシュ
  2. 親リポジトリーでサブモジュール参照を更新してコミット

```bash
cd river-reviewer
git checkout main && git pull
# 変更を加える
git add . && git commit -m "fix: ..." && git push
cd ..
git add river-reviewer && git commit -m "chore: update river-reviewer"
```

## 14. 参考

- プロジェクト構成: `app/`（画面）, `components/`（UIコンポーネント）, `docs/`（ドキュメント）。
- 詳細なドキュメント構成:
  - `docs/guides/`: 開発者およびユーザー向けガイド
  - `docs/project/`: プロジェクト管理、メタ情報
  - `docs/design/`: デザインガイドライン
- ルートの`DESIGN.md`: UI世界観と読む順番を案内する入口ドキュメント
- `docs/design-system/`: token/component契約のSSOT
- `docs/design/design_guidelines.md`: ムード・配色・余白などの実装補助ガイド（実装ベースのデザイン判断SSOT）
- スクリーンショットやビルド成果物は必要に応じてPRに添付する。
