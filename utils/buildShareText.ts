import { OmikujiResult } from "../types/omikuji";

const APP_URL = "https://digital-omikuji-app.vercel.app"; // Replace with actual URL if different
const HASHTAGS = ["#エンジニアおみくじ2026", "#令和七年"];

/**
 * Builds the share text for X (Twitter).
 *
 * Template:
 * 2026年のエンジニア運勢は
 * 『{運勢}』
 *
 * #エンジニアおみくじ2026
 * #令和七年
 *
 * あなたも占ってみよう👇
 * {URL}
 */
export function buildShareText(fortune: OmikujiResult): string {
  const hashtags = HASHTAGS.join("\n");
  const url = `${APP_URL}?utm_source=share&utm_campaign=omikuji2026`;

  return `2026年のエンジニア運勢は\n『${fortune.fortuneParams.title}』\n\n${hashtags}\n\nあなたも占ってみよう👇\n${url}`;
}
