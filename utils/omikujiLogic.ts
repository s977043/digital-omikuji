import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { ACQUIRED_FORTUNES } from "../data/omikujiData";
import { OmikujiResult } from "../types/omikuji";

// Number of messages per fortune level (matches translation files)
const MESSAGES_PER_LEVEL = 5;

/**
 * Perform a weighted lottery to select a fortune result.
 */
export const drawOmikuji = (): OmikujiResult => {
  // 1. Calculate total weight
  const totalWeight = ACQUIRED_FORTUNES.reduce((sum, item) => sum + item.weight, 0);

  // 2. Random value between 0 and totalWeight
  let randomValue = Math.random() * totalWeight;

  // 3. Select Fortune Level
  let selectedData = ACQUIRED_FORTUNES[ACQUIRED_FORTUNES.length - 1]; // Default fallback

  for (const data of ACQUIRED_FORTUNES) {
    if (randomValue < data.weight) {
      selectedData = data;
      break;
    }
    randomValue -= data.weight;
  }

  // 4. Select Random Message Index
  const messageIndex = Math.floor(Math.random() * MESSAGES_PER_LEVEL);

  // 5. Construct Result
  return {
    id: uuidv4(),
    level: selectedData.level,
    messageIndex,
    image: selectedData.image,
    color: selectedData.color,
    createdAt: Date.now(),
  };
};
