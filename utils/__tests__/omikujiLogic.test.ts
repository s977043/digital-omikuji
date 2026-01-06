import { drawOmikuji } from "../omikujiLogic";
import { ACQUIRED_FORTUNES } from "../../data/omikujiData";

describe("omikujiLogic", () => {
  describe("drawOmikuji", () => {
    it("should return a valid OmikujiResult structure", () => {
      const result = drawOmikuji();

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("string");

      expect(result).toHaveProperty("level");
      expect(typeof result.level).toBe("string");

      expect(result).toHaveProperty("messageIndex");
      expect(typeof result.messageIndex).toBe("number");
      expect(result.messageIndex).toBeGreaterThanOrEqual(0);
      expect(result.messageIndex).toBeLessThan(5);

      expect(result).toHaveProperty("createdAt");
      expect(typeof result.createdAt).toBe("number");

      expect(result).toHaveProperty("color");
      expect(result).toHaveProperty("image");
    });

    it("should select a fortune based on random weight", () => {
      // Mock Math.random to return 0 (Always the first item)
      jest.spyOn(Math, "random").mockReturnValue(0);

      const firstFortune = ACQUIRED_FORTUNES[0];
      const result = drawOmikuji();

      expect(result.level).toBe(firstFortune.level);

      jest.restoreAllMocks();
    });

    it("should fallback to the last fortune if random value is high (0.99)", () => {
      // Mock Math.random to return 0.999 (Likely the last item)
      jest.spyOn(Math, "random").mockReturnValue(0.9999);

      const lastFortune = ACQUIRED_FORTUNES[ACQUIRED_FORTUNES.length - 1];
      const result = drawOmikuji();

      // Note: This assumes logic handles 0.9999 mapping to last item correctly
      expect(result.level).toBe(lastFortune.level);

      jest.restoreAllMocks();
    });
  });
});
