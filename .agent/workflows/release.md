---
title: "リリースワークフロー"
description: "develop → main へのリリース手順"
version: "1.0"
last_updated: "2026-01-19"
---

# リリースワークフロー

`develop` ブランチから `main` ブランチへのリリース手順です。

## 1. リリース準備

### 1.1 リリース対象の確認
- `develop` ブランチの全ての機能が動作することを確認
- リグレッションテストを実行
- リリースノートを準備

### 1.2 バージョン更新
`package.json` の `version` を更新（semver に従う）

- パッチ: `1.1.0` → `1.1.1` （バグ修正）
- マイナー: `1.1.0` → `1.2.0` （新機能追加）
- メジャー: `1.1.0` → `2.0.0` （破壊的変更）

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
# package.json を編集
git add package.json
git commit -m "chore: bump version to 1.2.0"
```

## 2. ビルド確認

### 2.1 各プラットフォームでビルド
```bash
pnpm build          # Web版ビルド
pnpm test           # 全テスト実行
pnpm test:e2e:web   # E2Eテスト実行
```

### 2.2 動作確認
- Web版を起動して手動テスト
- 主要な機能が正常動作することを確認

## 3. リリースPR作成

### 3.1 PR作成
```bash
git push -u origin release/v1.2.0
```

GitHub でPRを作成:
- **Base**: `main`
- **Head**: `release/v1.2.0`
- **タイトル**: `Release v1.2.0`

### 3.2 PR本文
```markdown
## リリース内容

### 新機能
- おみくじ結果シェア機能追加
- 多言語対応（英語）追加

### バグ修正
- シェイク感度の調整
- 音声再生タイミング修正

### 改善
- アニメーション パフォーマンス向上
- UI/UX微調整

## テスト結果

- [x] Web版動作確認
- [x] iOS版ビルド確認
- [x] Android版ビルド確認
- [x] E2Eテスト合格

## デプロイ後の確認項目

- [ ] 本番環境で動作確認
- [ ] エラーログ監視
- [ ] パフォーマンス監視
```

## 4. マージとタグ付け

### 4.1 mainへマージ
レビュー承認後、**Merge Commit** で `main` にマージ（Squash Mergeは使用しない）

### 4.2 Gitタグ作成
```bash
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

### 4.3 developへの逆マージ
```bash
git checkout develop
git merge main
git push origin develop
```

## 5. デプロイ

### 5.1 Webデプロイ
- Vercel/Netlify が自動デプロイ
- 本番URLで動作確認: https://your-app.vercel.app

### 5.2 モバイルデプロイ（必要な場合）
```bash
eas build --platform all
eas submit --platform all
```

## 6. リリース後の監視

- Sentry でエラー監視
- ユーザーフィードバック収集
- 必要に応じてホットフィックス（[hotfix.md](./hotfix.md) 参照）

---

## 参考リンク

- [AGENTS.md](../../AGENTS.md) - 開発ガイド
- [hotfix.md](./hotfix.md) - ホットフィックス手順
