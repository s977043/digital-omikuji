import { test, expect, type Page } from "@playwright/test";

async function gotoRoute(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Digital Omikuji Web", () => {
  test("should display title and draw button", async ({ page }) => {
    await gotoRoute(page, "/");

    await expect(page.getByText(/デジタルおみくじ/).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "おみくじを引く" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("button", { name: "履歴を見る" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("should draw omikuji and show result", async ({ page }) => {
    await gotoRoute(page, "/");

    const drawButton = page.getByRole("button", { name: "おみくじを引く" });
    await expect(drawButton).toBeVisible({ timeout: 15000 });
    await drawButton.click();

    await expect(page.getByText("念を込めて...")).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/大吉|中吉|小吉|末吉|凶|吉/).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("history direct entry returns to home", async ({ page }) => {
    await gotoRoute(page, "/history");

    await expect(page.getByText("運勢手帳")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "← 戻る" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("新春デジタルおみくじ", { exact: true })).toBeVisible({
      timeout: 10000,
    });
  });

  test("privacy direct entry returns to home", async ({ page }) => {
    await gotoRoute(page, "/privacy-policy");

    await expect(page.getByText("プライバシーポリシー", { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "← 戻る" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("新春デジタルおみくじ", { exact: true })).toBeVisible({
      timeout: 10000,
    });
  });
});
