# Gemini instructions (Digital Omikuji)

> **Single source:** 必ず [AGENTS.md](./AGENTS.md) を読み、共通ルールと完了条件に従ってください。本ファイルは Gemini 向けの薄いラッパーです。

## 必須チェック（着手前に確認）

- 「完了条件」とリポジトリポリシー（AGENTS.md）を確認し、計画を提示してから作業開始。
- ブランチはタスク単位。PR 前に `pnpm test` を実行し、レビュー依頼を明記。
- 出力は日本語が基準。

## Gemini-specific Tips

### Prompt assembly

- 最初のコンテキストに`AGENTS.md`の全文（または要約）を含める。
- 本ファイル（GEMINI.md）は、Gemini固有の振る舞い調整が必要な場合のみ参照する。
- タスク概要、受入条件、編集対象ファイルを明確にする。

### Development Guidelines

- **Branch Strategy & Commits (CRITICAL)**:
  - **`main` / `develop` への直接コミットは、いかなる理由（ドキュメント修正、小規模な調整等）があっても厳禁です。**
  - すべての変更は必ず `feature/` 等の作業ブランチを作成し、PR を通じて反映してください。
  - 作業完了後は必ずブランチを削除し、クリーンな状態を維持してください。

- **CI Check**:
  - CIエラーを防ぐため、PRプッシュ前やLintエラー発生時は必ずローカルで `pnpm lint:fix` と `pnpm tsc --noEmit` を実行する。
  - `gh run list` と `gh run view <ID> --log-failed` でCIの結果を積極的に確認する。

- **PR Review**:
  - PRレビュー対応時は、`.agent/workflows/respond_to_pr_review.md` の手順に従い、CIエラー対応・コンフリクト解消・コメント対応を網羅的に行う。

- **Accessibility & UX**:
  - アニメーション実装時は必ず `reducedMotion` を考慮し、条件分岐を入れる。
  - タップ可能な要素には必ず `accessibilityLabel` と `accessibilityRole` を設定する。
  - マジックナンバーは避け、定数 (`const ANIMATION_TIMING` 等) として定義する。

> ルール変更や運用メモは`AGENTS.md`に集約し、このファイルは最小限に保ってください。
