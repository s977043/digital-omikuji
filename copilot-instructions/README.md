# GitHub Copilot 指示ファイル

このディレクトリには、GitHub Copilot を効果的に活用するための指示ファイルとテンプレートが含まれています。

## 概要

GitHub Copilot は優れたAIペアプログラミングツールですが、プロジェクト固有のコンテキストや要件を効果的に伝えるためには、適切なプロンプトが必要です。このディレクトリの指示ファイルは、一貫性のある高品質なプロンプトを生成し、開発作業を効率化します。

## ディレクトリ構造

```
copilot-instructions/
├── README.md                    # このファイル
├── generate-component.json      # コンポーネント生成指示
├── project-review.json         # プロジェクトレビュー指示  
├── enhance-omikuji.json        # おみくじ機能拡張指示
├── check-docs-update.json      # ドキュメント更新チェック指示
└── templates/                  # プロンプトテンプレート
    ├── component-prompt.md     # コンポーネント生成用テンプレート
    ├── test-prompt.md          # テスト生成用テンプレート
    ├── review-prompt.md        # コードレビュー用テンプレート
    └── documentation-prompt.md # ドキュメント生成用テンプレート
```

## 使用方法

### 基本的な使用方法

```bash
# Copilot CLI ツールを使用
node scripts/copilot-cli.js copilot-instructions/generate-component.json

# または npm script を使用
npm run copilot:component
npm run copilot:review
npm run copilot:enhance
npm run copilot:check-docs
```

### GitHub Copilot Chat と併用

```bash
# Copilot Chat を自動で開く
npm run copilot:component-chat
npm run copilot:review-chat
```

生成されたプロンプトをコピーして、GitHub Copilot Chat で使用してください。

## 指示ファイルの説明

### 1. generate-component.json
新しいReactコンポーネントを生成するための指示セット。

**含まれる指示:**
- TypeScript React コンポーネントの生成
- Jest テストファイルの生成
- コードレビューの実行

**使用例:**
```bash
npm run copilot:component
```

### 2. project-review.json
プロジェクト全体のコードレビューとドキュメント生成を行う指示セット。

**含まれる指示:**
- プロジェクト全体のコードレビュー
- APIドキュメントの生成
- README.mdの更新提案
- セキュリティチェック

**使用例:**
```bash
npm run copilot:review
```

### 3. enhance-omikuji.json
デジタルおみくじアプリケーションの機能拡張を行う指示セット。

**含まれる指示:**
- おみくじの種類拡張
- アニメーション効果の追加
- 履歴機能の追加
- SNS共有機能の追加
- 新機能のテスト追加

**使用例:**
```bash
npm run copilot:enhance
```

### 4. check-docs-update.json
ドキュメントの更新状況をチェックし、同期を維持する指示セット。

**含まれる指示:**
- README.mdとコードの同期チェック
- APIドキュメントとコードの同期チェック
- ドキュメント構造の検証
- コードコメントとドキュメントの整合性チェック
- ドキュメント更新計画の生成

**使用例:**
```bash
npm run copilot:check-docs
```

## プロンプトテンプレート

### component-prompt.md
React TypeScript コンポーネント生成用のテンプレート。プロジェクトの要件とコーディング規約を含みます。

### test-prompt.md
Jest + React Testing Library を使用したテスト生成用のテンプレート。

### review-prompt.md
TypeScript、React、セキュリティ、パフォーマンス等の観点でのコードレビュー用テンプレート。

### documentation-prompt.md
README、API仕様書、開発ガイド等のドキュメント生成用テンプレート。

## カスタマイズ方法

### 1. 新しい指示ファイルの作成

指示ファイルの基本構造：

```json
{
  "metadata": {
    "name": "指示セット名",
    "description": "説明",
    "version": "1.0.0",
    "author": "digital-omikuji-team",
    "copilotVersion": "1.0"
  },
  "context": {
    "projectType": "remix-typescript",
    "framework": "react",
    "language": "japanese"
  },
  "instructions": [
    {
      "type": "task-type",
      "title": "タスクタイトル",
      "prompt": "GitHub Copilot への指示内容...",
      "variables": {
        "variableName": "デフォルト値"
      },
      "priority": "high|medium|low",
      "dependsOn": ["他のタスクのtype"]
    }
  ],
  "tips": [
    "使用時のコツ1",
    "使用時のコツ2"
  ]
}
```

### 2. 変数の使用

プロンプト内で `{{variableName}}` の形式で変数を使用できます：

```json
{
  "prompt": "{{componentName}} コンポーネントを作成してください。props: {{componentProps}}",
  "variables": {
    "componentName": "FortuneResult",
    "componentProps": "result: string"
  }
}
```

### 3. 依存関係の設定

タスク間の依存関係を設定できます：

```json
{
  "type": "generate-test",
  "dependsOn": ["generate-component"]
}
```

## ベストプラクティス

### 1. プロンプトの作成
- 明確で具体的な指示を書く
- プロジェクトコンテキストを含める
- 期待する出力形式を明示する
- 制約や要件を明確にする

### 2. 指示ファイルの管理
- 適切なファイル名を使用する
- メタデータを充実させる
- バージョン管理を適切に行う
- 依存関係を明確にする

### 3. 実行時の注意
- 関連ファイルを事前に開く
- 生成されたコードを必ずレビューする
- 段階的に実行する
- テストを忘れずに実行する

## 貢献方法

新しい指示ファイルやテンプレートの追加、既存のものの改善は歓迎します：

1. 新しい指示ファイルを作成
2. 適切なテストを実行
3. ドキュメントを更新
4. プルリクエストを作成

## 関連資料

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [プロジェクトのGitHub Copilot使用方法](../documents/GitHub_Copilot使用方法.md)
- [Gemini CLI使用方法](../documents/Gemini_CLI使用方法.md)
- [.copilotrc.json 設定リファレンス](../.copilotrc.json)