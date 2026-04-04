---
name: e2e-test-review
description: E2E テスト観点とシナリオの妥当性、網羅性、保守性をレビューする。
---

# E2E Test Review

## Purpose

E2E テストが主要導線を十分に押さえ、壊れにくく、意図を説明できるかを評価する。

## Checkpoints

- 主要導線をカバーしているか
- 失敗系や例外系が含まれているか
- テストデータ前提が過剰でないか
- セレクタや待機条件が壊れやすくないか
- リリース判断に使える粒度か

## Output Format

- Summary
- E2E Findings
- Risks
- Missing Scenarios
- Decision
