import AsyncStorage from "@react-native-async-storage/async-storage";
import { FortuneResult } from "../types/omikuji";
import { migrateLegacyEntry, getTodayString } from "../domain";
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
