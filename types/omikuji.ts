import { ImageSourcePropType } from "react-native";

export type FortuneLevel =
  | "daikichi"
  | "chukichi"
  | "shokichi"
  | "kichi"
  | "suekichi"
  | "kyo"
  | "daikyo";

export const FORTUNE_LEVELS: Record<FortuneLevel, string> = {
  daikichi: "大吉",
  chukichi: "中吉",
  shokichi: "小吉",
  kichi: "吉",
  suekichi: "末吉",
  kyo: "凶",
  daikyo: "大凶",
};

export interface OmikujiResult {
  id: string; // Unique ID for history
  level: FortuneLevel;
  fortuneParams: {
    title: string; // Display title e.g. "大吉"
    description: string; // One-liner message
  };
  image: ImageSourcePropType; // Main result illustration
  color: string; // Theme color
  createdAt: number; // Timestamp
}
