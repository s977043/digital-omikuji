import AsyncStorage from "@react-native-async-storage/async-storage";
import { OmikujiResult } from "../types/omikuji";

const HISTORY_KEY = "omikuji_history_v2"; // Changed key to avoid conflict with old schema

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
    // 最新のものが先頭に来るように追加
    const updatedHistory = [result, ...history];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
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
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}
