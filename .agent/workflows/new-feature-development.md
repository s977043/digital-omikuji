---
title: "新機能開発ワークフロー"
description: "新機能を開発する際の標準手順（SDD準拠）"
version: "1.0"
last_updated: "2026-01-19"
---

# 新機能開発ワークフロー

Digital Omikujiで新機能を開発する際の標準手順です。SDD（仕様駆動開発）に準拠しています。

## 1. 準備フェーズ

### 1.1 Issue確認
- GitHub Issuesで機能要件を確認
- 不明点はPO/PMに質問して明確化

### 1.2 ブランチ作成
```bash
git checkout develop
git pull origin develop
git checkout -b feature/<feature-name>
```

命名規則: `feature/add-fortune-result-sharing` など、動詞+名詞形式

## 2. SDDフェーズ

### 2.1 仕様書作成
`docs/working/YYYYMMDD_<feature-name>/requirements.md` を作成

**記載内容**:
- 機能の目的
- ユーザーストーリー
- 受け入れ基準
- 非機能要件（パフォーマンス、セキュリティなど）

参考: [.agent/skills/sdd-core/SKILL.md](./.agent/skills/sdd-core/SKILL.md)

### 2.2 設計書作成
`docs/working/YYYYMMDD_<feature-name>/design.md` を作成

**記載内容**:
- コンポーネント構成
- データフロー
- API設計（必要な場合）
- 状態管理の方針

### 2.3 タスク分解
`docs/working/YYYYMMDD_<feature-name>/tasklist.md` を作成

実装タスクを小さな単位（1-2時間以内）に分解:
- [ ] コンポーネントA実装
- [ ] hooks/useFeatureX実装
- [ ] 単体テスト作成
- [ ] 統合テスト作成

### 2.4 Gate 1: 仕様レビュー
- レビュワー（人間またはAI）に仕様を確認依頼
- 承認されたら実装フェーズへ

## 3. 実装フェーズ

### 3.1 テストケース作成（TDD）
`__tests__/` または `*.test.tsx` にテストを先に書く

```typescript
describe('FortuneSharing', () => {
  it('should generate shareable image', async () => {
    // テストコード
  });
});
```

Red -> Green -> Refactor サイクル

### 3.2 実装
- コンポーネント、hooks、utilsを実装
- [AGENTS.md](../../AGENTS.md) のコーディング規約に従う
- NativeWind v4でスタイリング

### 3.3 ローカル動作確認
```bash
pnpm start        # Expo開発サーバー起動
pnpm test         # テスト実行
pnpm lint         # Lint実行
```

### 3.4 Gate 2: コードレビュー
セルフレビュー:
- `pnpm lint` でエラーなし
- `pnpm test` で全テスト通過
- 不要なconsole.log削除
- コメントアウトコード削除

AIエージェントレビュー（任意）:
- Copilot: `copilot review`
- Gemini: `gemini review`
- Codex: `codex review`

## 4. PR・統合フェーズ

### 4.1 PR作成
```bash
git add .
git commit -m "feat: <要約>"
git push -u origin feature/<feature-name>
```

GitHubでPRを作成:
- タイトル: `feat: <機能名>`
- 本文: `/pr` コマンドまたは手動で記載
  - 目的
  - 変更内容
  - 動作確認結果
  - スクリーンショット（UI変更の場合）

### 4.2 CI通過確認
GitHub Actionsが Greenになるまで待つ:
- Lint
- Test
- Build

失敗した場合は [fix_ci_errors.md](./fix_ci_errors.md) を参照

### 4.3 レビュー対応
レビューコメントへの対応: [respond_to_pr_review.md](./respond_to_pr_review.md) を参照

### 4.4 マージ
- Squash Mergeまたは Merge Commit で `develop` に統合
- ブランチ削除

## 5. 完了報告

`docs/working/YYYYMMDD_<feature-name>/completion-report.md` を作成（任意）

**記載内容**:
- 実装内容のサマリ
- テスト結果
- 残課題（あれば）
- 次のステップ

---

## 参考リンク

- [AGENTS.md](../../AGENTS.md) - 開発ガイド
- [.agent/steering/sdd-workflow.md](../.agent/steering/sdd-workflow.md) - SDDワークフロー詳細
- [fix_ci_errors.md](./fix_ci_errors.md) - CIエラー対応
- [respond_to_pr_review.md](./respond_to_pr_review.md) - PRレビュー対応
