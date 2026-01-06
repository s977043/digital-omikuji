import { FortuneLevel } from "../types/omikuji";
import { ImageSourcePropType } from "react-native";

// Placeholder image for now
const PLACEHOLDER_IMAGE = require("../assets/omikuji_cylinder.png");

// Detail keys that correspond to translation keys in fortune.detailLabels and fortune.details
export const DETAIL_KEYS = [
  "wish",
  "waitingPerson",
  "lostItem",
  "business",
  "study",
  "health",
  "love",
] as const;

export type DetailKey = (typeof DETAIL_KEYS)[number];

export interface OmikujiMasterData {
  level: FortuneLevel;
  weight: number;
  image: ImageSourcePropType;
  color: string;
  // Messages and details are now referenced via translation keys
  // fortune.messages.[level] and fortune.details.[level].[detailKey]
}

export const ACQUIRED_FORTUNES: OmikujiMasterData[] = [
  {
    level: "daikichi",
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: "#FFD700", // Gold
  },
  {
    level: "chukichi",
    weight: 15,
    image: PLACEHOLDER_IMAGE,
    color: "#FF8C00", // DarkOrange
  },
  {
    level: "shokichi",
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: "#32CD32", // LimeGreen
  },
  {
    level: "kichi",
    weight: 25,
    image: PLACEHOLDER_IMAGE,
    color: "#4169E1", // RoyalBlue
  },
  {
    level: "suekichi",
    weight: 20,
    image: PLACEHOLDER_IMAGE,
    color: "#9370DB", // MediumPurple
  },
  {
    level: "kyo",
    weight: 10,
    image: PLACEHOLDER_IMAGE,
    color: "#808080", // Gray
  },
  {
    level: "daikyo",
    weight: 5,
    image: PLACEHOLDER_IMAGE,
    color: "#2F4F4F", // DarkSlateGray
  },
];
