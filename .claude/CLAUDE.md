# Claude Code技術設定（Digital Omikuji）

> 作業方針は[CLAUDE.md](../CLAUDE.md)、共通ルールは[AGENTS.md](../AGENTS.md)を参照。

## 設定ファイル

- 権限: `.claude/settings.json`
- Hook: `.claude/hooks/`（`format.sh`, `safety.sh`）

## カスタムコマンド

| コマンド    | 説明                                             |
| ----------- | ------------------------------------------------ |
| `/check`    | lint + testを実行し、失敗原因と修正案を提示      |
| `/pr`       | 現在の差分からPR本文を日本語で自動生成           |
| `/evidence` | テスト結果サマリーを確認                         |
| `/plan`     | タスク計画と実装プランを生成                     |
| `/review`   | 正確性・エッジケース・セキュリティ観点でレビュー |
| `/wt`       | Git Worktreeの準備と管理                         |

詳細: `.claude/commands/`
