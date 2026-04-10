import AsyncStorage from "@react-native-async-storage/async-storage";
import { FortuneResult, OmikujiResult } from "../types/omikuji";

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
 */
function migrateLegacyEntry(raw: unknown): HistoryEntry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const entry = raw as Partial<OmikujiResult> & { type?: string };
  if (!entry.id || !entry.level || typeof entry.createdAt !== "number") return null;
  return {
    ...entry,
    type: entry.type === "omikuji" ? "omikuji" : "omikuji",
  } as OmikujiResult;
}

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
    console.error("Failed to load history:", error);
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
    console.error("Failed to save history:", error);
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
    console.error("Failed to clear history:", error);
  }
}

/**
 * 最後に引いた日付を取得する (YYYY-MM-DD)
 */
export async function getLastDrawDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_DRAW_DATE_KEY);
  } catch (error) {
    console.error("Failed to load last draw date:", error);
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
    console.error("Failed to save last draw date:", error);
  }
}
