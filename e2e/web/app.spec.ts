import { test, expect } from "@playwright/test";

test.describe("Digital Omikuji Web", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Reset persisted state (AsyncStorage uses localStorage on web) on the same origin
    await page.evaluate(async () => {
      localStorage.clear();
      localStorage.setItem("i18nextLng", "ja");
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
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
  });

  test("should draw omikuji and show result", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
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
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });
  });

  test("should show tie/keep/share buttons on first result view", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
    await drawButton.click();

    // Wait for result
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });

    // Should show all three action buttons
    await expect(page.getByRole("button", { name: "シェア" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "結ぶ" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "持ち帰る" })).toBeVisible({ timeout: 10000 });
  });

  test("should display tied confirmation after selecting tie", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
    await drawButton.click();

    // Wait for result
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });

    // Click tie button
    const tieButton = page.getByRole("button", { name: "結ぶ" });
    await tieButton.click();

    // Wait for tied animation and confirmation screen
    await expect(page.getByText("おみくじを結びました")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("良いご縁が結ばれますように…")).toBeVisible();
  });

  test("should display take home confirmation after selecting keep", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
    await drawButton.click();

    // Wait for result
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });

    // Click keep button
    const keepButton = page.getByRole("button", { name: "持ち帰る" });
    await keepButton.click();

    // Wait for keep animation and confirmation screen
    await expect(page.getByText("おみくじを持ち帰りました")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("ときどき読み返して、今日の指針に。")).toBeVisible();
  });

  test("should only show share and close buttons on second result view", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
    await drawButton.click();

    // Wait for result and select tie
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });
    const tieButton = page.getByRole("button", { name: "結ぶ" });
    await tieButton.click();

    // Wait for tied confirmation screen
    await expect(page.getByText("おみくじを結びました")).toBeVisible({ timeout: 30000 });

    // Close confirmation screen to return to IDLE
    const closeButton = page.getByRole("button", { name: "閉じる" });
    await closeButton.click();

    // Click "結果を見る" to view result again
    const viewResultButton = page.getByRole("button", { name: /結果を見る/ });
    await expect(viewResultButton).toBeVisible({ timeout: 30000 });
    await viewResultButton.click();

    // Wait for result screen
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });

    // Should only show share and close buttons (not tie/keep)
    await expect(page.getByRole("button", { name: "シェア" })).toBeVisible();
    await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
    await expect(page.getByRole("button", { name: "結ぶ" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "持ち帰る" })).not.toBeVisible();
  });

  test("should show share button on confirmed screen", async ({ page }) => {
    const drawButton = page.getByRole("button", { name: /おみくじを引く/ });
    await expect(drawButton).toBeVisible({ timeout: 30000 });
    await drawButton.click();

    // Wait for result and select keep
    await expect(page.getByText(/運勢詳細/)).toBeVisible({ timeout: 30000 });
    const keepButton = page.getByRole("button", { name: "持ち帰る" });
    await keepButton.click();

    // Wait for keep confirmation screen
    await expect(page.getByText("おみくじを持ち帰りました")).toBeVisible({ timeout: 30000 });

    // Confirmed screen should have share and view result buttons
    await expect(page.getByRole("button", { name: "シェア" })).toBeVisible();
    await expect(page.getByRole("button", { name: /結果を見る/ })).toBeVisible();
  });
});
