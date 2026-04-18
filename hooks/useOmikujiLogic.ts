import { useState, useCallback, useEffect } from "react";
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

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
    return data;
  }, []);

  useEffect(() => {
    async function initialize() {
      const [historyData, lastDate] = await Promise.all([getHistory(), getLastDrawDate()]);
      setHistory(historyData);

      if (!canDrawToday(lastDate, getTodayString()) && historyData.length > 0) {
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
