import { canDrawToday, getTodayString } from "../fortuneRules";

describe("getTodayString", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(getTodayString(new Date(2026, 0, 1))).toBe("2026-01-01");
    expect(getTodayString(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("zero-pads single-digit months and days", () => {
    expect(getTodayString(new Date(2026, 4, 7))).toBe("2026-05-07");
  });

  it("uses the local timezone (no UTC conversion)", () => {
    // The device's local timezone is authoritative; callers aware of cross-TZ
    // concerns should reference docs/guides/TIMEZONE_POLICY.md.
    const localDate = new Date(2026, 0, 15, 23, 59, 59);
    expect(getTodayString(localDate)).toBe("2026-01-15");
  });
});

describe("canDrawToday", () => {
  it("returns true when no draw has ever happened", () => {
    expect(canDrawToday(null, "2026-01-01")).toBe(true);
  });

  it("returns false when the last draw was today", () => {
    expect(canDrawToday("2026-01-01", "2026-01-01")).toBe(false);
  });

  it("returns true when the last draw was a previous day", () => {
    expect(canDrawToday("2025-12-31", "2026-01-01")).toBe(true);
  });
});
