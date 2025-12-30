---
title: "プロジェクト構造・組織"
description: "ディレクトリ構成、命名規則、設定ファイルの配置、開発フローなど、プロジェクトの構造に関する規約を定義します。"
version: 2.0
last_updated: "2025-12-31"
target_audience: ["developer", "ai_agent"]
---

# プロジェクト構造・組織

## ディレクトリ構成

```
Digital Omikuji/
├── app/                    # Expo Router エントリーポイント & ルーティング
│   ├── _layout.tsx        # グローバルレイアウト
│   └── index.tsx          # メイン画面
├── components/            # UIコンポーネント (Presentational)
│   └── ui/               # 汎用UIパーツ
├── constants/             # 定数定義
│   └── OmikujiData.ts    # データの定義
├── hooks/                 # カスタムフック (Business Logic)
├── utils/                 # ユーティリティ関数
├── assets/               # 静的アセット
│   ├── images/           # 画像
│   └── sounds/           # 効果音
├── docs/                 # プロジェクトドキュメント
│   └── DEVELOPER.md      # 開発者ガイド
├── .agent/               # AIエージェント設定 (本ディレクトリ)
│   ├── agents/           # エージェント定義
│   ├── steering/         # プロジェクト方針
│   └── skills/           # スキル定義
├── .github/              # GitHub設定
│   ├── workflows/        # CI/CD
│   └── copilot-instructions.md # Copilot指示書
├── app.json              # Expo設定
├── tailwind.config.js    # NativeWind/Tailwind設定
└── package.json          # 依存関係定義
```

## 命名規則

### ファイル・ディレクトリ

- **コンポーネント**: PascalCase (`FortuneDisplay.tsx`)
- **ページ**: Expo Router の規則に従う (`index.tsx`, `[id].tsx`)
- **フック**: camelCase (`useOmikujiLogic.ts`)
- **定数・型**: PascalCase (`OmikujiData.ts`) または camelCase
- **アセット**: snake_case または camelCase

### コード内

- **コンポーネント**: PascalCase (`const FortuneDisplay = ...`)
- **変数・関数**: camelCase (`const handleClick = ...`)
- **定数**: UPPER_SNAKE_CASE (`const MAX_RETRY = 3`)
- **型・インターフェース**: PascalCase (`interface UserProfile`)

## 開発フロー・ファイル操作

### 新機能開発

1. **Issue/Task**: タスクを確認または作成
2. **ブランチ作成**: `feature/<feature-name>`
3. **実装**:
   - `app/` に画面追加
   - `components/` に UI 部品追加
   - `hooks/` にロジック追加
4. **テスト**: Unit/Component テストの追加 (`__tests__` または同階層の `*.test.tsx`)
5. **PR 作成**: CI 通過を確認して PR 作成

### 変更禁止・注意ファイル

- `package-lock.json`: 手動編集禁止 (npm 経由で更新)
- `.agent/`: プロジェクトの AI 設定の核心部分のため、意図した変更以外は慎重に

## パッケージ管理

**npm** を使用します。

### 依存関係の追加

```bash
# プロジェクト全体への追加
npm install <package>

# 開発用依存関係
npm install -DL <package>
```

### Expo 関連コマンド

```bash
# 開発サーバー起動
npx expo start

# キャッシュクリア起動
npx expo start -c
```

## アーキテクチャ原則

### レイヤー構造

- **UI 層**: `app/`, `components/` - 表示責務。NativeWind によるスタイリング。
- **ロジック層**: `hooks/` - 状態管理、副作用、ビジネスロジック。
- **データ・定数層**: `constants/`, `utils/` - 静的データ、純粋関数。

### コンポーネント設計

- **Atomic Design** を厳密には適用しないが、`components/ui` (atoms/molecules 相当) と `components` (organisms 相当) の分離を意識する。
- ロジックは可能な限り `hooks` に切り出し、View コンポーネントを薄く保つ。
