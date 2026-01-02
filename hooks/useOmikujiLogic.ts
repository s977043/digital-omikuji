import { useState, useCallback, useEffect } from "react";
import { OmikujiResult } from "../types/omikuji";
import { drawOmikuji } from "../utils/omikujiLogic";
import {
  addHistoryEntry,
  getHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";

export const useOmikujiLogic = () => {
  const [fortune, setFortune] = useState<OmikujiResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 履歴の初期読み込み
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  const drawFortune = useCallback(async () => {
    // New logic: Use utility
    const result = drawOmikuji();

    setFortune(result);

    // 履歴に追加して再読み込み
    await addHistoryEntry(result);
    await loadHistory();

    return result;
  }, [loadHistory]);

  const resetFortune = useCallback(() => {
    setFortune(null);
  }, []);

  return {
    fortune,
    history,
    drawFortune,
    resetFortune,
    loadHistory,
  };
};
