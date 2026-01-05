import AsyncStorage from "@react-native-async-storage/async-storage";
import { OmikujiResult } from "../types/omikuji";

const HISTORY_KEY = "omikuji_history_v2"; // Changed key to avoid conflict with old schema
const LAST_DRAW_DATE_KEY = "omikuji_last_draw_date";

const MAX_HISTORY_ITEMS = 50;

// Alias for clarity, but it is just OmikujiResult now
export type HistoryEntry = OmikujiResult;

/**
 * 履歴を取得する
 */
export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

/**
 * 履歴に新しいエントリを追加する
 */
export async function addHistoryEntry(result: OmikujiResult): Promise<void> {
  try {
    const history = await getHistory();
    // 最新のものが先頭に来るように追加し、50件に制限
    const updatedHistory = [result, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    // Save last draw date (Local Time)
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    await setLastDrawDate(today);
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
