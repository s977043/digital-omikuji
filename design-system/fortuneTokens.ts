import { FortuneLevel } from "../types/omikuji";
import { getStringToken } from "./index";

/**
 * `FortuneLevel` ごとの `semantic.fortune.level.*` トークンパスマッピング。
 *
 * Record 型による完全性チェックにより、`FortuneLevel` ユニオンに新しいレベルを
 * 追加した場合は、このマップにエントリを追加しないとコンパイルエラーになる。
 */
const FORTUNE_LEVEL_TOKEN_PATHS: Record<FortuneLevel, string> = {
  daikichi: "semantic.fortune.level.daikichi",
  chukichi: "semantic.fortune.level.chukichi",
  shokichi: "semantic.fortune.level.shokichi",
  kichi: "semantic.fortune.level.kichi",
  suekichi: "semantic.fortune.level.suekichi",
  kyo: "semantic.fortune.level.kyo",
  daikyo: "semantic.fortune.level.daikyo",
};

/**
 * 指定された `FortuneLevel` に対応する色トークンを返す。
 *
 * 文字列テンプレート（`semantic.fortune.level.${level}`）を直接 `getStringToken`
 * に渡すよりも以下の利点がある:
 *
 * - **型安全**: `FortuneLevel` 以外の値を渡すとコンパイルエラー
 * - **完全性**: 新しい `FortuneLevel` を追加すると `FORTUNE_LEVEL_TOKEN_PATHS`
 *   マップにエントリ追加が必須になる
 * - **トークンパス変更時の影響範囲が明確**: マップを 1 箇所変更すれば全コンポーネントに反映
 */
export function getFortuneLevelColor(level: FortuneLevel): string {
  return getStringToken(FORTUNE_LEVEL_TOKEN_PATHS[level]);
}
