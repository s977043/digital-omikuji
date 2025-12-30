---
title: "プロジェクト構造・組織"
description: "ディレクトリ構成、命名規則、設定ファイルの配置、開発フローなど、プロジェクトの構造に関する規約を定義します。"
version: 1.1
last_updated: "2025-12-10"
target_audience: ["developer", "ai_agent"]
---

# プロジェクト構造・組織

## ディレクトリ構成

```
Digital Omikuji/
├── apps/                    # アプリケーション
│   └── web/                # Next.js PWAアプリ
│       ├── src/            # ソースコード
│       ├── public/         # 静的ファイル
│       ├── package.json    # 依存関係
│       └── vitest.config.ts # テスト設定
├── docs/                   # プロジェクトドキュメント
│   ├── ai/                 # AI関連ドキュメント
│   │   ├── CODEX.md       # Codex CLI使用方法
│   │   ├── COPILOT.md     # GitHub Copilot使用方法
│   │   └── GEMINI_USAGE.md # Gemini CLI使用方法
│   ├── development/        # 開発ガイド
│   ├── operations/         # 運用ガイド
│   └── archive/           # 過去資料
├── specs/                  # 機能仕様テンプレート
│   └── feature-template/   # 仕様書テンプレート
├── steering/               # プロダクト方針（全AI共通）
│   ├── product.md         # プロダクト概要
│   ├── tech.md            # 技術スタック
│   ├── development.md     # 開発フロー
│   └── structure.md       # プロジェクト構造
├── scripts/                # ユーティリティスクリプト
│   ├── setup-git-hooks.sh # Git Hooks設定
│   ├── ai-code-review.sh  # AIレビュー
│   └── build-*.sh         # AI設定ビルド
├── .github/                # GitHub設定
│   ├── workflows/         # CI/CDパイプライン
│   └── PULL_REQUEST_TEMPLATE/ # PRテンプレート
├── .kiro/                  # Kiro専用
│   ├── specs/             # 実案件仕様書
│   ├── settings/          # Kiro設定
│   └── hooks/             # 自動化フック
├── .codex/                 # Codex CLI設定
├── .gemini/                # Gemini CLI設定
├── GEMINI.md               # Gemini CLIコンテキスト（ルート必須）
├── KIRO.md                 # Kiroコンテキスト（ルート推奨）
└── AGENTS.md               # AI統合ガイド
```

## アプリケーション構造（apps/web/）

```
apps/web/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/       # 認証関連ページ
│   │   ├── (dashboard)/  # ダッシュボード
│   │   ├── globals.css   # グローバルスタイル
│   │   ├── layout.tsx    # ルートレイアウト
│   │   └── page.tsx      # ホームページ
│   ├── components/        # 再利用可能コンポーネント
│   │   ├── ui/           # UIコンポーネント
│   │   └── features/     # 機能別コンポーネント
│   ├── lib/              # ユーティリティ・設定
│   │   ├── supabase.ts   # Supabase設定
│   │   ├── utils.ts      # 汎用ユーティリティ
│   │   └── types.ts      # 型定義
│   ├── hooks/            # カスタムフック
│   └── __tests__/        # テストファイル
├── public/               # 静的ファイル
│   ├── icons/           # PWAアイコン
│   └── manifest.json    # PWAマニフェスト
└── package.json         # アプリ依存関係
```

## 命名規則

### ファイル・ディレクトリ

- **コンポーネント**: PascalCase (`UserProfile.tsx`)
- **ページ**: kebab-case (`user-profile/page.tsx`)
- **ユーティリティ**: camelCase (`formatDate.ts`)
- **定数**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **型定義**: PascalCase (`UserType.ts`)

### コード内

- **変数・関数**: camelCase (`userName`, `getUserData`)
- **型・インターフェース**: PascalCase (`User`, `UserProfile`)
- **定数**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **コンポーネント**: PascalCase (`UserCard`)

## 設定ファイル配置

### AI 設定

- `.codex/` - Codex CLI 設定とプロンプト
- `.gemini/` - Gemini CLI 設定とコンテキスト
- `.kiro/` - Kiro 仕様書とステアリング
- `GEMINI.md` - Gemini CLI が自動読み込み（ルート必須）
- `KIRO.md` - Kiro コンテキスト（ルート推奨）
- `AGENTS.md` - AI 統合ガイド

### 開発設定

- `tsconfig.json` - TypeScript 設定（ルート）
- `apps/web/tsconfig.json` - アプリ固有 TypeScript 設定
- `.eslintrc.json` - ESLint 設定
- `.prettierrc` - Prettier 設定

## 仕様書管理

### テンプレート（specs/）

```
specs/feature-template/
├── requirements.md  # 要件定義テンプレート
├── design.md       # 設計テンプレート
└── tasks.md        # タスクテンプレート
```

### 実案件（.kiro/specs/）

```
.kiro/specs/<feature-name>/
├── requirements.md  # 具体的要件定義
├── design.md       # 具体的設計
└── tasks.md        # 具体的タスク分解
```

## ドキュメント管理

### 役割分担

- **steering/** - プロダクト方針（全 AI 共通、Kiro が自動読み込み）
- **docs/ai/** - AI 使用方法（人間向け参照用）
- **docs/development/** - 開発ガイド
- **docs/operations/** - 運用ガイド
- **.kiro/specs/** - 実案件仕様（Kiro 専用）

### 更新ルール

- `steering/` 更新時は `.kiro/steering/` も同期（Kiro 互換性維持）
- AI 設定ドキュメント（`docs/ai/`）は参照用のため移動可能
- `GEMINI.md` はルート配置必須（技術的制約）

## 開発フロー・ファイル操作

### 新機能開発

1. **仕様作成**: `.kiro/specs/<feature>/` に要件・設計・タスク
2. **ブランチ作成**: `feature/<feature-name>`
3. **実装**: `apps/web/src/` 配下に実装
4. **テスト**: `__tests__/` にテスト追加
5. **PR 作成**: テンプレート使用

### 変更禁止ファイル

- `**/*.lock` - ロックファイル（pnpm-lock.yaml 等）
- `.env*` - 環境変数ファイル（.env.example 除く）
- `node_modules/` - 依存関係
- `.git/` - Git 内部ファイル
- `docs/generated/` - 自動生成ドキュメント

### 変更推奨ファイル

- `apps/web/src/` - アプリケーションコード
- `__tests__/` - テストコード
- `docs/*.md` - ドキュメント
- `.kiro/specs/` - 仕様書
- `README.md` - プロジェクト説明

## モノレポ運用

### パッケージ管理

- **ルート**: 共通設定・スクリプト
- **apps/web**: メインアプリケーション
- `**/*.lock` - ロックファイル（package-lock.json 等）
- `**/node_modules/` - 依存パッケージ

### 依存関係の追加

```bash
# プロジェクト全体への追加
npm install <package>

# 開発用依存関係
npm install -D <package>
```

## アーキテクチャ原則

### レイヤー構造

- **UI 層**: components/, app/ - ユーザーインターフェース
- **ビジネス層**: hooks/, lib/ - ビジネスロジック
- **データ層**: lib/supabase.ts - データアクセス

### 依存関係の方向

```
UI層 → ビジネス層 → データ層
```

### ファイル分割基準

- **50 行以下**: 1 ファイル推奨
- **100 行超**: 分割検討
- **200 行超**: 必須分割

## 品質管理

### 必須チェック

- TypeScript 型エラー 0 件
- ESLint エラー 0 件
- テスト通過率 100%
- ビルドエラー 0 件

### 推奨基準

- ファイルサイズ: 200 行以下
- 関数サイズ: 20 行以下
- テストカバレッジ: 80%以上
- コンポーネント単一責任
