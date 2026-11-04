import { test, expect } from "@playwright/test";
import ja from "../../i18n/locales/ja.json";
import en from "../../i18n/locales/en.json";

for (const [locale, copy] of [
  ["ja-JP", ja],
  ["en-US", en],
] as const) {
  test.describe(`share copy ${locale}`, () => {
    test.use({ locale });
    test("shares the displayed fortune without a fixed year or profession", async ({ page }) => {
      // Capture the browser API boundary only; never open a real share target.
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: async (data: ShareData) => {
            (window as unknown as { capturedShare: ShareData }).capturedShare = {
              text: data.text,
              title: data.title,
            };
          },
        });
      });
      await page.goto("/");
      await page.getByRole("button", { name: "おみくじを引く", exact: true }).click();
      const card = page.getByTestId("share-card");
      await expect(card).toBeVisible({ timeout: 20000 });
      await card.getByRole("button", { name: copy.common.share, exact: true }).click();
      const payload = () =>
        page.evaluate(() => (window as unknown as { capturedShare?: ShareData }).capturedShare);
      await expect.poll(payload, { timeout: 20000 }).toBeTruthy();
      const shared = await payload();
      expect(shared!.title).toBe(copy.fortune.shareTitle);
      expect(shared!.text).toContain(locale === "ja-JP" ? "私の運勢は" : "My fortune is");
      expect(shared!.text).not.toMatch(/エンジニア|engineer|2026|令和八年/i);
      const visible = await card.innerText();
      const displayedLevel = await card.getByLabel(/^運勢は/).innerText();
      expect(Object.values(copy.fortune.levels)).toContain(displayedLevel);
      expect(shared!.text).toContain(`✨ ${displayedLevel} ✨`);
      const messages = Object.values(copy.fortune.messages)
        .flat()
        .filter((value) => visible.includes(value));
      expect(messages).toHaveLength(1);
      expect(shared!.text).toContain(messages[0]);
      expect(shared!.text).toContain("utm_campaign=omikuji");
    });
  });
}
