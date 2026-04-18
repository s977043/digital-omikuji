import { useState, useCallback, useEffect, useRef } from "react";
import Constants from "expo-constants";
import { OmikujiResult } from "../types/omikuji";
import { canDrawToday, drawOmikuji, getTodayString } from "../domain";
import {
  addHistoryEntry,
  getHistory,
  getLastDrawDate,
  clearHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";

export const useOmikujiLogic = () => {
  const [fortune, setFortune] = useState<OmikujiResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  // drawFortune の多重起動（状態機械の effect 再実行や連打）で
  // addHistoryEntry が二重に走るのを防ぐ書込みロック。
  const writingRef = useRef(false);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      const [historyData, lastDate] = await Promise.all([getHistory(), getLastDrawDate()]);
      if (cancelled) return;
      setHistory(historyData);

      if (!canDrawToday(lastDate, getTodayString()) && historyData.length > 0) {
        setHasDrawnToday(true);
        setFortune(historyData[0]);
      }
    }

    initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  const drawFortune = useCallback(async () => {
    if (hasDrawnToday) {
      return fortune;
    }
    if (writingRef.current) {
      // 既に書込み中：同一セッションでの二重発火を無視する
      return fortune;
    }
    writingRef.current = true;
    try {
      const result = drawOmikuji();

      setFortune(result);
      setHasDrawnToday(true);

      await addHistoryEntry(result);
      await loadHistory();

      return result;
    } finally {
      writingRef.current = false;
    }
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
