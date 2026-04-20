import AsyncStorage from "@react-native-async-storage/async-storage";
import { FortuneResult } from "../types/omikuji";
import { migrateLegacyEntry, getTodayString } from "../domain";
import { reportSilentError } from "./errorReporter";

/**
 * HistoryStorage 内部のエラーを Sentry に送信し、ログに記録する。
 * ユーザー通知は行わない（silent error）。フォールバック値は呼び出し元で返す。
 */
function reportStorageError(operation: string, error: unknown): void {
  reportSilentError(`[HistoryStorage:${operation}]`, error, {
    source: "HistoryStorage",
    operation,
  });
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
 * 履歴に新しいエントリを追加し、更新後の履歴配列を返す。
 *
 * `currentHistory` を渡すと AsyncStorage からの再読込を省略できる。
 * 呼び出し元が既に state として履歴を保持している場合はそれを渡すことで、
 * 同一データの JSON parse + migrate map を重複実行せずに済む。
 * 省略時は従来通り内部で `getHistory()` を実行する。
 *
 * 失敗時は `currentHistory`（渡されていれば）または空配列を返す（silent error）。
 */
export async function addHistoryEntry(
  result: FortuneResult,
  currentHistory?: HistoryEntry[]
): Promise<HistoryEntry[]> {
  try {
    const history = currentHistory ?? (await getHistory());
    // 最新のものが先頭に来るように追加し、50件に制限
    const updatedHistory = [result, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    await setLastDrawDate(getTodayString());
    return updatedHistory;
  } catch (error) {
    reportStorageError("addHistoryEntry", error);
    return currentHistory ?? [];
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
