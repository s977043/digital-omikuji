# AI エージェント運用フロー

本プロジェクトの AI 運用は「plan → implement → review → security」を基本とし、役割分担を固定化します。
同一エージェントで実装とレビューを兼任しないことを推奨します。

## 基本フロー

1. **plan**: 仕様整理とタスク分解
2. **implement**: 実装とテスト追加
3. **review**: 差分レビューと改善指摘
4. **security**: セキュリティ観点の監査

## 役割マッピング（既存定義に接続）

| フェーズ | 主担当エージェント | 期待成果物 | 定義ファイル |
| --- | --- | --- | --- |
| plan | feature-generator | `implementation_plan.md` などの計画 / 仕様整理 | `.agent/agents/feature-generator.md` |
| implement | digital-omikuji-dev | 実装 + テスト追加 | `.agent/agents/digital-omikuji-dev.md` |
| review | pr-manager | PR 本文の整理 / レビュー依頼 | `.agent/agents/pr-manager.md` |
| security | security-auditor | 依存関係/コードの安全性チェック | `.agent/agents/security-manager.md` |

## 補助エージェント（必要時）

- **documentation-manager**: ドキュメント更新と整備 (`.agent/agents/documentation-manager.md`)
- **test-writer**: テスト補強と CI 復旧 (`.agent/agents/test.md`)
- **refactor-buddy**: 影響を抑えたリファクタ (`.agent/agents/refactor.md`)
- **ui-component-generator**: UI コンポーネント生成 (`.agent/agents/ui-component-generator.md`)
- **repo-maintainer**: 依存関係 / CI の保守 (`.agent/agents/repo-maintainer.md`)

## 運用ルール（要点）

- plan/implement/review/security を順番に回し、レビューは別エージェントで行う。
- 変更が大きい場合は plan で合意形成してから implement に進む。
- security は最終工程で、指摘があれば implement に差し戻す。
