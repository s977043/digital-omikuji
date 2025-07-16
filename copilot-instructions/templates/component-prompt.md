# GitHub Copilot コンポーネント生成プロンプト

## プロジェクト情報
- **プロジェクト名**: digital-omikuji
- **フレームワーク**: Remix with TypeScript
- **スタイリング**: Tailwind CSS
- **テスト**: Jest + React Testing Library

## コンポーネント要件
- **コンポーネント名**: [COMPONENT_NAME]
- **ファイルパス**: app/components/[COMPONENT_NAME].tsx
- **Props**: [COMPONENT_PROPS]
- **機能説明**: [COMPONENT_DESCRIPTION]

## コーディング規約
- TypeScript strict モードを使用
- 関数型コンポーネントを使用
- React Hooks を適切に使用
- Tailwind CSS でスタイリング
- アクセシビリティを考慮（ARIA属性、キーボードナビゲーション）
- 日本語のコメントを追加

## 型定義要件
```typescript
interface [COMPONENT_NAME]Props {
  // プロパティの型定義をここに記述
}
```

## アクセシビリティ要件
- セマンティックなHTML要素の使用
- 適切なARIA属性の設定
- キーボードナビゲーション対応
- スクリーンリーダー対応
- カラーコントラストの確保

## スタイリング要件
- Tailwind CSS クラスを使用
- レスポンシブデザイン対応
- ダークモード考慮（必要に応じて）
- アニメーション効果（適度に）

## テスト考慮事項
- テスタブルな設計にする
- データ属性の追加（test-id等）
- 純粋関数として設計
- 副作用の最小化

## 出力例
```typescript
import React from 'react';

interface [COMPONENT_NAME]Props {
  // プロパティ定義
}

/**
 * [COMPONENT_DESCRIPTION]
 * 
 * @param props - コンポーネントのプロパティ
 * @returns JSX要素
 */
const [COMPONENT_NAME]: React.FC<[COMPONENT_NAME]Props> = ({ 
  // プロパティの分割代入
}) => {
  // ロジック実装

  return (
    <div className="...">
      {/* JSX実装 */}
    </div>
  );
};

export default [COMPONENT_NAME];
```

## 注意事項
- セキュリティを考慮した実装
- パフォーマンスの最適化
- 保守性の高いコード
- エラーハンドリングの実装