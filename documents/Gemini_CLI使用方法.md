# Gemini CLI使用方法

## 概要

Gemini CLI は、Google の生成AI「Gemini」を使用してコード生成、レビュー、ドキュメント作成を支援するコマンドラインツールです。

## インストール

### 1. Gemini CLI のインストール

```bash
npm install -g @google-ai/generative-ai-cli
```

### 2. 認証の設定

```bash
# APIキーの設定
export GEMINI_API_KEY=your-api-key-here

# または、設定ファイルに保存
gemini config set api-key your-api-key-here
```

## 基本的な使用方法

### 1. コード生成

```bash
# TypeScript コンポーネントの生成
gemini generate component --name "ResultDisplay" --type "react-tsx" --props "result:string"

# テストコードの生成
gemini generate test --file "app/routes/index.tsx" --framework "jest"
```

### 2. コードレビュー

```bash
# ファイルのレビュー
gemini review --file "app/routes/index.tsx" --language "typescript"

# プロジェクト全体のレビュー
gemini review --project --exclude "node_modules,build"
```

### 3. ドキュメント生成

```bash
# README の生成
gemini docs generate --type "readme" --project-info "digital-omikuji"

# API ドキュメントの生成
gemini docs api --input "app/routes" --output "docs/api.md"
```

## プロジェクト固有の設定

### .geminirc.json の作成

```json
{
  "project": {
    "name": "digital-omikuji",
    "description": "Remix を使用したデジタルおみくじアプリケーション",
    "language": "typescript",
    "framework": "remix"
  },
  "generation": {
    "style": "functional",
    "testing": {
      "framework": "jest",
      "coverage": true
    },
    "documentation": {
      "language": "japanese",
      "format": "markdown"
    }
  },
  "review": {
    "rules": [
      "typescript-strict",
      "react-hooks",
      "performance",
      "accessibility"
    ],
    "severity": "warning"
  }
}
```

## 具体的な使用例

### 1. おみくじ機能の拡張

```bash
# 新しいおみくじ結果の追加
gemini generate function --name "getDetailedFortune" --input "fortuneType:string" --output "DetailedFortune"

# 結果の説明文を生成
gemini generate content --type "fortune-descriptions" --count 4 --style "traditional-japanese"
```

### 2. テストの自動生成

```bash
# 既存コンポーネントのテスト生成
gemini generate test --file "app/routes/index.tsx" --test-type "unit,integration"

# エッジケースのテスト生成
gemini generate test --scenario "edge-cases" --component "OmikujiComponent"
```

### 3. リファクタリング支援

```bash
# コードの最適化提案
gemini refactor --file "app/routes/index.tsx" --optimize "performance,readability"

# 型安全性の向上
gemini refactor --typescript --strict --file "app/routes/index.tsx"
```

## 高度な機能

### 1. カスタムプロンプトの作成

```bash
# プロンプトテンプレートの作成
gemini prompt create --name "omikuji-component" --template "templates/component.prompt"

# カスタムプロンプトの使用
gemini generate --prompt "omikuji-component" --vars "name=LuckyResult,props=fortune:string"
```

### 2. バッチ処理

```bash
# 複数ファイルの一括処理
gemini batch --command "review" --files "app/routes/*.tsx"

# 設定ファイルでのバッチ処理
gemini batch --config "batch-config.json"
```

### 3. 継続的インテグレーション

```bash
# CI/CD パイプラインでの使用
gemini ci --check "code-quality,test-coverage,documentation"
```

## ベストプラクティス

### 1. プロンプトの最適化

- 明確で具体的な指示を提供
- コンテキスト情報を含める
- 期待する出力形式を明示

### 2. 生成されたコードの検証

- 常に生成されたコードをレビュー
- テストを実行して動作確認
- セキュリティ面での検証

### 3. 設定の管理

- プロジェクト固有の設定を `.geminirc.json` で管理
- 環境変数でAPIキーを管理
- バージョン管理から秘密情報を除外

## エラーハンドリング

### よくあるエラーと解決方法

1. **認証エラー**
   ```bash
   # APIキーの確認
   gemini config get api-key
   
   # 新しいキーの設定
   gemini config set api-key new-api-key
   ```

2. **レート制限エラー**
   ```bash
   # リクエスト間隔の設定
   gemini config set rate-limit 1000
   ```

3. **生成エラー**
   ```bash
   # 詳細ログの有効化
   gemini generate --verbose --debug
   ```

## 参考資料

- [Gemini CLI 公式ドキュメント](https://ai.google.dev/docs/gemini_cli)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Reference](https://ai.google.dev/api/rest)