# Sample Production Readiness

## Summary

デプロイ手順はありますが、ロールバックとアラート運用の具体性が不足しています。

## Operational Risks

- PROD-001 / High / rollback: 失敗時の戻し手順が定義されていません。

## Missing Readiness Items

- 監視対象一覧
- オンコール初動

## Recommended Actions

- ロールバック Runbook と段階リリース条件を追加してください。

## Release Recommendation

`needs_revision`
