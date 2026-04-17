import { ImageSourcePropType } from "react-native";

/**
 * 占い種別の判別子。
 * 新しい占い種別を追加する場合はここに追加し、対応する結果型を定義する。
 */
export type FortuneType = "omikuji";

/**
 * すべての占い結果の基底型。
 * 共通フィールド（id, type, createdAt）を持ち、type で具象型を判別する。
 */
export interface BaseFortune {
  id: string;
  type: FortuneType;
  createdAt: number;
}

export type FortuneLevel =
  | "daikichi"
  | "chukichi"
  | "shokichi"
  | "kichi"
  | "suekichi"
  | "kyo"
  | "daikyo";

const FORTUNE_LEVELS: readonly FortuneLevel[] = [
  "daikichi",
  "chukichi",
  "shokichi",
  "kichi",
  "suekichi",
  "kyo",
  "daikyo",
];

/**
 * 型ガード: 値が FortuneLevel union のいずれかであるかを判定する。
 */
export function isFortuneLevel(value: unknown): value is FortuneLevel {
  return typeof value === "string" && (FORTUNE_LEVELS as readonly string[]).includes(value);
}

/**
 * おみくじの結果。
 * BaseFortune を拡張し、おみくじ固有のフィールドを持つ。
 */
export interface OmikujiResult extends BaseFortune {
  type: "omikuji";
  level: FortuneLevel;
  messageIndex: number; // Index of the message in fortune.messages.[level]
  image: ImageSourcePropType; // Main result illustration
  color: string; // Theme color
}

/**
 * すべての占い結果を表すユニオン型。
 * 将来、タロット等が追加される場合にここに追加する。
 */
export type FortuneResult = OmikujiResult;

// --- Type guards ---

/**
 * 結果がおみくじ種別かを判定する型ガード。
 */
export function isOmikujiResult(result: FortuneResult): result is OmikujiResult {
  return result.type === "omikuji";
}
