---
id: chrome-devtools-ui-survey
title: "Chrome DevTools UI調査"
description: "ユーザーインタフェースの構造を記録し、スクリーンショットを保管するAgent Skill。Codexに必要なファイルと命令をL1〜L3で提供します。"
entryScript: "skills/chrome-devtools/run.js"
contexts:
  - Codex
tags:
  - mcp
  - ui
  - chrome
---

## 目的

1. 対象ページのUIをChrome DevToolsで調査し、重要なエリア／要素をスクリーンショットで残す。
2. そのスクリーンショットやメモを`artifacts/screenshots/`に置き、リファレンスにする。

## 手順

1. **L1**: `skills/index.json`のメタデータを読み込み、CodexにこのSkillを認識させる。
2. **L2**: この`SKILL.md`を参照し、Codexに必要なファイルパス、期待される成果物、コマンドの流れを教える。
3. **L3**: `skills/chrome-devtools/run.js`を実行し、`artifacts/screenshots/`にフォルダーとプレースホルダーを用意する。
4. 実際のスクリーンショットやdevtools情報は`artifacts/screenshots/`に配置し、Codexにフィードバックを与える。
5. 完了したら履歴を`AGENTS.md`にも記録し、次回Agent Skills選択時に連続性を保つ。
