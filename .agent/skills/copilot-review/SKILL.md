---
name: copilot-review
description: GitHub Copilot CLI (`copilot`) を使ったレビュー依頼。
---
# Copilot Review

GitHub Copilot CLI (`copilot` コマンド) を使用してレビューを行います。

## Prerequisites

- `copilot` コマンドがパスに通っていること。
- `gh auth login` 等で認証済みであること。

## Usage

付属のスクリプトを使用すると、ファイルパス指定で簡単にレビューを依頼できます。スクリプトは `copilot` コマンドを非対話モード (`-p`) で呼び出します。

### ファイルをレビューする場合

```bash
bash .agent/skills/copilot-review/review.sh path/to/file.tsx
```

### 任意の内容をレビューする場合 (標準入力)

```bash
echo "func main() {}" | bash .agent/skills/copilot-review/review.sh
```
