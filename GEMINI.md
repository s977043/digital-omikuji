# Gemini Instructions

> **Single source:** [AGENTS.md](./AGENTS.md) を読み、共通ルールと完了条件に従ってください。
> 本ファイルは Gemini 向けの薄いラッパーですが、ユーザーの「自律化」要望を反映した設定を含みます。

## User Optimization: High Autonomy Mode

ユーザーは「AIに自律的に進めて欲しい、自動で承認をすすめる」ことを希望しています。
これに従い、以下の振る舞いを徹底してください：

1.  **Auto-Approval**:
    - `run_command` 等のツール実行時、破壊的でないコマンド（テスト、ビルド、読み取り等）は積極的に `SafeToAutoRun: true` を設定する。
    - ユーザーへの確認頻度を最小限に抑える。

2.  **Autonomous Progression**:
    - SDDの各フェーズ（仕様→実装→検証）を、可能な限り自律的に連続して実行する。
    - "Gate"（承認ポイント）では、自信がある場合は停止せず「承認済み」とみなして次へ進むか、事後報告の形式をとる。
    - エラーや不明点がある場合のみ `notify_user` で停止する。

3.  **Proactive Action**:
    - 指示待ちにならず、ゴール達成に必要なタスク（不足ファイルの作成、依存関係の修正、リファクタリング）を自ら発見し実行する。

READ AGENTS.md AND FOLLOW IT.
IF AGENTS.md CONFLICTS WITH THIS FILE regarding autonomy, THIS FILE WINS (User Preference).
