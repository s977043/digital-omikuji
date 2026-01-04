# 🚀 ローカル環境での動作確認 - ステップバイステップガイド

## ✅ 準備状況

```text
✓ Node.js: v22.20.0（推奨: 20.x）
✓ pnpm: 9.15.2
✓ git: develop ブランチ
✓ VersionInfo テスト: 6/6 PASS ✅
✓ 実装統合: 完了
```text

---

## 📋 2つの確認方法

### 方法A: コマンドラインでテスト実行（5分）✨ 最も簡単

```bash
# VersionInfo テストのみ実行
pnpm test -- VersionInfo.test.ts

# 期待される結果:
# PASS utils/__tests__/VersionInfo.test.ts
# Tests: 6 passed, 6 total ✅
```text

**このコマンドで確認できる:**

- ✅ バージョン情報取得機能が正常に動作
- ✅ UI 表示用の短縮形生成が正常に動作
- ✅ コンソール出力のフォーマットが正常

---

### 方法B: Web開発サーバーで動作確認（10分）🎨 ビジュアル確認

```bash
# Web開発サーバーを起動（ブラウザで確認）
pnpm web
```text

**起動後のステップ:**

#### 1️⃣ ブラウザが自動で起動

```text
http://localhost:19006
# または http://127.0.0.1:19006
```text

#### 2️⃣ 開発者ツールを開く

```text
F12キー または Ctrl+Shift+I
```text

#### 3️⃣ Console タブで確認

```text
以下のメッセージが表示される:

🚀 Digital Omikuji v0.1.1 | Build: 2026-01-01T... | 🌍 Env: development

特徴:
- 色: 緑色 (#4CAF50)
- スタイル: 太字
- タイミング: ページ読み込み直後
```text

#### 4️⃣ UI で表示確認

```text
メイン画面（/）:
├─ 画面右下: "v0.1.1" が薄いグレーで表示
├─ 位置: 右下 2px のマージン
├─ 透明度: 40%（目立たない）
└─ フォント: monospace

履歴画面（/history）:
├─ [履歴] をクリック
├─ 同じく右下に "v0.1.1" が表示
└─ 同じスタイル
```text

---

## 🔍 詳細確認チェックリスト

### ✅ コンソール出力の確認

```javascript
// F12 > Console で以下を実行して確認:
console.log("環境確認:");
console.log(process.env.NODE_ENV); // "development"
```text

**確認項目:**

- [ ] 🚀 で始まるメッセージが表示
- [ ] v0.1.1 がバージョン部分に含まれる
- [ ] Build タイムスタンプが ISO 形式
- [ ] 🌍 Env: development と表示

### ✅ UI表示の確認

```text
メイン画面:
 ┌─────────────────────┐
 │  おみくじアプリ UI  │
 │                     │
 │                 v0.1.1
 └─────────────────────┘
      ↑ 右下隅に小さく表示

履歴画面:
 ┌─────────────────────┐
 │  履歴一覧           │
 │  - 大吉 (1/1)       │
 │  - 中吉 (12/31)     │
 │                 v0.1.1
 └─────────────────────┘
      ↑ 同じく表示
```text

**確認項目:**

- [ ] 画面右下に v0.1.1 が見える
- [ ] テキストが薄いグレー色
- [ ] 目立たず、邪魔にならない
- [ ] 複数ページで表示される

### ✅ 開発者ツールの確認

```text
F12 > Elements/Inspector で右下を選択:

<View className="absolute bottom-2 right-2 p-1">
  <Text className="text-xs text-white/40 font-mono">
    v0.1.1
  </Text>
</View>

確認項目:
- [ ] 要素がレンダリングされている
- [ ] className に text-white/40 が含まれる
- [ ] position: absolute, bottom: 8px, right: 8px
```text

---

## 🧪 テスト実行の詳細ステップ

### Step 1: テストを実行

```bash
cd /home/minewo/github/digital-omikuji

# VersionInfo テストのみ実行
pnpm test -- VersionInfo.test.ts --verbose
```text

### Step 2: 出力を確認

```text
PASS utils/__tests__/VersionInfo.test.ts

VersionInfo
  getVersionInfo
    ✓ should return version info object with required properties
    ✓ should return a valid package version
    ✓ should return a valid ISO date string for buildTime
    ✓ should have a valid environment
  getVersionDisplay
    ✓ should return a short version string
  getDetailedVersionInfo
    ✓ should return a detailed version string

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total ✅
```text

### Step 3: テスト内容の確認

```typescript
// utils/__tests__/VersionInfo.test.ts の内容:

1. getVersionInfo()
   └─ パッケージバージョン "0.1.1" が取得できる
   └─ ビルド時刻が ISO 形式で取得できる
   └─ 環境が正しく判定される

2. getVersionDisplay()
   └─ UI表示用の短縮形 "v0.1.1" が返される

3. getDetailedVersionInfo()
   └─ 詳細情報が正しくフォーマットされている
```text

---

## 🚀 Web開発サーバーの詳細ステップ

### Step 1: 開発サーバー起動

```bash
cd /home/minewo/github/digital-omikuji

# Web開発サーバーを起動
pnpm web

# ターミナル出力例:
# 💿 Loading Metro...
# ✅ Metro server started
# 📲 To open app in browser, press "w"
```text

### Step 2: ブラウザで確認

```text
Press "w" or manually open: http://localhost:19006
```text

### Step 3: コンソール確認

```text
F12 > Console タブ

見た目:
┌──────────────────────────────────────────────┐
│ 🚀 Digital Omikuji v0.1.1 | Build: ...       │
│    | 🌍 Env: development                      │
│                                               │
│ (その他のログ)                               │
└──────────────────────────────────────────────┘
```text

### Step 4: ページを操作

```text
1. シェイク機能をテスト
   └─ マウスを上下に動かすか、
      スマートフォンで実際に振る

2. 履歴ページに移動
   └─ [履歴] ボタンをクリック
   └─ 右下に v0.1.1 が表示されることを確認

3. コンソールの出力を再確認
   └─ エラーがないことを確認
```text

---

## 📋 最終確認チェックリスト

```text
テスト確認:
 □ pnpm test -- VersionInfo.test.ts 実行
 □ 6/6 テストが PASS
 □ エラーメッセージなし

Web開発サーバー確認（オプション）:
 □ pnpm web で起動
 □ ブラウザで http://localhost:19006 にアクセス
 □ F12 で開発者ツール開く
 □ Console タブで緑色メッセージを確認
 □ v0.1.1 がバージョン部分に表示

UI確認（オプション）:
 □ メイン画面の右下に v0.1.1
 □ 履歴画面の右下に v0.1.1
 □ テキストが薄いグレー（目立たない）
```text

---

## ✅ 確認完了時の確認

すべてのチェックが完了したら:

```text
✅ ローカル動作確認: 完了
├─ テスト: 6/6 PASS
├─ UI表示: 確認完了
└─ コンソール出力: 確認完了

次のステップ:
 → Vercel へのデプロイ
 → 本番環境での確認
```text

---

## 💡 トラブルシューティング

### ❌ テストが失敗する場合

```bash
# 1. 依存関係を確認
pnpm install

# 2. キャッシュをクリア
pnpm test -- --clearCache

# 3. 再実行
pnpm test -- VersionInfo.test.ts
```text

### ❌ Web開発サーバーが起動しない

```bash
# 1. 既存プロセスを停止
lsof -i :19006
kill -9 <PID>

# 2. キャッシュをクリア
pnpm exec expo cache clean

# 3. 再起動
pnpm web
```text

### ❌ コンソールメッセージが見えない

```bash
# 1. ページをリロード（F5）
# 2. キャッシュをクリア（Ctrl+Shift+Delete）
# 3. 再度リロード（F5）
# 4. Console タブで確認
```text

---

## 📚 参考ファイル

- **実装**: [utils/VersionInfo.ts](../utils/VersionInfo.ts)
- **テスト**: [utils/**tests**/VersionInfo.test.ts](../utils/__tests__/VersionInfo.test.ts)
- **統合 - レイアウト**: [app/\_layout.tsx](../app/_layout.tsx#L4)
- **統合 - メイン**: [app/index.tsx](../app/index.tsx#L17)
- **統合 - 履歴**: [app/history.tsx](../app/history.tsx#L6)

---

## 🎯 実行コマンドまとめ

```bash
# 最も簡単: テストで確認
pnpm test -- VersionInfo.test.ts

# ビジュアル確認: Web開発サーバー
pnpm web

# 開発者ツール開く
F12

# コンソール見る
Console タブ
```text

確認完了です！🎉
