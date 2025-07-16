# GitHub Copilot テスト生成プロンプト

## プロジェクト情報
- **プロジェクト名**: digital-omikuji
- **テストフレームワーク**: Jest
- **テストライブラリ**: @testing-library/react
- **対象コンポーネント**: [COMPONENT_NAME]

## テスト要件
- **ファイルパス**: app/components/__tests__/[COMPONENT_NAME].test.tsx
- **カバレッジ**: 主要な機能をテスト
- **テスト項目**: レンダリング、ユーザーインタラクション、エラーケース

## テスト項目チェックリスト
- [ ] コンポーネントが正しくレンダリングされること
- [ ] propsが正しく表示されること
- [ ] ユーザーインタラクション（クリック、入力等）が正しく動作すること
- [ ] エラーケースの処理
- [ ] アクセシビリティ（ARIA属性、キーボードナビゲーション）
- [ ] エッジケース（空データ、無効な値等）

## テストツール
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
```

## テストの構造
```typescript
describe('[COMPONENT_NAME]', () => {
  describe('レンダリング', () => {
    test('基本的なレンダリングが正常に行われる', () => {
      // テスト実装
    });
  });

  describe('ユーザーインタラクション', () => {
    test('クリックイベントが正常に動作する', async () => {
      // テスト実装
    });
  });

  describe('エラーケース', () => {
    test('無効なpropsでもエラーが発生しない', () => {
      // テスト実装
    });
  });
});
```

## アクセシビリティテスト
```typescript
test('アクセシビリティ要件を満たしている', () => {
  // ARIA属性のテスト
  // キーボードナビゲーションのテスト
  // スクリーンリーダー対応のテスト
});
```

## モック
```typescript
// 必要に応じてモック関数を作成
const mockCallback = jest.fn();
const mockProps = {
  // テスト用のプロパティ
};
```

## ユーザーイベントのテスト
```typescript
test('ユーザーインタラクションのテスト', async () => {
  const user = userEvent.setup();
  render(<Component {...props} />);
  
  // ユーザーアクションの実行
  await user.click(screen.getByRole('button'));
  
  // 結果の検証
  expect(mockCallback).toHaveBeenCalled();
});
```

## エラーケースのテスト
```typescript
test('エラーケースの処理', () => {
  // エラー条件の設定
  // コンポーネントのレンダリング
  // エラーハンドリングの検証
});
```

## 出力例
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import [COMPONENT_NAME] from '../[COMPONENT_NAME]';

describe('[COMPONENT_NAME]', () => {
  const defaultProps = {
    // デフォルトのプロパティ
  };

  beforeEach(() => {
    // 各テスト前の準備
  });

  afterEach(() => {
    // 各テスト後のクリーンアップ
  });

  test('基本的なレンダリングテスト', () => {
    render(<[COMPONENT_NAME] {...defaultProps} />);
    
    // アサーション
    expect(screen.getByText('期待されるテキスト')).toBeInTheDocument();
  });

  // 追加のテストケース
});
```

## 注意事項
- テストは読みやすく、保守しやすく書く
- 実装の詳細ではなく、動作をテストする
- モックは必要最小限に留める
- テストの実行速度を考慮する
- 日本語でのテスト説明を含める