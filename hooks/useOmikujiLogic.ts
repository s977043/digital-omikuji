import { useState, useCallback, useEffect } from "react";
import Constants from "expo-constants";
import { OmikujiResult } from "../types/omikuji";
import { drawOmikuji } from "../utils/omikujiLogic";
import {
  addHistoryEntry,
  getHistory,
  getLastDrawDate,
  getTodayString,
  clearHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";

export const useOmikujiLogic = () => {
  const [fortune, setFortune] = useState<OmikujiResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
    return data;
  }, []);

  useEffect(() => {
    async function initialize() {
      const [historyData, lastDate] = await Promise.all([getHistory(), getLastDrawDate()]);
      setHistory(historyData);

      if (lastDate === getTodayString() && historyData.length > 0) {
        setHasDrawnToday(true);
        setFortune(historyData[0]);
      }
    }

    initialize();
  }, []);

  const drawFortune = useCallback(async () => {
    if (hasDrawnToday) {
      return fortune;
    }

    const result = drawOmikuji();

    setFortune(result);
    setHasDrawnToday(true);

    await addHistoryEntry(result);
    await loadHistory();

    return result;
  }, [hasDrawnToday, fortune, loadHistory]);

  const resetFortune = useCallback(() => {
    if (!hasDrawnToday) {
      setFortune(null);
    }
  }, [hasDrawnToday]);

  const debugResetDailyLimit = useCallback(async () => {
    // Defense-in-depth: no-op in production. __DEV__ is false in production builds;
    // the appVariant check also blocks preview-style builds that somehow ship with __DEV__ true.
    if (!__DEV__) return;
    const variant = Constants.expoConfig?.extra?.appVariant;
    if (variant === "production") return;

    await clearHistory();
    setHasDrawnToday(false);
    setFortune(null);
    setHistory([]);
  }, []);

  return {
    fortune,
    history,
    hasDrawnToday,
    drawFortune,
    resetFortune,
    loadHistory,
    debugResetDailyLimit,
  };
};
