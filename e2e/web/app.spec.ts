import { test, expect, type Page } from "@playwright/test";

async function gotoRoute(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}

async function expectOverlayCapturesBackgroundPoint(
  page: Page,
  point: { x: number; y: number },
  expectedLabel: string
) {
  const backgroundOwnsInteractionPoint = await page.evaluate(
    ({ x, y, label }) => {
      const topElement = document.elementFromPoint(x, y);
      if (!topElement) {
        return false;
      }
      const ariaLabel = topElement.getAttribute?.("aria-label") ?? "";
      const textContent = topElement.textContent ?? "";
      return ariaLabel.includes(label) || textContent.includes(label);
    },
    { ...point, label: expectedLabel }
  );

  expect(backgroundOwnsInteractionPoint).toBe(false);
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
    const muteToggle = page.getByRole("button", { name: "音声をオフにする" });
    await expect(muteToggle).toBeVisible({ timeout: 10000 });
    const muteToggleBox = await muteToggle.boundingBox();
    expect(muteToggleBox).not.toBeNull();
    const muteTogglePoint = {
      x: muteToggleBox!.x + muteToggleBox!.width / 2,
      y: muteToggleBox!.y + muteToggleBox!.height / 2,
    };
    await expect(drawButton).toBeVisible({ timeout: 15000 });
    await drawButton.click();

    await expect(page.getByText("念を込めて...")).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1800);
    await expectOverlayCapturesBackgroundPoint(page, muteTogglePoint, "音声をオフにする");

    await page.waitForTimeout(4200);
    await expectOverlayCapturesBackgroundPoint(page, muteTogglePoint, "音声をオフにする");
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
