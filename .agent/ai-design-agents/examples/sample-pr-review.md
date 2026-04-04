# Sample PR Review

## Summary

変更目的は明確ですが、状態管理の責務が画面コンポーネントに寄りすぎています。

## Key Findings

- F-001 / High / frontend: 画面とデータ整形ロジックが密結合です。

## Risks

- 今後の UI 変更で回帰しやすくなります。

## Requested Changes

- データ整形を hook または util へ分離してください。

## Decision

`needs_revision`
