---
name: antigravity-pr-review-fix
description: PR URL、ブランチ差分、またはレビューコメントを受け取り、レビュー指摘の整理→最小修正→テスト→PR更新/報告までを一連で進める。Antigravityで「PRレビューして修正まで対応」「レビューコメントに沿って修正」「差分の問題点を直してPRを更新」などの依頼が来たときに使用する。
---

# Antigravity PR Review Fix

## Overview

PR/差分をレビューし、指摘に基づく最小修正と検証・報告までを完結させる。

## Workflow

### 0. Context Prep

- `.agent/skills/sdd-core/SKILL.md` と `AGENTS.md` を読み、必須ルールを確認する。
- 対象（PR URL / ブランチ / diff / 変更ファイル）と完了条件を明確化する。
- 直接 `main`/`develop` にコミットしない。必要なら作業ブランチを使う。

### 1. Review

- 差分の意図と影響範囲を整理する。
- 重大度順に指摘を列挙する（バグ、回帰、仕様違反、セキュリティ、パフォーマンス）。
- 追加が必要なテスト観点を抽出する。
- 仕様の曖昧さがある場合は、実装前に確認事項として提示する。

### 2. Fix Plan

- 指摘ごとに最小修正方針と対象ファイルを定める。
- テスト追加が必要なら先に設計し、`docs/working/.../testing.md` の更新要否を判断する。
- 仕様変更や新規機能が必要なら、実装せずに提案として返す。

### 3. Implement

- 影響範囲を最小に保って修正する。
- TypeScript strict と NativeWind `className` ルールを守る。
- 外部 API 呼び出しには例外処理を追加する（import での try/catch はしない）。

### 4. Validate

- `pnpm test` または対象テストを実行し、結果ログを残す。
- テスト未実行の場合は理由と代替検証を明記する。

### 5. Update / Report

- 変更点、解消した指摘、残課題を整理して報告する。
- PR 更新が必要なら、コミットメッセージ案と差分要約を提示する。
