---
title: "ホットフィックスワークフロー"
description: "緊急バグ修正の手順"
version: "1.0"
last_updated: "2026-01-19"
---

# ホットフィックスワークフロー

本番環境で緊急のバグが発見された場合の対応手順です。

## 1. ホットフィックスブランチ作成

`main` ブランチから分岐:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-shake-sensitivity
```

命名規則: `hotfix/fix-<issue-description>`

## 2. 修正実装

### 2.1 最小限の修正
- 影響範囲を最小限に抑える
- バグ修正にフォーカス（新機能追加はしない）
- 必要なテストケースを追加

### 2.2 動作確認
```bash
pnpm test          # テスト実行
pnpm build         # ビルド確認
pnpm start         # ローカル動作確認
```

## 3. PR作成

### 3.1 mainへのPR
```bash
git add .
git commit -m "fix: シェイク感度の閾値を調整"
git push -u origin hotfix/fix-shake-sensitivity
```

GitHub でPRを作成:
- **Base**: `main`
- **Head**: `hotfix/fix-shake-sensitivity`
- **タイトル**: `hotfix: <バグ内容>`
- **ラベル**: `hotfix`, `priority: high`

### 3.2 PR本文
```markdown
## 問題

本番環境でシェイクが反応しづらい問題が報告されました。

## 原因

加速度センサーの閾値が高すぎた（15 → 適正値は10）

## 修正内容

- `utils/ShakeDetector.ts` の閾値を15から10に変更
- テストケースを追加

## 影響範囲

- シェイク検出ロジックのみ
- 他機能への影響なし

## 動作確認

- [x] iPhone実機で動作確認
- [x] Android実機で動作確認
- [x] テスト追加・合格
```

### 3.3 レビュー・マージ
- 最速でレビュー依頼
- CI通過後すぐにマージ（Merge Commit）

## 4. デプロイ

### 4.1 本番デプロイ
```bash
git checkout main
git pull origin main
# 自動デプロイ or 手動デプロイ
```

### 4.2 動作確認
本番環境で修正が反映されたことを確認

## 5. developへの反映

### 5.1 cherry-pickで反映
```bash
git checkout develop
git pull origin develop
git cherry-pick <hotfix-commit-hash>
git push origin develop
```

または `develop` へのPRを作成

### 5.2 バージョン更新
`main` で `package.json` のバージョンをパッチアップ:

```bash
git checkout main
# package.json: 1.2.0 → 1.2.1
git add package.json
git commit -m "chore: bump version to 1.2.1"
git push origin main
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin v1.2.1

# developにもマージ
git checkout develop
git merge main
git push origin develop
```

## 6. 事後対応

### 6.1 インシデントレポート作成（任意）
`docs/incidents/YYYYMMDD_<issue>.md` を作成:

- 発生日時
- 問題の詳細
- 影響範囲
- 根本原因
- 修正内容
- 再発防止策

### 6.2 再発防止策の検討
- テストカバレッジの見直し
- QAプロセスの改善
- モニタリング強化

### 6.3 リリースノート更新
必要に応じてリリースノートにホットフィックス内容を追記

---

## 参考リンク

- [AGENTS.md](../../AGENTS.md) - 開発ガイド
- [release.md](./release.md) - 通常リリース手順
