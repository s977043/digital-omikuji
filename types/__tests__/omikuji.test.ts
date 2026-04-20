import { isFortuneLevel, isOmikujiResult, OmikujiResult, FortuneResult } from "../omikuji";

describe("omikuji type guards", () => {
  const omikujiResult: OmikujiResult = {
    id: "test-id",
    type: "omikuji",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: 1234567890,
  };

  describe("isOmikujiResult", () => {
    it("returns true for omikuji type", () => {
      expect(isOmikujiResult(omikujiResult)).toBe(true);
    });

    it("narrows type correctly for omikuji result", () => {
      const result: FortuneResult = omikujiResult;
      if (isOmikujiResult(result)) {
        // Type should be narrowed to OmikujiResult
        expect(result.level).toBe("daikichi");
        expect(result.messageIndex).toBe(0);
      } else {
        fail("Expected omikuji result");
      }
    });
  });

  describe("isFortuneLevel", () => {
    it.each(["daikichi", "chukichi", "shokichi", "kichi", "suekichi", "kyo", "daikyo"])(
      "returns true for known level %s",
      (level) => {
        expect(isFortuneLevel(level)).toBe(true);
      }
    );

    it.each([null, undefined, 0, "", "super-kichi", "Daikichi", {}])(
      "returns false for invalid input %p",
      (value) => {
        expect(isFortuneLevel(value)).toBe(false);
      }
    );
  });

  describe("OmikujiResult", () => {
    it("has required BaseFortune fields", () => {
      expect(omikujiResult.id).toBeDefined();
      expect(omikujiResult.type).toBe("omikuji");
      expect(omikujiResult.createdAt).toBeDefined();
    });

    it("has required omikuji-specific fields", () => {
      expect(omikujiResult.level).toBeDefined();
      expect(omikujiResult.messageIndex).toBeDefined();
      expect(omikujiResult.image).toBeDefined();
      expect(omikujiResult.color).toBeDefined();
    });
  });
});
