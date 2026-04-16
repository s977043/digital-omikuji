import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ImageSourcePropType } from "react-native";
import { FortuneResult, OmikujiResult, isFortuneLevel } from "../types/omikuji";
import { captureException } from "./sentry";

/**
 * HistoryStorage 内部のエラーを Sentry に送信し、ログに記録する。
 * ユーザー通知は行わない（silent error）。フォールバック値は呼び出し元で返す。
 */
function reportStorageError(operation: string, error: unknown): void {
  console.error(`[HistoryStorage:${operation}]`, error);
  if (error instanceof Error) {
    captureException(error, { source: "HistoryStorage", operation });
  }
}

const HISTORY_KEY = "omikuji_history_v2"; // Changed key to avoid conflict with old schema
const LAST_DRAW_DATE_KEY = "omikuji_last_draw_date";

const MAX_HISTORY_ITEMS = 50;

/**
 * 履歴エントリの型。
 * 現状はおみくじのみだが、将来は他の占い種別（タロット等）も受け入れる。
 */
export type HistoryEntry = FortuneResult;

/**
 * レガシー履歴データ（type フィールドがない古いデータ）を
 * 新しい BaseFortune 形式にマイグレートする。
 *
 * 壊れた / 未知形式のペイロードは `null` を返し、呼び出し元で除外される。
 * 以前は `as Partial<OmikujiResult>` で素通ししていたが、各フィールドを型
 * ガードで検証してから明示的に OmikujiResult を組み立てる。
 */
function migrateLegacyEntry(raw: unknown): HistoryEntry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  // type は存在する場合のみ "omikuji" を許可（将来の占い種別は未対応）
  if (r.type !== undefined && r.type !== "omikuji") return null;

  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (!isFortuneLevel(r.level)) return null;
  if (typeof r.messageIndex !== "number" || !Number.isFinite(r.messageIndex)) return null;
  if (typeof r.color !== "string") return null;
  if (typeof r.createdAt !== "number" || !Number.isFinite(r.createdAt)) return null;
  if (r.image == null) return null;

  const result: OmikujiResult = {
    id: r.id,
    type: "omikuji",
    level: r.level,
    messageIndex: r.messageIndex,
    // ImageSourcePropType は number | { uri: string } | array 等の union。
    // 構造的検証は non-null のみ（各形式は RN 側 Image コンポーネントが扱う）
    image: r.image as ImageSourcePropType,
    color: r.color,
    createdAt: r.createdAt,
  };
  return result;
}

/**
 * 今日の日付を YYYY-MM-DD 形式で返す。
 *
 * この値は「1 日 1 回制限」の判定基準として使用される。
 * デバイスのローカルタイムゾーンに依存する設計である点に注意:
 * タイムゾーン変更・国境越えユーザーの挙動、将来 UTC 切替する場合の方針は
 * `docs/guides/TIMEZONE_POLICY.md` を参照。
 */
export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * 履歴を取得する
 */
export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    if (jsonValue == null) return [];
    const rawEntries = JSON.parse(jsonValue);
    if (!Array.isArray(rawEntries)) return [];
    // Legacy エントリ（type フィールドなし）もマイグレートして読み込む
    return rawEntries
      .map(migrateLegacyEntry)
      .filter((entry): entry is HistoryEntry => entry !== null);
  } catch (error) {
    reportStorageError("getHistory", error);
    return [];
  }
}

/**
 * 履歴に新しいエントリを追加する
 */
export async function addHistoryEntry(result: FortuneResult): Promise<void> {
  try {
    const history = await getHistory();
    // 最新のものが先頭に来るように追加し、50件に制限
    const updatedHistory = [result, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    await setLastDrawDate(getTodayString());
  } catch (error) {
    reportStorageError("addHistoryEntry", error);
  }
}

/**
 * 履歴を全て削除する
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    await AsyncStorage.removeItem(LAST_DRAW_DATE_KEY);
  } catch (error) {
    reportStorageError("clearHistory", error);
  }
}

/**
 * 最後に引いた日付を取得する (YYYY-MM-DD)
 */
export async function getLastDrawDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_DRAW_DATE_KEY);
  } catch (error) {
    reportStorageError("getLastDrawDate", error);
    return null;
  }
}

/**
 * 最後に引いた日付を保存する
 */
export async function setLastDrawDate(date: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_DRAW_DATE_KEY, date);
  } catch (error) {
    reportStorageError("setLastDrawDate", error);
  }
}
