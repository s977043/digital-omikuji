# Production Standards

## Purpose

本番投入前後の運用安全性を確認するための基準です。

## Principles

- リリースは監視とロールバック込みで考える
- 障害時の初動を事前に定義する
- 段階的な露出制御を可能にする

## Required Checks

- ロールバック可能か
- 監視対象とアラート条件が明確か
- Runbook が参照可能か
- 変更の本番影響を説明できるか
