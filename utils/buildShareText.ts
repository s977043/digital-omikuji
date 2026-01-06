import { FortuneLevel } from "../types/omikuji";

const APP_URL = "https://digital-omikuji.vercel.app";
const HASHTAGS = ["#エンジニアおみくじ2026", "#令和八年"];

interface ShareTextParams {
  level: FortuneLevel;
  title: string;
  description: string;
}

/**
 * Builds the share text for X (Twitter).
 *
 * Template:
 * 2026年のエンジニア運勢は
 * 『{運勢}』
 *
 * #エンジニアおみくじ2026
 * #令和八年
 *
 * あなたも占ってみよう👇
 * {URL}
 */
export function buildShareText(params: ShareTextParams): string {
  const hashtags = HASHTAGS.join("\n");
  const url = `${APP_URL}?utm_source=share&utm_campaign=omikuji2026`;

  return `2026年のエンジニア運勢は\n『${params.title}』\n\n${hashtags}\n\nあなたも占ってみよう👇\n${url}`;
}
