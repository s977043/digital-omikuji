# AI エージェント運用フロー

本プロジェクトの AI 運用は「plan → implement → review → security」を基本とし、役割分担を固定化します。
同一エージェントで実装とレビューを兼任しないことを推奨します。

## 基本フロー

1. **plan**: 仕様整理とタスク分解
2. **implement**: 実装とテスト追加
3. **review**: 差分レビューと改善指摘
4. **security**: セキュリティ観点の監査

## 役割マッピング（現行エージェントに接続）

| フェーズ | 主担当エージェント | 期待成果物 | 定義ファイル |
| --- | --- | --- | --- |
| plan | project-planner | 計画 / タスク分解 | `.agent/agents/project-planner.md` |
| implement | frontend-specialist / backend-specialist / mobile-developer（必要に応じて orchestrator が調整） | 実装 + テスト追加 | `.agent/agents/frontend-specialist.md`, `.agent/agents/backend-specialist.md`, `.agent/agents/mobile-developer.md`, `.agent/agents/orchestrator.md` |
| review | test-engineer / debugger | テスト / 品質確認 | `.agent/agents/test-engineer.md`, `.agent/agents/debugger.md` |
| security | security-auditor | セキュリティ監査 | `.agent/agents/security-auditor.md` |

## 補助エージェント（必要時）

- **documentation-writer**: ドキュメント更新と整備 (`.agent/agents/documentation-writer.md`)
- **performance-optimizer**: 性能プロファイルと改善 (`.agent/agents/performance-optimizer.md`)
- **devops-engineer**: CI/CD と運用整備 (`.agent/agents/devops-engineer.md`)
- **database-architect**: DB 設計や最適化 (`.agent/agents/database-architect.md`)
- **seo-specialist**: Web の可視性改善 (`.agent/agents/seo-specialist.md`)
- **penetration-tester**: 攻撃観点の検証 (`.agent/agents/penetration-tester.md`)
- **explorer-agent**: 既存構成の調査 (`.agent/agents/explorer-agent.md`)

## 運用ルール（要点）

- plan/implement/review/security を順番に回し、レビューは別エージェントで行う。
- 実装は対象領域に応じて `frontend-specialist` / `backend-specialist` / `mobile-developer` を選択する。
- 複数領域に跨る場合は `orchestrator` で調整する。
- security は最終工程で、指摘があれば implement に差し戻す。
