# Gemini CLI vs GitHub Copilot 設定比較

## 概要

このドキュメントでは、プロジェクトで使用しているGemini CLIとGitHub Copilotの設定とワークフローの比較を行います。両方のツールは異なるアプローチでAI支援開発を提供しており、それぞれに適した使用場面があります。

## 設定ファイル比較

### 設定ファイル構造

| 項目 | Gemini CLI | GitHub Copilot |
|------|------------|----------------|
| 設定ファイル | `.geminirc.json` | `.copilotrc.json` |
| 指示ディレクトリ | `instructions/` | `copilot-instructions/` |
| 実行スクリプト | `scripts/gemini-cli.js` | `scripts/copilot-cli.js` |
| テンプレート | 指示ファイル内で定義 | `copilot-instructions/templates/` |

### 設定内容の比較

#### プロジェクト設定

**Gemini CLI (.geminirc.json)**
```json
{
  "project": {
    "name": "digital-omikuji",
    "description": "Remix を使用したデジタルおみくじアプリケーション",
    "language": "typescript",
    "framework": "remix",
    "testFramework": "jest"
  }
}
```

**GitHub Copilot (.copilotrc.json)**
```json
{
  "project": {
    "name": "digital-omikuji",
    "description": "Remix を使用したデジタルおみくじアプリケーション",
    "language": "typescript",
    "framework": "remix",
    "testFramework": "jest"
  },
  "copilot": {
    "version": "1.0.0",
    "provider": "github-copilot",
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

#### 生成設定

**共通項目**
- `codeStyle`: "functional"
- `naming`: "camelCase"
- `imports`: "es6"
- TypeScript strict モード対応

**相違点**
- Gemini CLI: 直接実行可能なコマンド形式
- Copilot: プロンプト生成とChat統合に特化

## ワークフロー比較

### 利用可能なコマンド

#### npm スクリプト

**Gemini CLI**
```bash
npm run gemini:component     # コンポーネント生成
npm run gemini:review        # プロジェクトレビュー
npm run gemini:enhance       # 機能拡張
npm run gemini:check-docs    # ドキュメントチェック
npm run gemini:check-readme  # README チェック
npm run gemini:pr-docs-review # PR ドキュメントレビュー
```

**GitHub Copilot**
```bash
npm run copilot:component        # コンポーネント生成指示
npm run copilot:review          # プロジェクトレビュー指示
npm run copilot:enhance         # 機能拡張指示
npm run copilot:check-docs      # ドキュメントチェック指示
npm run copilot:component-chat  # コンポーネント生成 + Chat開く
npm run copilot:review-chat     # レビュー + Chat開く
```

### 実行フロー比較

#### Gemini CLI のフロー
```
1. 指示ファイル読み込み
2. コマンド実行
3. 結果の直接出力
4. 自動ファイル生成/更新
```

#### GitHub Copilot のフロー
```
1. 指示ファイル読み込み
2. プロンプト生成
3. プロンプトファイル保存
4. Copilot Chat 連携
5. 手動でのコード生成/レビュー
```

## 指示ファイル構造比較

### Gemini CLI 指示ファイル例

```json
{
  "metadata": {
    "name": "コンポーネント生成指示",
    "description": "新しいReactコンポーネントを生成するための指示セット"
  },
  "commands": [
    {
      "type": "generate-component",
      "command": "generate component --name \"{{componentName}}\" --type \"react-tsx\"",
      "variables": {
        "componentName": "FortuneResult"
      },
      "required": true
    }
  ]
}
```

### GitHub Copilot 指示ファイル例

```json
{
  "metadata": {
    "name": "GitHub Copilot コンポーネント生成指示",
    "description": "新しいReactコンポーネントを生成するためのCopilot用指示セット"
  },
  "instructions": [
    {
      "type": "generate-component",
      "title": "React TSXコンポーネントを生成",
      "prompt": "以下の要件に基づいて、TypeScriptを使用したReactコンポーネントを生成してください：...",
      "variables": {
        "componentName": "FortuneResult"
      },
      "priority": "high"
    }
  ]
}
```

## 使用場面の比較

### Gemini CLI が適している場面

#### 利点
- **自動化**: コマンド実行で直接ファイル生成
- **バッチ処理**: 複数のタスクを連続実行
- **CI/CD統合**: スクリプトでの自動実行
- **一貫性**: 設定に基づいた統一的な出力

#### 適用例
```bash
# 自動的にファイルを生成
gemini generate component --name "UserProfile" --props "user:User"

# プロジェクト全体を一括レビュー
gemini review --project --exclude "node_modules,build"

# ドキュメント自動生成
gemini docs generate --type "api" --output "docs/api.md"
```

### GitHub Copilot が適している場面

#### 利点
- **インタラクティブ**: リアルタイムな対話型開発
- **コンテキスト理解**: 現在の作業環境を考慮
- **柔軟性**: 状況に応じた調整が可能
- **IDE統合**: エディタ内での直接作業

#### 適用例
```
# Copilot Chat での対話
/ask FortuneResult コンポーネントを作成してください

# インライン補完
const handleClick = () => {
  // Copilot が適切な実装を提案
}

# リアルタイムレビュー
// この関数のパフォーマンスを改善してください
```

## 実装詳細比較

### スクリプト機能

#### Gemini CLI (scripts/gemini-cli.js)
- **コマンド実行**: 実際のgeminiコマンドを実行
- **ファイル操作**: 自動的なファイル生成/更新
- **エラーハンドリング**: コマンド失敗時の処理
- **依存関係管理**: タスク間の依存関係

#### Copilot CLI (scripts/copilot-cli.js)
- **プロンプト生成**: 構造化されたプロンプトの作成
- **テンプレート処理**: 変数置換とフォーマット
- **Chat統合**: ブラウザでのCopilot Chat起動
- **コンテキスト提供**: プロジェクト情報の付与

### テンプレート管理

#### Gemini CLI
```
instructions/
├── generate-component.json
├── project-review.json
└── enhance-omikuji.json
```

#### GitHub Copilot
```
copilot-instructions/
├── generate-component.json
├── project-review.json
├── enhance-omikuji.json
└── templates/
    ├── component-prompt.md
    ├── test-prompt.md
    └── review-prompt.md
```

## 連携パターン

### 補完的使用

1. **設計フェーズ**: Copilot Chat で設計討議
2. **実装フェーズ**: Gemini CLI で一括生成
3. **レビューフェーズ**: Copilot で詳細レビュー
4. **改善フェーズ**: Gemini CLI で自動修正

### 段階的使用

```bash
# 1. Copilot で初期設計
npm run copilot:component-chat

# 2. Gemini で実装
npm run gemini:component

# 3. Copilot で調整
# (エディタ内でCopilotを使用)

# 4. Gemini で最終レビュー
npm run gemini:review
```

## まとめ

### 選択基準

| 作業内容 | 推奨ツール | 理由 |
|----------|------------|------|
| 新機能の設計 | Copilot | インタラクティブな討議に最適 |
| ファイル一括生成 | Gemini CLI | 自動化と一貫性 |
| コードの詳細調整 | Copilot | リアルタイムな補完 |
| プロジェクト全体レビュー | Gemini CLI | 網羅的なチェック |
| ドキュメント生成 | Gemini CLI | 構造化された出力 |
| デバッグ支援 | Copilot | 対話型トラブルシューティング |

### 今後の展開

1. **ツール間連携**: Gemini CLI 結果をCopilot に引き渡し
2. **ワークフロー最適化**: 作業フェーズに応じた自動切り替え
3. **設定統合**: 共通設定による一貫性向上
4. **品質向上**: 両ツールの結果比較による品質検証

両ツールを適切に使い分けることで、効率的で高品質なAI支援開発が可能になります。