# Test Case Generation Skill

## 1. 目的

指定された実装ファイル（TS/TSX）を分析し、Jest による単体テストまたはコンポーネントテストを生成する。
テストファイルが存在しない場合は新規作成し、存在する場合は不足しているテストケースを追記することを基本とする。

## 2. 実行手順

1.  **ターゲット指定**: どのファイルに対するテストを作成するか決定する。
2.  **スカフォールド (run.js)**: `node .agent/skills/test-case-generation/run.js <target_file_path>` を実行し、`__tests__` ディレクトリとテストファイルの雛形を準備する。
3.  **テスト実装**:
    - 実装ファイルを読み込む。
    - エクスポートされている関数、クラス、コンポーネントを特定する。
    - 正常系、異常系、境界値のテストケースを列挙する。
    - `jest`, `@testing-library/react-native` 等を用いたテストコードを記述する。
    - 外部依存（API, Storage, Navigationなど）は適切にモックする。

## 3. 生成ルール

- **配置**: 実装ファイルと同じディレクトリ内の `__tests__` フォルダに配置する。
- **命名**: `<ImplementationFile>.test.ts` または `<ImplementationFile>.test.tsx`。
- **カバレッジ**: 分岐網羅（Branch Coverage）を意識する。
- **スタイル**: `describe` でグループ化し、`it` または `test` でケースを記述する。

## 4. コマンド例

```bash
# 準備
node .agent/skills/test-case-generation/run.js utils/MyUtil.ts

# テスト実行（確認用）
npx jest utils/MyUtil.ts
```
