---
name: ui-regression-check
description: UI 回帰の観点を整理し、主要画面と状態差分の確認漏れを洗い出す。
---

# UI Regression Check

## Purpose

UI 変更による回帰リスクを特定し、確認が必要な画面状態と導線を洗い出す。

## Checkpoints

- 主要導線が対象に含まれているか
- loading / empty / error / success が確認対象か
- レスポンシブ差分があるか
- 共通コンポーネント影響があるか
- スクリーンショット比較や手動確認が必要か

## Output Format

- Summary
- Regression Targets
- Risks
- Missing Checks
- Decision
