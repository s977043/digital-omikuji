# 新機能開発ワークフロー

## 概要

SDD（仕様駆動開発）に従った新機能開発の標準フロー。

## 前提条件

- [AGENTS.md](../../AGENTS.md) を読了していること
- [.agent/skills/sdd-core/SKILL.md](../skills/sdd-core/SKILL.md) を理解していること

## フロー

### Phase 0: 理解

1. リポジトリ全体を読み、影響範囲を特定
2. 関連するSteering Documentsを列挙
3. **コード変更禁止**

### Phase 1: Working Documents作成（Gate A）

1. 作業用ディレクトリ作成: `docs/working/{YYYYMMDD}_{feature}/`
2. 必須ファイル生成:
   - `requirements.md` - 要件定義
   - `design.md` - 設計ドキュメント
   - `tasklist.md` - タスク分解
   - `testing.md` - テスト計画

**Gate A**: 承認が得られるまで次のフェーズに進まない

### Phase 2: テスト作成（Gate B）

1. テストを先に作成（TDD）
2. `testing.md`との対応関係を明示
3. テストを実行して結果を記録

**Gate B**: テストなしの実装は禁止

### Phase 3: 実装

1. `tasklist.md`のタスク単位で実装
2. 受け入れ基準（AC）を満たす最小限の変更
3. **仕様に書かれていない機能追加・最適化は禁止**

### Phase 4: 検証・完了（Gate C）

1. 全テストを実行
2. E2E検証（必要に応じて）
3. `completion-report.md`を作成

**Gate C**: 完了報告後、人間の確認を待つ

## 実行コマンド

- テスト: `pnpm test`
- Lint: `pnpm lint`
- ビルド: `pnpm build`
- PR作成: `/pr`コマンド

## 関連ワークフロー

- CIエラー発生時: [fix_ci_errors.md](./fix_ci_errors.md)
- PRレビュー対応: [respond_to_pr_review.md](./respond_to_pr_review.md)
