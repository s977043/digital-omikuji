import AsyncStorage from "@react-native-async-storage/async-storage";
import { OmikujiFortune } from "../constants/OmikujiData";

const HISTORY_KEY = "omikuji_history";

export interface HistoryEntry {
  id: string;
  fortune: OmikujiFortune;
  drawnAt: string; // ISO 8601 形式
}

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
export async function addHistoryEntry(fortune: OmikujiFortune): Promise<void> {
  try {
    const history = await getHistory();
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      fortune,
      drawnAt: new Date().toISOString(),
    };
    // 最新のものが先頭に来るように追加
    const updatedHistory = [newEntry, ...history];
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
