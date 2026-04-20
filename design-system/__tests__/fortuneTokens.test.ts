import { FortuneLevel } from "../../types/omikuji";
import { getFortuneLevelColor } from "../fortuneTokens";
import * as designSystem from "../index";

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(levels)("returns a non-empty color string for %s", (level) => {
    const color = getFortuneLevelColor(level);
    expect(typeof color).toBe("string");
    expect(color.length).toBeGreaterThan(0);
  });

  it.each(levels)(
    "passes 'semantic.fortune.level.%s' to getStringToken (mapping correctness)",
    (level) => {
      // マッピングの正しさを検証: 各 FortuneLevel が正しいトークンパスに
      // 紐づいていることを保証する（例: kyo が誤って kichi のトークンに紐づいた
      // ような混線を検出できる）
      const spy = jest.spyOn(designSystem, "getStringToken").mockReturnValue("#TESTCOLOR");

      const result = getFortuneLevelColor(level);

      expect(spy).toHaveBeenCalledWith(`semantic.fortune.level.${level}`);
      expect(result).toBe("#TESTCOLOR");
    }
  );

  it("returns different colors for daikichi vs daikyo (sanity check)", () => {
    const daikichi = getFortuneLevelColor("daikichi");
    const daikyo = getFortuneLevelColor("daikyo");
    expect(daikichi).not.toBe(daikyo);
  });
});
