import type { TFunction } from "i18next";
import { FortuneLevel } from "../types/omikuji";

/**
 * おみくじ結果の見出しと本文を i18n 経由で取り出す。
 *
 * `TFunction` を引数で受け取ることで、domain 層は react-i18next への直接
 * 依存を持たない（呼び出し側 hooks が注入する）。
 */
export function getFortuneText(
  t: TFunction,
  level: FortuneLevel,
  messageIndex: number
): { title: string; message: string } {
  const title = t(`fortune.levels.${level}`);
  const messages = t(`fortune.messages.${level}`, { returnObjects: true });
  // Array case: prefer the requested index, fall back to the first message, then
  // to empty string so the return type stays `string` even if i18n resources
  // ship an empty array by mistake.
  const message = Array.isArray(messages)
    ? ((messages[messageIndex] ?? messages[0] ?? "") as string)
    : String(messages);

  return { title, message };
}
