import { drawOmikuji } from "../drawOmikuji";
import { ACQUIRED_FORTUNES } from "../../data/omikujiData";

describe("drawOmikuji", () => {
  it("returns an OmikujiResult with all required fields", () => {
    const result = drawOmikuji();
    expect(typeof result.id).toBe("string");
    expect(result.type).toBe("omikuji");
    expect(typeof result.level).toBe("string");
    expect(typeof result.messageIndex).toBe("number");
    expect(result.messageIndex).toBeGreaterThanOrEqual(0);
    expect(result.messageIndex).toBeLessThan(5);
    expect(typeof result.createdAt).toBe("number");
    expect(typeof result.color).toBe("string");
    expect(result.image).toBeDefined();
  });

  it("selects the first fortune when rng returns 0", () => {
    const result = drawOmikuji({
      rng: () => 0,
      idGenerator: () => "fixed-id",
      clockNow: () => 123,
    });
    expect(result.level).toBe(ACQUIRED_FORTUNES[0].level);
    expect(result.id).toBe("fixed-id");
    expect(result.createdAt).toBe(123);
    expect(result.messageIndex).toBe(0);
  });

  it("falls back to the last fortune when rng returns near 1", () => {
    const result = drawOmikuji({
      rng: () => 0.9999,
      idGenerator: () => "id",
      clockNow: () => 0,
    });
    expect(result.level).toBe(ACQUIRED_FORTUNES[ACQUIRED_FORTUNES.length - 1].level);
  });

  it("is deterministic with a seedable rng sequence", () => {
    // Deterministic pseudo-random sequence for reproducible tests.
    const values = [0.1, 0.5, 0.25, 0.8];
    let i = 0;
    const rng = () => values[i++ % values.length];

    const r1 = drawOmikuji({ rng, idGenerator: () => "a", clockNow: () => 1 });
    i = 0;
    const r2 = drawOmikuji({ rng, idGenerator: () => "a", clockNow: () => 1 });

    expect(r1).toEqual(r2);
  });

  it("uses the injected weights to bias the draw", () => {
    const only = ACQUIRED_FORTUNES.filter((f) => f.level === "daikichi");
    const result = drawOmikuji({
      rng: () => 0,
      weights: only,
      idGenerator: () => "id",
      clockNow: () => 0,
    });
    expect(result.level).toBe("daikichi");
  });

  it("produces a unique id via the default generator when crypto.randomUUID is available", () => {
    const a = drawOmikuji();
    const b = drawOmikuji();
    expect(a.id).not.toBe(b.id);
  });
});
