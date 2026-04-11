import { FortuneLevel } from "../../types/omikuji";
import { getFortuneLevelColor } from "../fortuneTokens";

describe("getFortuneLevelColor", () => {
  const levels: FortuneLevel[] = [
    "daikichi",
    "chukichi",
    "shokichi",
    "kichi",
    "suekichi",
    "kyo",
    "daikyo",
  ];

  it.each(levels)("returns a non-empty color string for %s", (level) => {
    const color = getFortuneLevelColor(level);
    expect(typeof color).toBe("string");
    expect(color.length).toBeGreaterThan(0);
  });

  it("returns different colors for daikichi vs daikyo (sanity check)", () => {
    const daikichi = getFortuneLevelColor("daikichi");
    const daikyo = getFortuneLevelColor("daikyo");
    expect(daikichi).not.toBe(daikyo);
  });
});
