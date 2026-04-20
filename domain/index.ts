/**
 * 純粋ドメイン層の公開エントリーポイント。
 *
 * この層の不変条件:
 * - react / react-native / expo-* / @react-native-* への実行時依存なし
 *   （`import type` は runtime には残らないので許容）
 * - AsyncStorage、Sentry、Audio などの副作用を持つ API を直接呼ばない
 * - 時刻・乱数・ID 生成など非決定性は引数で注入する
 */
export { drawOmikuji } from "./drawOmikuji";
export type { DrawOmikujiOptions } from "./drawOmikuji";
export { getTodayString, canDrawToday } from "./fortuneRules";
export { migrateLegacyEntry } from "./historyMigration";
export { getFortuneText } from "./getFortuneText";
export { buildShareText } from "./buildShareText";
