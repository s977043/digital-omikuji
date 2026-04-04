---
name: production-readiness-review
description: 本番投入前に運用上の安全性と障害耐性を評価する。
---

# Production Readiness Review

## Purpose

本番投入前に、運用上の安全性と障害耐性を評価する。

## Checkpoints

- デプロイ手順が定義済みか
- ロールバック可能か
- 監視設定があるか
- アラート条件が妥当か
- feature flag で制御可能か
- 障害時の連絡・初動が明確か

## Output Format

- Summary
- Operational Risks
- Missing Readiness Items
- Recommended Actions
- Release Recommendation
