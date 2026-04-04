# AI Design Agents

このディレクトリには、UI / UX / Frontend / Quality / Production まわりを専門観点で扱う 11 体のエージェント定義を配置します。

## 構成

各エージェントは以下 4 ファイルで構成します。

- `agent.md`: 役割、責務、入力、出力、必須確認項目
- `system-prompt.md`: 判断優先度と振る舞い
- `rules.md`: レビュー時の行動規範
- `output-contract.md`: 出力形式

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

## 使い分け

- 新画面追加: `ui-manager`, `ux-manager`, `accessibility-manager`, `content-design-manager`
- 新コンポーネント追加: `design-system-manager`, `frontend-manager`, `accessibility-manager`, `ui-manager`
- 大規模リファクタリング: `architecture-manager`, `frontend-manager`, `performance-manager`, `quality-manager`
- リリース前確認: `qa-ui-test-manager`, `quality-manager`, `performance-manager`, `production-manager`
- 障害後振り返り: `production-manager`, `quality-manager`, `architecture-manager`
