import type { TFunction } from "i18next";
import { getFortuneText } from "../getFortuneText";

describe("getFortuneText", () => {
  const buildT = (messages: Record<string, unknown>) =>
    ((key: string, options?: { returnObjects?: boolean }) => {
      const value = messages[key];
      if (options?.returnObjects && Array.isArray(value)) return value;
      if (value == null) return key;
      return value;
    }) as unknown as TFunction;

  it("returns the localised title and selected message by index", () => {
    const t = buildT({
      "fortune.levels.daikichi": "大吉",
      "fortune.messages.daikichi": ["メッセージ0", "メッセージ1", "メッセージ2"],
    });

    expect(getFortuneText(t, "daikichi", 1)).toEqual({
      title: "大吉",
      message: "メッセージ1",
    });
  });

  it("falls back to the first message when the index is out of range", () => {
    const t = buildT({
      "fortune.levels.daikichi": "大吉",
      "fortune.messages.daikichi": ["M0", "M1"],
    });
    expect(getFortuneText(t, "daikichi", 99).message).toBe("M0");
  });

  it("coerces a non-array messages value to a string", () => {
    const t = buildT({
      "fortune.levels.kyo": "凶",
      "fortune.messages.kyo": "シングル",
    });
    expect(getFortuneText(t, "kyo", 0).message).toBe("シングル");
  });
});
