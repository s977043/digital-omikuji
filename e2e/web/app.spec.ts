import { test, expect } from "@playwright/test";

test.describe("Digital Omikuji Web", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Reset persisted state (AsyncStorage uses localStorage on web) on the same origin
    await page.evaluate(async () => {
      localStorage.clear();
      if (indexedDB && "databases" in indexedDB) {
        const dbs = await indexedDB.databases();
        for (const db of dbs) {
          if (db.name) indexedDB.deleteDatabase(db.name);
        }
      }
    });

    // Reload once to start from a clean slate after clearing storage
    await page.reload({ waitUntil: "networkidle" });
  });

  test("should display title and draw button", async ({ page }) => {
    // Check for title containing "デジタルおみくじ"
    await expect(page.getByText(/デジタルおみくじ/)).toBeVisible({
      timeout: 10000,
    });

    const drawButton = page.getByRole("button", { name: "おみくじを引く" });
    await expect(drawButton).toBeVisible({ timeout: 15000 });
  });

  test("should draw omikuji and show result", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: "おみくじを引く" });
    await expect(drawButton).toBeVisible({ timeout: 15000 });
    await drawButton.click();

    // Should enter SHAKING state (Wait for animation)
    await expect(page.getByText("願いを込めて...")).toBeVisible({
      timeout: 10000,
    });

    // Drawing overlay
    await expect(page.getByText("運命を紐解いています...")).toBeVisible({
      timeout: 15000,
    });

    // Wait for result (animation takes ~4-5 seconds)
    // Check for result details section that appears after animation
    await expect(page.getByText("運勢詳細")).toBeVisible({ timeout: 20000 });
  });
});
