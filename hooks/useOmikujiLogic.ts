import { useState, useCallback, useEffect } from "react";
import { OmikujiResult } from "../types/omikuji";
import { drawOmikuji } from "../utils/omikujiLogic";
import {
  addHistoryEntry,
  getHistory,
  getLastDrawDate,
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

  const checkDailyStatus = useCallback(async () => {
    const lastDate = await getLastDrawDate();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    if (lastDate === today) {
      // Load history to get the latest result
      const currentHistory = await getHistory();
      if (currentHistory.length > 0) {
        setHasDrawnToday(true);
        setFortune(currentHistory[0]);
      } else {
        // If date matches but history is empty (e.g. manually cleared), reset status
        setHasDrawnToday(false);
      }
    } else {
      setHasDrawnToday(false);
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    loadHistory().then(() => {
      checkDailyStatus();
    });
  }, [loadHistory, checkDailyStatus]);

  const drawFortune = useCallback(async () => {
    // 念のためここでもチェック
    if (hasDrawnToday) {
      // すでに引いている場合は既存の結果を返す（通常UIで制御されるためここには来ないはずだが）
      return fortune;
    }

    const result = drawOmikuji();

    setFortune(result);
    setHasDrawnToday(true);

    // 履歴に追加して再読み込み
    await addHistoryEntry(result);
    await loadHistory();

    return result;
  }, [hasDrawnToday, fortune, loadHistory]);

  const resetFortune = useCallback(() => {
    // hasDrawnToday が true の場合は fortune を保持して再表示可能にする
    // アプリ側で appState を IDLE に戻すだけで、fortune はそのまま
    // (fortune を null にしないことで「結果をもう一度見る」が動作する)
    if (!hasDrawnToday) {
      setFortune(null);
    }
  }, [hasDrawnToday]);

  // デバッグ用：日付リセット（1日1回制限解除）
  const debugResetDailyLimit = useCallback(async () => {
    // TODO: Implement cleaner reset if needed needed, for now just clear fortune
    setHasDrawnToday(false);
    setFortune(null);
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
