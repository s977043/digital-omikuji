---
name: deployment-review
description: デプロイ手順、設定差分、リリース手順の安全性をレビューする。
---

# Deployment Review

## Purpose

デプロイ手順と設定が安全で、再現可能で、運用しやすいかを評価する。

## Checkpoints

- 手順が手元再現可能か
- 環境差分が整理されているか
- secrets や設定更新の漏れがないか
- ロールバック条件が明示されているか
- リリース時の確認観点があるか

## Output Format

- Summary
- Deployment Findings
- Risks
- Required Actions
- Decision
