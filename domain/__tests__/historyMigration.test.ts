import { migrateLegacyEntry } from "../historyMigration";

describe("migrateLegacyEntry", () => {
  const validRaw = {
    id: "entry-1",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "x" },
    color: "#FFD700",
    createdAt: 1_700_000_000_000,
  };

  it("accepts a legacy entry (no type field) and stamps type=omikuji", () => {
    const result = migrateLegacyEntry(validRaw);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("omikuji");
    expect(result!.id).toBe("entry-1");
    expect(result!.level).toBe("daikichi");
  });

  it("accepts a modern entry whose type is omikuji", () => {
    const result = migrateLegacyEntry({ ...validRaw, type: "omikuji" });
    expect(result).not.toBeNull();
  });

  it("rejects an entry whose type is unknown", () => {
    expect(migrateLegacyEntry({ ...validRaw, type: "tarot" })).toBeNull();
  });

  it("rejects non-object inputs", () => {
    expect(migrateLegacyEntry(null)).toBeNull();
    expect(migrateLegacyEntry(undefined)).toBeNull();
    expect(migrateLegacyEntry(0)).toBeNull();
    expect(migrateLegacyEntry("string")).toBeNull();
  });

  it.each([
    ["empty id", { ...validRaw, id: "" }],
    ["missing id", { ...validRaw, id: undefined }],
    ["unknown level", { ...validRaw, level: "super-kichi" }],
    ["non-numeric messageIndex", { ...validRaw, messageIndex: "zero" }],
    ["NaN messageIndex", { ...validRaw, messageIndex: Number.NaN }],
    ["missing color", { ...validRaw, color: undefined }],
    ["missing createdAt", { ...validRaw, createdAt: undefined }],
    ["null image", { ...validRaw, image: null }],
  ])("rejects payload with %s", (_label, payload) => {
    expect(migrateLegacyEntry(payload)).toBeNull();
  });
});
