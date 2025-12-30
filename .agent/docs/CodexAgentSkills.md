# Codex で Agent Skills を使う

Speaker Deck の「Codex でも Agent Skills を使いたい」の資料を踏まえて、Digital Omikuji でも Codex 向け Agent Skills を整理するためのガイドです。

## 1. 背景

- MCP サーバーを無数に接続すると不要なメタデータでトークンを圧迫し、セッションが不安定になる（Slide 4〜6）。
- Agent Skills を使うことでタスク全体のコンテキストを一箇所にまとめ、Codex に必要な情報だけを明示的に供給できる（Slide 7〜9）。
- ただし Agent Skills は Claude 固有だったので、Codex 側で再現する仕組みを用意する必要がある（Slide 10〜12）。

## 2. Agent Skills の構成（L1〜L3）

- **L1: Metadata（index.json）** — `.agent/skills/index.json`に Skill ごとの名称、説明、エントリスクリプトなどを定義し、Codex が`.agent/AGENTS.md`経由で認識できる資料とする。
- **L2: Instruction (`SKILL.md`)** — 各 Skill フォルダー内の`SKILL.md`を読み込み、目的、期待値、禁止事項、手順を人間 →Codex に伝播させる。
- **L3: 実行スクリプト** — Node/Python スクリプトを配置し、必要なファイル構造や CLI 呼び出し例を提示した上で具体的な処理をスケジュールする。

## 3. Digital Omikuji への導入例

- `.agent/skills/`フォルダーを新設し、L1〜L3 を再現するテンプレート構成にしました（`.agent/skills/index.json`で Skill 一覧、`.agent/skills/<skill>/SKILL.md`で L2 指示、`.agent/skills/<skill>/run.js`で実行手順）。
- 例として`chrome-devtools`と`youtube-video`の 2Skill を追加し、資料の ①UI 調査・②YouTube ダウンロードに対応。
- スクリプトは`artifacts/`配下のプレースホルダーを作成し、Codex が手動または`yt-dlp`などで接続する土台を提供します。

## 4. Codex と Agent Skills の運用フロー

1. Codex を起動したらまず`.agent/AGENTS.md`を読み込み、本リポジトリに定義されている Skill ルール（`.agent/docs/CodexAgentSkills.md`を含む）を確認する。
2. `.agent/skills/index.json`から適切な Skill を選び、関連する`SKILL.md`で L2 要件をトレース。
3. L3 スクリプト（例: `.agent/skills/chrome-devtools/run.js`）を実行して、作業用フォルダーやファイルを準備。
4. その後、実際のスクリーンショットや`yt-dlp`コマンドを Codex から指示して実行し、成果物を`artifacts/`以下に置く。
5. 完了したら`.agent/skills/index.json`や`.agent/docs/CodexAgentSkills.md`に要約と必要なら新 Skill 追加のリクエストを追記することで、Knowledge Base を進化させる。

## 5. 次のステップ

1. 新しい Skill を追加するには`.agent/skills/index.json`にエントリを登録し、`SKILL.md`+実行スクリプトを作成する。
2. `.agent/AGENTS.md`内の Codex セクションに新 Skill 選択手順やコマンドプレイを追記すると、他のエージェントも使いやすくなる。
3. 必要に応じて`scripts/skills/`に共通ユーティリティ（ファイル名正規化、ytdlp オプション生成など）を追加し、Codex からの呼び出しを安定させる。

## 参考

- [Codex でも Agent Skills を使いたい](https://speakerdeck.com/gotalab555/codexdemoagent-skillswoshi-itai) (Speaker Deck)
