---
name: agent-browser
description: Vercel製 CLI「agent-browser」でブラウザ操作を自動化する手順。open/goto・snapshot(-i)・ref優先のclick/fill・wait・screenshot・closeが中心。いつ使うかと失敗時の定石を含む。
---

# Browser Automation with agent-browser

## いつ使うか
- 実際の画面挙動を確認したい（クリック、遷移、モーダル表示など）
- スクリーンショットやPDFで証跡を残したい
- DOMが動的で、HTML取得だけでは精度が出ない場合
- テキスト抽出を「画面上の要素」基準で行いたい

## インストール
- `npm install -g agent-browser`
- 初回セットアップ: `agent-browser install`（Chromium ダウンロード）
- 動作確認: `agent-browser -h`

## 基本方針（重要）
1. **ref優先**: `snapshot -i` の参照ID（@e1 等）を使い、CSS指定は最後の手段
2. **画面が変われば再snapshot**: モーダル/遷移/リスト更新のたびに取り直す
3. **待つ**: `wait --load networkidle` や `wait --url/--text` を併用して安定化
4. **証跡を残す**: 最後に `screenshot`（必要なら `pdf`）
5. **取得は最小限**: 必要なテキストだけ `get text` などで抜く
6. 認証が必要なら `state save/load` でセッション再利用を検討

## コア手順（テンプレ）
```bash
agent-browser open "<url>"          # goto/navigate はエイリアス
agent-browser snapshot -i           # @e1, @e2 ... を取得（インタラクティブのみ）
agent-browser click @e1             # refで操作（fill/type/click）
agent-browser wait --load networkidle
agent-browser snapshot -i           # 画面が変わったら取り直す
agent-browser screenshot "capture.png"
agent-browser close
```

## よく使うコマンド
- ナビゲーション: `open <url>` / `back` / `forward` / `reload` / `close`
- 解析: `snapshot` / `snapshot -i` / `snapshot -c` / `snapshot --json`
- 操作: `click @e1` / `fill @e2 "text"` / `type @e2 "text"` / `press Enter` / `scrollintoview @e1` / `scroll down 500`
- 取得: `get text @e1` / `get value @e2` / `get title` / `get url`
- 待機: `wait @e1` / `wait 1500` / `wait --text "Success"` / `wait --url "**/dashboard"` / `wait --load networkidle`
- 意味で探す: `find role button click --name "Submit"` / `find label "Email" fill "user@test.com"` / `find text "Sign In" click`
- 証跡: `screenshot [path]` / `pdf [path]`
- セッション: `state save <path>` / `state load <path>`

## 失敗しがちな所の定石
- クリック失敗 → `scrollintoview` → `wait` → 再クリック
- refが効かない/画面が変わった → `snapshot -i` を取り直し（古いrefは捨てる）
- 遷移が遅い → `wait --load networkidle` と `wait --url` を併用
- 解析を機械処理したい → `--json` を付けて出力を安定化

## セキュリティ注意
- パスワードやトークンをログや履歴に残さない
- 認証情報は `state save/load` などで安全に再利用し、共有しない
- サイトの規約/robots/アクセス制限を尊重する
