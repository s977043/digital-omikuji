---
name: codex-review
description: Codex CLIを使ったレビュー依頼。tmux経由でcodexコマンドを操作し、ファイルや出力をレビューさせる。
---
# Codex Review (Optimized for Digital Omikuji)

OpenAI Codex CLI（`codex`コマンド）とtmux経由で連携し、**Digital Omikuji プロジェクトのコンテキスト（Expo/NativeWind/Japanese）を踏まえたレビュー**を実行します。

**重要**: 「Codex」= Codex CLIツール（ターミナルコマンド）

## Prerequisites

- `tmux` セッション `dev` が起動していること（`dev` コマンドで起動）。
- ペイン `dev:0.1` に `codex` CLI が待機していること。

## Usage (推奨: スクリプト経由)

付属のスクリプトを使用すると、自動的にプロジェクトコンテキスト（Expo SDK 54, Router v4, etc.）がプロンプトに注入されます。

### ファイルをレビューする場合

```bash
# 相対パスまたは絶対パスを指定
bash .agent/skills/codex-review/review.sh path/to/file.tsx
```

### 直前の出力や任意の内容をレビューする場合

```bash
# パイプで渡す
echo "..." | bash .agent/skills/codex-review/review.sh

# または git diff を渡す
git diff | bash .agent/skills/codex-review/review.sh
```

## Manual Instructions (Fallback)

スクリプトが使えない場合の基本コマンド（Context注入なし）。

### 基本コマンド（macOS互換）

応答を待機して取得する:

```bash
tmux clear-history -t dev:0.1 && \
tmux send-keys -t dev:0.1 "内容をここに" && \
tmux send-keys -t dev:0.1 C-m && \
for i in {1..60}; do
  if tmux capture-pane -t dev:0.1 -p | grep -q "^›"; then break; fi
  sleep 1
done && \
tmux capture-pane -t dev:0.1 -p -S -100
```

### tmuxペイン構成

```
┌─────────────┬─────────────┐
│ 0: Claude   │ 1: Codex    │  ← dev:0.1
└─────────────┴─────────────┘
```
