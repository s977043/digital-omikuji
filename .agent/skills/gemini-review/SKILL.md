---
name: gemini-review
description: Gemini CLIを使ったレビュー依頼。
---
# Gemini Review

Gemini CLI (`gemini`) を使用してコードレビューを行います。

## Prerequisites

- `gemini` コマンドがパスに通っていること。

## Usage

付属のスクリプトを使用することで、プロジェクトのコンテキスト（Expo/NativeWind/Japanese）が自動的に注入されます。

### ファイルをレビューする場合

```bash
bash .agent/skills/gemini-review/review.sh path/to/file.tsx
```

### 任意の内容をレビューする場合

```bash
echo "内容" | bash .agent/skills/gemini-review/review.sh
```
