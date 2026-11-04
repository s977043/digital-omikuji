import { createInstance } from "i18next";
import ja from "../../i18n/locales/ja.json";
import en from "../../i18n/locales/en.json";
import { buildShareText } from "../buildShareText";

describe("buildShareText", () => {
  it.each([
    ["ja", "私の運勢は", "#デジタルおみくじ"],
    ["en", "My fortune is", "#DigitalOmikuji"],
  ])("shares a general fortune in %s without changing its content", async (lng, heading, tag) => {
    const i18n = createInstance();
    await i18n.init({
      lng,
      resources: { ja: { translation: ja }, en: { translation: en } },
      interpolation: { escapeValue: false },
    });
    const title = lng === "ja" ? "凶" : "Misfortune";
    const description = "Keep <calm> & try again.\n{{title}}";
    const text = buildShareText(i18n.t, { title, description });
    expect(text).toContain(heading);
    expect(text).toContain(title);
    expect(text).toContain(description);
    expect(text).toContain(tag);
    expect(text).not.toMatch(/エンジニア|engineer|2026|令和八年/i);
    expect(text).toContain(
      "https://digital-omikuji.vercel.app?utm_source=share&utm_campaign=omikuji"
    );
  });
});
