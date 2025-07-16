# GitHub Copilot使用方法

## 概要

GitHub Copilot は、OpenAI Codex を使用したAIペアプログラミングツールです。このプロジェクトでは、Copilot を効果的に活用するための設定とワークフローを提供しています。

## 前提条件

### 1. GitHub Copilot のセットアップ

- GitHub Copilot サブスクリプション（個人または組織）
- 対応エディタ（VS Code、JetBrains、Neovim等）
- GitHub Copilot 拡張機能のインストール

### 2. プロジェクト固有の設定

このプロジェクトには以下の設定ファイルが含まれています：

- `.copilotrc.json` - Copilot プロジェクト設定
- `copilot-instructions/` - ワークフロー指示ファイル
- `scripts/copilot-cli.js` - Copilot CLI実行ツール

## 基本的な使用方法

### 1. インラインコード補完

```typescript
// TypeScript コンポーネントの例
interface FortuneResultProps {
  result: string;
  // Copilotが適切なプロパティを提案
}

const FortuneResult: React.FC<FortuneResultProps> = ({ result }) => {
  // Copilotがコンポーネントロジックを提案
  return (
    <div className="fortune-result">
      {/* Copilotが適切なJSXを提案 */}
    </div>
  );
};
```

### 2. GitHub Copilot Chat

VS Code で `Ctrl+Shift+I` (Windows/Linux) または `Cmd+Shift+I` (Mac) でCopilot Chatを開きます。

```
# プロンプト例
/fix このコンポーネントのアクセシビリティを改善してください

/explain この関数の動作を説明してください

/generate FortuneResultコンポーネント用のJestテストを作成してください
```

### 3. コマンドライン使用

```bash
# Copilot CLI ツールの使用
npm run copilot:component        # コンポーネント生成指示
npm run copilot:review          # プロジェクトレビュー指示
npm run copilot:enhance         # 機能拡張指示
npm run copilot:check-docs      # ドキュメント更新チェック

# GitHub Copilot Chat を自動で開く
npm run copilot:component-chat  # コンポーネント生成 + Chat開く
npm run copilot:review-chat     # レビュー + Chat開く
```

## プロジェクト固有の設定

### .copilotrc.json の解説

```json
{
  "project": {
    "name": "digital-omikuji",
    "description": "Remix を使用したデジタルおみくじアプリケーション",
    "language": "typescript",
    "framework": "remix"
  },
  "generation": {
    "codeStyle": "functional",
    "naming": "camelCase",
    "typescript": {
      "strict": true
    }
  },
  "prompts": {
    "contextFiles": [
      "README.md",
      "package.json",
      "app/routes/index.tsx"
    ]
  }
}
```

### 指示ファイルの使用

```bash
# 新しいコンポーネントを生成する指示を実行
node scripts/copilot-cli.js copilot-instructions/generate-component.json

# プロジェクト全体のレビュー指示を実行
node scripts/copilot-cli.js copilot-instructions/project-review.json --open-chat
```

## 具体的な使用例

### 1. 新しいコンポーネントの作成

#### Step 1: 指示の生成
```bash
npm run copilot:component-chat
```

#### Step 2: Copilot Chat での対話
```
# 生成されたプロンプトをCopilot Chatに貼り付け
FortuneResult コンポーネントを作成してください：

**要件:**
- props: result: string, onReset: () => void
- Tailwind CSS でスタイリング
- アクセシビリティ考慮
- TypeScript strict モード
```

#### Step 3: 生成されたコードの確認と調整
```typescript
// Copilotが生成したコードを確認
// 必要に応じて微調整
```

### 2. コードレビューの実行

#### Step 1: レビュー指示の生成
```bash
npm run copilot:review
```

#### Step 2: 対象ファイルを開いてレビュー実行
```
# 生成されたレビュープロンプトをCopilot Chatで使用
このコンポーネントをレビューしてください：

**観点:**
- TypeScript型安全性
- React ベストプラクティス
- パフォーマンス
- アクセシビリティ
- セキュリティ
```

### 3. テストの生成

```bash
# テスト生成指示（generate-component.json に含まれる）
npm run copilot:component
```

Copilot Chatで：
```
FortuneResult コンポーネントのテストを作成してください：

**要件:**
- Jest + React Testing Library
- レンダリングテスト
- ユーザーインタラクションテスト
- エッジケーステスト
```

### 4. ドキュメントの更新

```bash
npm run copilot:check-docs
```

Copilot Chatで：
```
README.mdとコードの同期をチェックしてください：

**確認項目:**
- 依存関係の正確性
- セットアップ手順
- 機能説明の最新化
```

## 高度な活用方法

### 1. カスタムプロンプトの作成

プロジェクト固有のプロンプトテンプレートを作成：

```markdown
# copilot-instructions/templates/custom-prompt.md

## プロジェクト: digital-omikuji
## タスク: {{TASK_TYPE}}

### 要件:
- {{REQUIREMENTS}}

### コーディング規約:
- TypeScript strict モード
- 関数型コンポーネント
- Tailwind CSS
```

### 2. ワークフロー統合

```bash
# package.json でワークフローを定義
"scripts": {
  "dev:copilot": "npm run copilot:component-chat && npm run dev",
  "review:copilot": "npm run copilot:review && npm run test"
}
```

### 3. 継続的改善

```json
// .copilotrc.json での学習データ蓄積
{
  "workflows": {
    "componentGeneration": {
      "successPatterns": ["pattern1", "pattern2"],
      "improvements": ["improvement1", "improvement2"]
    }
  }
}
```

## Copilot vs Gemini CLI の使い分け

### GitHub Copilot が適している場面
- リアルタイムコーディング支援
- 既存コードの補完・修正
- インタラクティブなデバッグ
- エディタ内での直接作業

### Gemini CLI が適している場面
- バッチ処理でのコード生成
- プロジェクト全体の一括レビュー
- 自動化されたドキュメント生成
- CI/CD パイプラインでの活用

## ベストプラクティス

### 1. コンテキストの提供
- 関連ファイルを事前に開く
- プロジェクト固有の設定を参照
- 既存のコーディング規約を明示

### 2. 段階的な開発
- 小さな機能から始める
- 各ステップでテストを実行
- 生成されたコードを必ずレビュー

### 3. 品質保証
- 生成されたコードのセキュリティチェック
- パフォーマンステスト
- アクセシビリティ検証

### 4. 学習と改善
- 効果的なプロンプトパターンを記録
- プロジェクト固有の設定を継続的に改善
- チーム内でのベストプラクティス共有

## トラブルシューティング

### よくある問題と解決方法

#### 1. Copilot が適切な候補を提案しない
```bash
# 解決策
- プロジェクトコンテキストを明確にする
- 型定義を充実させる
- コメントで意図を明示する
```

#### 2. 生成されたコードが動作しない
```bash
# 解決策
- 依存関係を確認
- TypeScript設定を確認
- eslint やテストでの検証
```

#### 3. プロンプトが長すぎる
```bash
# 解決策
- 段階的に分割して実行
- 重要な要件に絞る
- テンプレートを活用
```

## セキュリティ考慮事項

### 1. 機密情報の管理
- APIキーや秘密情報を含めない
- 生成されたコードの機密性確認
- 適切な.gitignore設定

### 2. 生成コードの検証
- セキュリティ脆弱性のチェック
- 入力値検証の確認
- 権限管理の確認

### 3. ライセンス遵守
- 生成されたコードのライセンス確認
- オープンソースライセンスとの整合性
- 企業ポリシーとの照合

## 参考資料

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [GitHub Copilot Chat Documentation](https://docs.github.com/copilot/github-copilot-chat)
- [VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Best Practices for AI-Assisted Development](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)