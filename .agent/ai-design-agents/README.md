# AI Design / Frontend / Quality / Production Agents

このディレクトリは、UI、UX、フロントエンド、デザインシステム、アクセシビリティ、品質、運用を横断してレビューと改善提案を行う 11 体の専門エージェントひな形です。

## この導入で目指すこと

- UI 品質の安定化
- UX 改善の標準化
- フロントエンド実装品質の向上
- デザインシステム運用の統制
- アーキテクチャ整合性の維持
- 品質基準の明文化
- 本番運用の安全性向上

## 収録エージェント

- `ui-manager`
- `ux-manager`
- `frontend-manager`
- `design-system-manager`
- `accessibility-manager`
- `qa-ui-test-manager`
- `performance-manager`
- `content-design-manager`
- `architecture-manager`
- `quality-manager`
- `production-manager`

## ディレクトリ

- `agents/`: 各エージェントの役割定義
- `skills/`: レビューや監査の実行単位
- `standards/`: 判断基準の骨組み
- `templates/`: 出力テンプレート
- `examples/`: 出力サンプル
- `usage-guide.md`: このリポジトリでの使い分け

## 読み始める場所

- プロジェクト全体像: `../../README.md`
- 実務での使い分け: `./usage-guide.md`
- エージェント一覧: `./agents/README.md`
- スキル運用: `./skills/README.md`
- スキル追加手順: `./skills/CHECKLIST.md`

## Experience

- UI Manager
- UX Manager
- Content Design Manager

## System Governance

- Design System Manager
- Accessibility Manager

## Engineering

- Frontend Manager
- QA / UI Test Manager
- Performance Manager

## Platform / Governance / Operations

- Architecture Manager
- Quality Manager
- Production Manager

## 原則

- 既存資産の再利用を優先する
- 判断理由を必ず明示する
- 推測ではなく観察事実を優先する
- UI / UX / 実装 / 運用を分離して評価する
- 問題指摘だけでなく修正案まで出す
- 破壊的変更は必ず影響範囲を示す

## 出力スタイル

すべてのレビュー結果は原則として以下を含みます。

1. Summary
2. Scope
3. Findings
4. Risks
5. Recommended Changes
6. Decision

## このリポジトリ向けの調整

- 既存の `.agent/` 構成に合わせて、ひな形は `.agent/ai-design-agents/` 配下に配置
- スキルファイル名は既存慣習に合わせて `SKILL.md` を採用
- 実運用では `AGENTS.md` と `docs/design/design_guidelines.md` を優先し、このひな形は専門観点の補助として使う
- スキル追加や更新時は `skills/CHECKLIST.md` と `pnpm validate:skills` を使う

## 推奨導入順

### Phase 1

- `ui-manager`
- `ux-manager`
- `frontend-manager`
- `design-system-manager`

### Phase 2

- `accessibility-manager`
- `qa-ui-test-manager`
- `performance-manager`
- `content-design-manager`

### Phase 3

- `architecture-manager`
- `quality-manager`
- `production-manager`

## 関連ドキュメント

- [AGENTS.md](../../AGENTS.md)
- [design_guidelines.md](../../docs/design/design_guidelines.md)
- [agents/README.md](./agents/README.md)
- [skills/README.md](./skills/README.md)
- [skills/CHECKLIST.md](./skills/CHECKLIST.md)
- [usage-guide.md](./usage-guide.md)
