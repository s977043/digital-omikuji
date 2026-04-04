# Usage Guide

## Purpose

11 体構成のエージェントを、Digital Omikuji の既存運用にどう当てはめるかを示す実務向けガイドです。

## 基本方針

- SSOT は `AGENTS.md`
- UI 判断の正本は `DESIGN.md` と `docs/design-system/`
- ムードと参考表現は `docs/design/design_guidelines.md` を補助線として使う
- `.agent/ai-design-agents/` は専門観点を補強するオーバーレイとして使う

## 最初の 1 手

- 画面レビューから始めるなら `ui-manager` と `ux-manager`
- 実装レビューから始めるなら `frontend-manager` と `design-system-manager`
- リリース前確認から始めるなら `qa-ui-test-manager` と `quality-manager`
- 迷ったら `README.md` → `AGENTS.md` → `DESIGN.md` → `docs/design-system/` → `docs/design/design_guidelines.md` → `.agent/ai-design-agents/README.md` の順で読む

## 最初に使う 4 体

### Phase 1

- `ui-manager`
- `ux-manager`
- `frontend-manager`
- `design-system-manager`

### 使う場面

- 画面追加や改善のレビュー
- コンポーネント設計の相談
- デザイン差分の言語化
- PR の UI / 実装観点レビュー

## 次に広げる 4 体

### Phase 2

- `accessibility-manager`
- `qa-ui-test-manager`
- `performance-manager`
- `content-design-manager`

### 使う場面

- UI 変更後の監査強化
- テスト観点整理
- 体感性能の劣化確認
- 文言や用語の見直し

## 最後に固める 3 体

### Phase 3

- `architecture-manager`
- `quality-manager`
- `production-manager`

### 使う場面

- 大規模変更前の設計確認
- リリース可否の判断支援
- 本番運用と障害対応の見直し

## タスク別の推奨組み合わせ

### 新画面追加

- `ui-manager`
- `ux-manager`
- `accessibility-manager`
- `content-design-manager`

### 新コンポーネント追加

- `design-system-manager`
- `frontend-manager`
- `accessibility-manager`
- `ui-manager`

### 大規模リファクタリング

- `architecture-manager`
- `frontend-manager`
- `performance-manager`
- `quality-manager`

### リリース前最終確認

- `qa-ui-test-manager`
- `quality-manager`
- `performance-manager`
- `production-manager`

## このリポジトリでの読み順

1. `AGENTS.md`
2. `DESIGN.md`
3. `docs/design-system/`
4. `docs/design/design_guidelines.md`
5. `.agent/ai-design-agents/README.md`
6. `.agent/ai-design-agents/agents/README.md`
7. `.agent/ai-design-agents/skills/README.md`
8. 対象エージェントの `agent.md`
9. 対象スキルの `SKILL.md`
