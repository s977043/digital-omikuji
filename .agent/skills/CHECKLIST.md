# Agent Skills チェックリスト

新しいスキルを追加する際は、以下を確認してください。

## 必須項目

### 1. ディレクトリとファイルの作成

- [ ] `<skill-name>/` ディレクトリを作成
- [ ] `SKILL.md` ファイルを作成
- [ ] スクリプトがある場合は `run.js` または適切なファイル名で作成

### 2. SKILL.md の Front Matter

- [ ] Front Matter を記載（`---` で囲む）
- [ ] 必須フィールド:
  - [ ] `name`: スキル名
  - [ ] `description`: スキルの説明
  - [ ] `version`: バージョン（任意）
  - [ ] `priority`: 優先度（任意: `highest`, `high`, `medium`, `low`）

### 3. SKILL.md の内容

- [ ] スキルの目的を明記
- [ ] 使用方法を記載
- [ ] サンプルコード・使用例を含める（該当する場合）
- [ ] 関連ドキュメントへのリンク（該当する場合）

## 任意項目

- [ ] `priority` フィールド（優先度が `highest` または `high` の場合のみ）
- [ ] `script` フィールド（実行可能スクリプトがある場合）
- [ ] サンプルコード・テンプレート
- [ ] トラブルシューティングセクション

## バリデーション

スキルを追加したら、バリデーションスクリプトを実行してください:

```bash
pnpm validate:skills
```

または直接実行:

```bash
node .agent/skills/validate-skills.js
```

## 動作確認

実際にエージェントでスキルを呼び出し、期待通りに動作するか確認してください。

### Codex での確認例

```bash
codex --skill <skill-id>
```

### Gemini での確認例

```bash
gemini --skill <skill-id>
```

### Claude での確認例

スキルを参照するプロンプトを送信して動作確認。

## チェックリスト完了後

- [ ] バリデーションスクリプトが成功することを確認
- [ ] 動作確認が完了
- [ ] PR を作成してレビューを依頼
- [ ] マージ後、他のエージェントでも動作することを確認

## 参考

- [AGENTS.md](../../AGENTS.md) - エージェント統合開発ガイド
- [.agent/ARCHITECTURE.md](../ARCHITECTURE.md) - エージェント/スキル構成の概要
