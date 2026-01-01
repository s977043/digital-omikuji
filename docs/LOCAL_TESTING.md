# 🧪 ローカル環境での動作確認ガイド

## 📋 確認手順

### 1️⃣ テストの実行

すべてのテストが正常に動作することを確認します。

```bash
# すべてのテストを実行
pnpm test

# または特定のテストのみ実行
pnpm test -- VersionInfo.test.ts
```

**期待される結果:**

```
Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
```

---

### 2️⃣ ビルドの確認

Web ビルドが正常に完了することを確認します。

```bash
# Webビルド（static生成）
pnpm build
```

**期待される結果:**

```
✅ dist/ ディレクトリが生成される
✅ 以下のファイルが存在:
   - index.html
   - history.html
   - +not-found.html
   - _sitemap.html
   - favicon.ico
   - _expo/ (ディレクトリ)
   - assets/ (ディレクトリ)
```

---

### 3️⃣ 開発サーバーの起動と確認

ローカルで開発サーバーを起動して、ブラウザで動作確認します。

```bash
# Web開発サーバーを起動
pnpm web
```

**起動後:**

- ブラウザが自動で `http://localhost:19006` などで起動
- または手動で開く場合は、ターミナルの指示に従う

---

### 4️⃣ バージョン表示の確認

#### 🖥️ **ブラウザコンソール確認**

1. **開発者ツールを開く**: `F12` または `右クリック → 検査`
2. **Console タブを確認**
3. **以下のメッセージが表示される:**

```
🚀 Digital Omikuji v0.1.1 | Build: <タイムスタンプ> | 🌍 Env: development
```

- 💡 **色**: 緑色の太字
- 📍 **表示タイミング**: アプリ起動時に即座に表示
- ℹ️ **注**: 開発環境なので `Env: development`

#### 🎨 **UI 表示確認**

1. **メイン画面**: 右下隅に `v0.1.1` が薄いグレーで表示

   - 位置: 画面右下 2px
   - 透明度: 40%（text-white/40）
   - フォント: monospace
   - 目立たない

2. **履歴画面**: クリックして履歴ページに移動
   - 同じく右下隅に `v0.1.1` が表示
   - 同じスタイル

---

## 🧪 ローカル環境での確認項目チェックリスト

```
□ テスト実行
  □ 全テストパス
  □ VersionInfo テストが 6/6 パス

□ ビルド確認
  □ pnpm build 成功
  □ dist/ ディレクトリ存在
  □ 必要なファイルすべて生成

□ 開発サーバー起動
  □ pnpm web コマンド実行
  □ localhost で起動

□ コンソール出力確認
  □ F12 で開発者ツール開く
  □ Console タブで緑色メッセージ確認
  □ "v0.1.1" が含まれている

□ UI 表示確認
  □ メイン画面右下に "v0.1.1" 表示
  □ 履歴画面右下に "v0.1.1" 表示
  □ テキストが薄いグレー（目立たない）
```

---

## 🔧 トラブルシューティング

### ❌ テストが失敗する場合

```bash
# 依存関係を再インストール
pnpm install

# キャッシュをクリアして実行
pnpm test -- --clearCache
```

### ❌ ビルドが失敗する場合

```bash
# dist ディレクトリを削除
rm -rf dist

# キャッシュをクリア
pnpm exec expo cache clean

# 再度ビルド
pnpm build
```

### ❌ 開発サーバーが起動しない場合

```bash
# プロセスを確認して終了
lsof -i :19006
kill -9 <PID>

# 再度起動
pnpm web
```

### ❌ コンソールにメッセージが表示されない場合

1. ページをリロード（F5）
2. キャッシュをクリア（Ctrl+Shift+Delete）
3. 再度リロード

---

## 📱 環境情報

**ローカル環境の要件:**

- Node.js: 20.x
- pnpm: 9.15.2
- ブラウザ: Chrome/Firefox/Edge（最新）

**確認環境:**

```bash
node --version       # v20.x
pnpm --version       # 9.15.2
npm --version        # (参考)
```

---

## 🚀 確認完了後

すべての確認が完了したら:

1. ローカル変更をコミット（必要に応じて）
2. リモートにプッシュ
3. Vercel にデプロイ

```bash
git push origin develop
```

---

## 💡 参考資料

- **VersionInfo 実装**: [utils/VersionInfo.ts](../utils/VersionInfo.ts)
- **テスト実装**: [utils/**tests**/VersionInfo.test.ts](../utils/__tests__/VersionInfo.test.ts)
- **Expo ドキュメント**: https://docs.expo.dev/
- **Vercel デプロイ**: https://vercel.com/docs
