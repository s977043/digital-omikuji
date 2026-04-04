---
name: bundle-review
description: バンドルサイズ、分割読み込み、依存追加の妥当性をレビューする。
---

# Bundle Review

## Purpose

不要な依存や過大な初期ロードを避けるため、バンドル観点のリスクを評価する。

## Checkpoints

- 依存追加が妥当か
- tree-shaking しにくい import がないか
- 分割読み込みの余地があるか
- 初期ロードに不要なコードが含まれていないか
- 共通チャンクに過剰な責務がないか

## Output Format

- Summary
- Bundle Findings
- Risks
- Optimization Ideas
- Decision
