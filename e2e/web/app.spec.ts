import { test, expect } from "@playwright/test";

test.describe("Digital Omikuji Web", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to fully load (React hydration)
    await page.waitForLoadState("networkidle");
  });

  test("should display title and draw button", async ({ page }) => {
    // Check for title containing "デジタルおみくじ"
    await expect(page.getByText(/デジタルおみくじ/)).toBeVisible({
      timeout: 10000,
    });

    // Check for "Draw" button text (second element with this text - the button)
    // The first is the instruction text, the second is the button itself
    await expect(page.getByText("おみくじを引く").nth(1)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should draw omikuji and show result", async ({ page }) => {
    // Wait for draw button to appear and click it (second element)
    const drawButton = page.getByText("おみくじを引く").nth(1);
    await expect(drawButton).toBeVisible({ timeout: 15000 });
    await drawButton.click();

    // Should enter SHAKING state (Wait for animation)
    // "念を込めて..." text appears
    await expect(page.getByText("念を込めて...")).toBeVisible({
      timeout: 10000,
    });

    // Wait for result (animation takes ~4-5 seconds)
    // Check for result details section that appears after animation
    await expect(page.getByText("運勢詳細")).toBeVisible({ timeout: 15000 });
  });
});
