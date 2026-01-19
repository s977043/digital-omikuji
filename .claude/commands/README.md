# Claude Commands - カスタムコマンド集

Claude Codeで使用できるカスタムコマンドのリファレンスです。

## 📋 コマンド一覧

### 品質チェック

#### `/check`
コード品質チェックを実行します。

**実行内容**:
1. `pnpm run lint` (ESLint)
2. `pnpm test` (Jest)
3. 失敗した場合はエラーの要約を表示

**出力**:
- 変更の要点
- 後方互換性の考慮
- 性能への影響
- セキュリティ考慮

**使用例**:
```
/check
```

詳細: [check.md](./check.md)

---

### PR作成支援

#### `/pr`
現在の差分からPR本文を自動生成します。

**生成フォーマット**:
- 目的
- 変更点
- 動作確認
- 影響範囲 / リスク
- ロールバック手順

**使用例**:
```
/pr
```

詳細: [pr.md](./pr.md)

---

#### `/evidence`
テスト結果とログをサマリとしてまとめます。

**用途**:
- PR本文への添付
- レビュワーへのエビデンス提示
- テスト結果の記録

**使用例**:
```
/evidence
```

詳細: [evidence.md](./evidence.md)

---

### 実装支援

#### `/plan`
実装計画を生成します。

**生成内容**:
- タスク分解
- 実装順序
- 依存関係
- リスク分析
- 検証方法

**使用例**:
```
/plan
```

詳細: [plan.md](./plan.md)

---

#### `/review`
変更内容をレビューします。

**チェック項目**:
- コーディング規約遵守
- エッジケース考慮
- セキュリティ問題
- パフォーマンス影響
- テストカバレッジ

**使用例**:
```
/review
```

詳細: [review.md](./review.md)

---

### Git worktree管理

#### `/wt`
Git worktree を準備します。

**用途**:
- 並行タスクの分離
- 複数ブランチの同時作業
- 別機能の開発を並行実施

**使用例**:
```
/wt
```

参照: [AGENTS.md](../../AGENTS.md) の「7. 並行タスクは Git Worktree で分離する」

詳細: [wt.md](./wt.md)

---

## 🔧 コマンドのカスタマイズ

各コマンドの詳細は個別の `.md` ファイルを参照してください:

- [check.md](./check.md) - 品質チェック詳細
- [pr.md](./pr.md) - PR本文生成詳細
- [evidence.md](./evidence.md) - エビデンス生成詳細
- [plan.md](./plan.md) - 実装計画生成詳細
- [review.md](./review.md) - コードレビュー詳細
- [wt.md](./wt.md) - worktree管理詳細

---

## 📝 新しいコマンドの追加

1. このディレクトリに `<command-name>.md` を作成
2. Front Matter に `description` を記載:
   ```yaml
   ---
   description: "コマンドの説明"
   ---
   ```
3. コマンドの実行内容を記述
4. 本 README に索引を追加
5. [.claude/CLAUDE.md](../.claude/CLAUDE.md) から参照（必要に応じて）

---

## 🔗 関連ドキュメント

- **[AGENTS.md](../../AGENTS.md)** - 開発ガイド（SSOT）
- **[.claude/CLAUDE.md](../CLAUDE.md)** - Claude Code設定
- **[.claude/settings.json](../settings.json)** - 権限設定・フック定義
