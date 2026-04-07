import { ImageSourcePropType } from "react-native";

export type FortuneLevel =
  | "daikichi"
  | "chukichi"
  | "shokichi"
  | "kichi"
  | "suekichi"
  | "kyo"
  | "daikyo";

export interface OmikujiResult {
  id: string; // Unique ID for history
  level: FortuneLevel;
  messageIndex: number; // Index of the message in fortune.messages.[level]
  image: ImageSourcePropType; // Main result illustration
  color: string; // Theme color
  createdAt: number; // Timestamp
}
