---
title: "開発フロー・AI連携ガイドライン"
description: "本プロジェクトにおける開発プロセス、コード品質基準、AIエージェントの役割分担を定義します。"
version: 2.0
last_updated: "2025-12-31"
target_audience: ["developer", "ai_agent"]
---

# 開発フロー・AI 連携ガイドライン

## 技術スタック

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Routing**: Expo Router
- **State Management**: React Hooks (useState, useReducer, useContext)
- **Testing**: Jest, React Native Testing Library
- **Package Manager**: pnpm

## 開発フロー

### 基本プロセス

1. **Issue 確認**: 実装すべき機能やバグ修正の内容を把握。
2. **Branch 作成**: `feature/xxx` や `fix/xxx` ブランチを作成。
3. **実装 & テスト**: コードの実装とテストコードの記述（TDD 推奨）。
4. **Lint & Type Check**: `pnpm lint` および `tsc` で静的解析を通す。
5. **PR 作成**: GitHub で Pull Request を作成し、レビューを依頼。

### コード品質基準

- **TypeScript**: `strict: true` 準拠。`any` 型は原則禁止。
- **Lint**: ESLint のルールに従う。
- **Test**: 主要なロジックと UI コンポーネントにはテストを書く。
- **Style**: NativeWind クラスを使用し、インラインスタイルは避ける（動的な値を除く）。

## 実装ガイドライン

### コンポーネント設計 (React Native)

```typescript
import { View, Text, Pressable } from "react-native";
import { styled } from "nativewind";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ label, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-blue-500 p-4 rounded-lg active:opacity-80"
    >
      <Text className="text-white text-center font-bold">{label}</Text>
    </Pressable>
  );
};
```

### カスタムフック設計

```typescript
export const useOmikuji = () => {
  const [result, setResult] = useState<string | null>(null);

  const draw = useCallback(() => {
    // ロジック実装
    const newResult = determineFortune();
    setResult(newResult);
  }, []);

  return { result, draw };
};
```

### テスト設計 (Jest / RNTL)

```typescript
import { render, fireEvent, screen } from "@testing-library/react-native";
import { PrimaryButton } from "./PrimaryButton";

test("ボタンが表示され、タップできる", () => {
  const onPressMock = jest.fn();
  render(<PrimaryButton label="テスト" onPress={onPressMock} />);

  const button = screen.getByText("テスト");
  expect(button).toBeTruthy();

  fireEvent.press(button);
  expect(onPressMock).toHaveBeenCalled();
});
```

## AI エージェントの活用

### 役割分担

- **GitHub Copilot**:

  - コーディング時のリアルタイム補完
  - 基本的な関数やコンポーネントの生成
  - テストコードの自動生成

- **Docs Agent / Maintainer Agent**:
  - `.agent/` 配下の設定に基づくドキュメント管理やリファクタリング提案

### プロンプトエンジニアリングのヒント

- "Expo Router を使っています" と明示する。
- "NativeWind でのスタイリングをお願い" と指定する。
- モバイルアプリ特有の制約（画面サイズ、プラットフォーム差分）を意識した指示を出す。

## トラブルシューティング

- **ビルドエラー**: `npx expo start -c` でキャッシュをパージしてみる。
- **依存関係エラー**: `node_modules` を削除して `pnpm install` を再実行。
- **Web/iOS/Android の差異**: `Platform.OS` を使ってプラットフォームごとの分岐を行うか、ファイル拡張子 (`.ios.tsx`, `.android.tsx`) で分ける。
