import { TFunction } from "i18next";
import { FortuneLevel } from "../types/omikuji";

export function getFortuneText(
  t: TFunction,
  level: FortuneLevel,
  messageIndex: number
): { title: string; message: string } {
  const title = t(`fortune.levels.${level}`);
  const messages = t(`fortune.messages.${level}`, { returnObjects: true });
  const message = Array.isArray(messages)
    ? messages[messageIndex] || messages[0]
    : String(messages);

  return { title, message };
}
