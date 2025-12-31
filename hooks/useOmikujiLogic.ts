import { useState, useCallback, useEffect } from "react";
import { OMIKUJI_DATA, OmikujiFortune } from "../constants/OmikujiData";
import {
  addHistoryEntry,
  getHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";

export const useOmikujiLogic = () => {
  const [fortune, setFortune] = useState<OmikujiFortune | null>(null);
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
    // Calculate total weight
    const totalWeight = OMIKUJI_DATA.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    // Generate random number between 0 and totalWeight
    let randomNum = Math.random() * totalWeight;

    // Find the selected item
    let selected: OmikujiFortune | null = null;
    for (const item of OMIKUJI_DATA) {
      if (randomNum < item.weight) {
        selected = item;
        break;
      }
      randomNum -= item.weight;
    }

    if (!selected) {
      selected = OMIKUJI_DATA[OMIKUJI_DATA.length - 1];
    }

    setFortune(selected);

    // 履歴に追加して再読み込み
    await addHistoryEntry(selected);
    await loadHistory();

    return selected;
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
