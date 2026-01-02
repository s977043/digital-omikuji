import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ACQUIRED_FORTUNES, OmikujiMasterData } from '../data/omikujiData';
import { OmikujiResult, FORTUNE_LEVELS } from '../types/omikuji';

/**
 * Perform a weighted lottery to select a fortune result.
 */
export const drawOmikuji = (): OmikujiResult => {
  // 1. Calculate total weight
  const totalWeight = ACQUIRED_FORTUNES.reduce((sum, item) => sum + item.weight, 0);

  // 2. Random value between 0 and totalWeight
  let randomValue = Math.random() * totalWeight;

  // 3. Select Fortune Level
  let selectedData: OmikujiMasterData = ACQUIRED_FORTUNES[ACQUIRED_FORTUNES.length - 1]; // Default fallback

  for (const data of ACQUIRED_FORTUNES) {
    if (randomValue < data.weight) {
      selectedData = data;
      break;
    }
    randomValue -= data.weight;
  }

  // 4. Select Random Message
  const messageIndex = Math.floor(Math.random() * selectedData.messages.length);
  const selectedMessage = selectedData.messages[messageIndex] || selectedData.messages[0];

  // 5. Construct Result
  return {
    id: uuidv4(),
    level: selectedData.level,
    fortuneParams: {
      title: FORTUNE_LEVELS[selectedData.level],
      description: selectedMessage,
    },
    image: selectedData.image,
    color: selectedData.color,
    createdAt: Date.now(),
  };
};
