---
name: ui-skills
description: AIエージェントが作成したUIを校正するための制約ルールセット。Expo/React Native/NativeWind向けにカスタマイズ。
---

# UI Skills

AIエージェントが作成したUIを校正するための制約ルールセット。
オリジナル: [ui-skills.com](https://ui-skills.com/) をExpo/React Native/NativeWind向けにカスタマイズ。

## 使い方

- `/ui-skills`
  この会話内のすべてのUI作業にこれらの制約を適用

- `/ui-skills <file>`
  ファイルを以下の制約に照らしてレビューし、出力：
  - **violations**: 違反箇所（該当行/スニペットを引用）
  - **why it matters**: なぜ重要か（1文）
  - **a concrete fix**: 具体的な修正案（コードレベル）

---

## Stack（技術スタック）

- NativeWind のデフォルトスタイルを使用（カスタム値が既存の場合、または明示的に要求された場合を除く）
- JavaScript アニメーションが必要な場合は **Moti** + **Reanimated** を使用
- クラス結合ロジックには `cn` ユーティリティ（`clsx` + `tailwind-merge`）を使用

## Components（コンポーネント）

- キーボード/フォーカス動作があるものには、React Native の標準アクセシビリティ機能を使用
  - `accessible`, `accessibilityLabel`, `accessibilityRole`, `accessibilityState`
- プロジェクトの既存コンポーネントを最優先で使用
- 同一画面内でコンポーネントライブラリを混在させない
- アイコンのみのボタンには必ず `accessibilityLabel` を追加
- キーボード/フォーカス動作を手動で再実装しない（明示的に要求された場合を除く）
- `Pressable` コンポーネントには `hitSlop` を適切に設定（最低44x44タッチ領域）

## Interaction（操作）

- 破壊的・不可逆的な操作には確認ダイアログを使用（`Alert.alert` または カスタムモーダル）
- ローディング状態にはスケルトン表示を推奨
- 全画面の高さには `flex: 1` を使用（`h-screen` 禁止）
- 固定要素には `react-native-safe-area-context` で SafeArea を尊重
- エラーは操作が発生した場所の近くに表示
- `TextInput` で paste をブロックしない

## Animation（アニメーション）

- 明示的に要求されない限りアニメーションを追加しない
- Reanimated でコンポジタプロパティのみアニメーション（`transform`, `opacity`）
- レイアウトプロパティをアニメーションしない（`width`, `height`, `top`, `left`, `margin`, `padding`）
- ペイントプロパティ（`backgroundColor`）のアニメーションは小さなUI（テキスト、アイコン）以外では避ける
- 入場アニメーションには `ease-out` を使用
- インタラクションフィードバックは `200ms` を超えない
- 画面外ではループアニメーションを一時停止
- **`reduceMotion`** 設定を尊重（Reanimated の `ReducedMotionConfig`）
- 明示的に要求されない限りカスタムイージングカーブを導入しない
- 大きな画像や全画面サーフェースのアニメーションを避ける

## Typography（タイポグラフィ）

- 数値データには `tabular-nums` フォント機能を使用（フォントがサポートしている場合）
- 密なUIには `numberOfLines` で行数制限、または `ellipsizeMode` を使用
- 明示的に要求されない限り `letterSpacing` を変更しない

## Layout（レイアウト）

- 固定 `z-index` スケールを使用（任意の `z-*` 値禁止）
  - 推奨: `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`
- 正方形要素には `size-*` を使用（`w-*` + `h-*` の代わりに）
- `SafeAreaView` でノッチ/ホームインジケーターを考慮

## Performance（パフォーマンス）

- 大きな `blur` や `backdrop-filter` サーフェースをアニメーションしない
- レンダーロジックで表現できることに `useEffect` を使用しない
- `FlatList` / `FlashList` で長いリストを仮想化
- 画像は適切なサイズにリサイズ（`expo-image` 推奨）

## Design（デザイン）

- 明示的に要求されない限りグラデーションを使用しない
- 紫やマルチカラーのグラデーションを使用しない
- グロー効果を主要なアフォーダンスとして使用しない
- 明示的に要求されない限り NativeWind デフォルトのシャドウスケールを使用
- 空状態には1つの明確な次のアクションを提示
- 1画面あたりのアクセントカラー使用を1色に制限
- 新しい色を導入する前に既存テーマまたは NativeWind カラートークンを使用

---

## プロジェクト固有のルール

このセクションはプロジェクト固有のルールを追加する場所です。

- i18n: すべてのユーザー向けテキストは `react-i18next` の `t()` 関数を使用
- フォント: `@expo-google-fonts/shippori-mincho` を日本語テキストに使用
