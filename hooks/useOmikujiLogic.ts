import { useState, useCallback } from 'react';
import { OMIKUJI_DATA, OmikujiFortune } from '../constants/OmikujiData';

export const useOmikujiLogic = () => {
  const [fortune, setFortune] = useState<OmikujiFortune | null>(null);

  const drawFortune = useCallback(() => {
    // Calculate total weight
    const totalWeight = OMIKUJI_DATA.reduce((sum, item) => sum + item.weight, 0);

    // Generate random number between 0 and totalWeight
    let randomNum = Math.random() * totalWeight;

    // Find the selected item
    for (const item of OMIKUJI_DATA) {
      if (randomNum < item.weight) {
        setFortune(item);
        return item;
      }
      randomNum -= item.weight;
    }

    // Fallback (should theoretically not happen if logic is correct)
    setFortune(OMIKUJI_DATA[OMIKUJI_DATA.length - 1]);
    return OMIKUJI_DATA[OMIKUJI_DATA.length - 1];
  }, []);

  const resetFortune = useCallback(() => {
    setFortune(null);
  }, []);

  return {
    fortune,
    drawFortune,
    resetFortune,
  };
};
