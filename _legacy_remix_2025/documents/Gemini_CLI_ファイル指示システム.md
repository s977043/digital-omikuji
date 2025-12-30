# Gemini CLI ファイル指示実行システム

## 概要

このシステムは、Gemini CLI の操作をファイルベースの指示により自動化するためのツールです。JSON形式の指示ファイルを作成することで、複数のGemini CLIコマンドを順番に実行し、コード生成、レビュー、ドキュメント作成などの作業を自動化できます。

## 特徴

- **ファイルベースの指示**: JSON形式で指示を定義
- **バッチ実行**: 複数のGemini CLIコマンドを順番に実行
- **テンプレート変数**: 動的な値の置換に対応
- **エラーハンドリング**: 必須/任意コマンドの指定
- **実行制御**: 待機時間やオプションの設定
- **既存テンプレート統合**: プロジェクトの既存テンプレートを活用

## インストールと設定

### 前提条件

1. Node.js がインストールされていること
2. Gemini CLI がインストール・設定されていること
3. プロジェクトルートに `.geminirc.json` が存在すること

### 使用方法

#### 1. NPMスクリプトを使用した実行

```bash
# コンポーネント生成指示の実行
npm run gemini:component

# プロジェクトレビュー指示の実行
npm run gemini:review

# おみくじ機能拡張指示の実行
npm run gemini:enhance

# カスタム指示ファイルの実行
npm run gemini:run -- instructions/my-custom.json
```

#### 2. 直接実行

```bash
# 指示ファイルを直接指定して実行
node scripts/gemini-cli.js instructions/generate-component.json

# ヘルプの表示
node scripts/gemini-cli.js
```

## 指示ファイルの形式

### 基本構造

```json
{
  "metadata": {
    "name": "指示セット名",
    "description": "指示セットの説明",
    "version": "1.0.0",
    "author": "作成者"
  },
  "commands": [
    {
      "type": "コマンドタイプ",
      "command": "gemini コマンド文字列",
      "variables": {
        "変数名": "値"
      },
      "options": {
        "cwd": "実行ディレクトリ"
      },
      "required": true,
      "description": "コマンドの説明",
      "delay": 1000
    }
  ]
}
```

### フィールドの説明

#### metadata（メタデータ）
- `name`: 指示セットの名前
- `description`: 指示セットの説明
- `version`: バージョン番号
- `author`: 作成者

#### commands（コマンド配列）
- `type`: コマンドの種類（ログ出力用）
- `command`: 実行するGemini CLIコマンド
- `variables`: テンプレート変数の定義
- `options`: 実行オプション（cwd等）
- `required`: 必須フラグ（false の場合、失敗してもスキップ）
- `description`: コマンドの説明
- `delay`: 次のコマンド実行までの待機時間（ミリ秒）

### テンプレート変数

コマンド文字列内で `{{変数名}}` 形式でテンプレート変数を使用できます。

```json
{
  "command": "generate component --name \"{{componentName}}\"",
  "variables": {
    "componentName": "MyComponent"
  }
}
```

上記は以下のコマンドに展開されます：
```
generate component --name "MyComponent"
```

## 使用例

### 1. コンポーネント生成

```json
{
  "metadata": {
    "name": "コンポーネント生成",
    "description": "新しいReactコンポーネントとテストを生成"
  },
  "commands": [
    {
      "type": "generate-component",
      "command": "generate component --name \"{{componentName}}\" --type \"react-tsx\"",
      "variables": {
        "componentName": "UserProfile"
      },
      "required": true
    },
    {
      "type": "generate-test",
      "command": "generate test --file \"app/components/{{componentName}}.tsx\"",
      "variables": {
        "componentName": "UserProfile"
      },
      "required": false,
      "delay": 1000
    }
  ]
}
```

### 2. プロジェクトレビュー

```json
{
  "metadata": {
    "name": "プロジェクトレビュー",
    "description": "コード品質チェックとドキュメント生成"
  },
  "commands": [
    {
      "type": "review",
      "command": "review --project --exclude \"node_modules\"",
      "required": false
    },
    {
      "type": "docs",
      "command": "docs generate --type \"api\" --output \"docs/api.md\"",
      "required": false,
      "delay": 2000
    }
  ]
}
```

## 標準提供の指示ファイル

### 1. generate-component.json
新しいReactコンポーネントの生成、テスト作成、コードレビューを実行

### 2. project-review.json
プロジェクト全体のレビューとドキュメント生成を実行

### 3. enhance-omikuji.json
おみくじアプリの機能拡張に関連するコード生成を実行

## エラーハンドリング

- `required: true` のコマンドが失敗した場合、実行を停止
- `required: false` のコマンドが失敗した場合、警告を表示して続行
- 指示ファイルの形式エラーは実行前にチェック
- Gemini CLI の出力とエラーをログに表示

## 実行結果

実行完了時に以下の情報が表示されます：

```
=== Execution Summary ===
Total commands: 3
Successful: 2
Failed: 1
```

## カスタム指示ファイルの作成

1. `instructions/` ディレクトリに新しいJSONファイルを作成
2. 上記の形式に従って指示を定義
3. `npm run gemini:run -- instructions/your-file.json` で実行

## ベストプラクティス

### 1. 指示ファイルの構成
- 論理的にグループ化されたコマンドをまとめる
- 必須/任意の適切な設定
- 適切な待機時間の設定

### 2. 変数の活用
- 再利用可能な指示ファイルのために変数を活用
- 一貫した命名規則の使用

### 3. エラー対応
- 重要でないコマンドは `required: false` に設定
- 適切なエラーメッセージの提供

### 4. テスト
- 新しい指示ファイルは小さなプロジェクトでテスト
- 段階的な実行でデバッグ

## トラブルシューティング

### よくある問題

1. **Gemini CLI が見つからない**
   ```
   解決方法: Gemini CLI がインストールされ、PATHに設定されていることを確認
   ```

2. **指示ファイルが読み込めない**
   ```
   解決方法: JSONの構文エラーをチェック、ファイルパスを確認
   ```

3. **コマンドが失敗する**
   ```
   解決方法: Gemini CLI の認証設定とコマンド構文を確認
   ```

## 拡張方法

### 新機能の追加

1. `scripts/gemini-cli.js` の編集
2. 新しいコマンドタイプの追加
3. カスタムオプションの実装

### テンプレート統合

1. `templates/` ディレクトリのテンプレートを活用
2. 指示ファイル内でテンプレートパスを指定
3. 既存のプロジェクト構造との整合性を保持

## 関連ドキュメント

- [Gemini CLI使用方法](./Gemini_CLI使用方法.md)
- [プロジェクト構成](./プロジェクト構成.md)
- [開発環境構築ガイド](./開発環境構築ガイド.md)