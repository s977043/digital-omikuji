# VibeCoding設定ガイド

## 概要

VibeCoding は、開発者の生産性を向上させるための統合開発環境です。このドキュメントでは、digital-omikuji プロジェクトで VibeCoding を使用するための設定方法について説明します。

## 前提条件

- Node.js 18 以上
- npm または yarn
- Docker および Docker Compose
- Gemini CLI がインストールされていること

## インストール手順

### 1. VibeCoding の設定ファイル作成

プロジェクトルートに `.vibeconfig.json` を作成：

```json
{
  "project": {
    "name": "digital-omikuji",
    "type": "remix",
    "language": "typescript"
  },
  "ai": {
    "provider": "gemini",
    "model": "gemini-pro",
    "temperature": 0.7
  },
  "development": {
    "server": {
      "port": 3000,
      "host": "localhost"
    },
    "hotReload": true,
    "sourceMap": true
  },
  "build": {
    "target": "es2020",
    "sourcemap": true,
    "minify": false
  },
  "testing": {
    "framework": "jest",
    "coverage": true,
    "watchMode": true
  }
}
```

### 2. 環境変数の設定

`.env.local` ファイルを作成：

```bash
# Gemini API設定
GEMINI_API_KEY=your-gemini-api-key-here

# VibeCoding設定
VIBE_PROJECT_ID=digital-omikuji
VIBE_WORKSPACE=/home/runner/work/digital-omikuji/digital-omikuji

# 開発環境設定
NODE_ENV=development
PORT=3000
```

### 3. package.json にスクリプトを追加

```json
{
  "scripts": {
    "vibe:start": "vibe-coding start",
    "vibe:build": "vibe-coding build",
    "vibe:dev": "vibe-coding dev --watch",
    "vibe:test": "vibe-coding test --coverage",
    "vibe:lint": "vibe-coding lint --fix",
    "vibe:format": "vibe-coding format"
  }
}
```

## 設定のカスタマイズ

### コード生成設定

```json
{
  "codeGeneration": {
    "templates": {
      "component": "templates/component.tsx",
      "test": "templates/test.tsx"
    },
    "naming": {
      "convention": "PascalCase",
      "suffix": {
        "component": "Component",
        "test": "Test"
      }
    }
  }
}
```

### AI アシスタント設定

```json
{
  "assistant": {
    "autoSuggest": true,
    "codeReview": true,
    "documentation": true,
    "refactoring": true,
    "languages": ["typescript", "javascript", "jsx", "tsx"]
  }
}
```

## 使用方法

### 1. 開発サーバーの起動

```bash
npm run vibe:dev
```

### 2. コード生成

```bash
# 新しいコンポーネントの生成
vibe generate component MyComponent

# テストファイルの生成
vibe generate test MyComponent
```

### 3. AI アシスタントの使用

```bash
# コードレビューの実行
vibe review --file src/components/MyComponent.tsx

# リファクタリングの提案
vibe refactor --optimize --file src/components/MyComponent.tsx
```

## トラブルシューティング

### よくある問題と解決方法

1. **API キーエラー**
   - `.env.local` でGemini APIキーが正しく設定されているか確認
   - APIキーの権限を確認

2. **ポート競合**
   - `.vibeconfig.json` でポート番号を変更
   - 他のプロセスがポートを使用していないか確認

3. **依存関係エラー**
   - `npm install` で依存関係を再インストール
   - Node.js のバージョンを確認

## 設定の検証

```bash
# 設定ファイルの検証
vibe config validate

# 環境のテスト
vibe test environment
```