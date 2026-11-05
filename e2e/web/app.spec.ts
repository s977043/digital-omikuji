import { test, expect, type Page } from "@playwright/test";

async function gotoRoute(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Digital Omikuji Web", () => {
  test("explains the daily draw before starting and preserves today's result on return", async ({
    page,
  }) => {
    await gotoRoute(page, "/");

    await expect(
      page.getByText("1日1回。今日の結果は何度でも読み返せます。", { exact: false })
    ).toBeVisible();
    await expect(page.getByText("ボタンをタップして始めます。", { exact: false })).toBeVisible();
    await expect(page.getByText(/シェイクでもタップでも/)).toHaveCount(0);
    await page.getByRole("button", { name: "おみくじを引く", exact: true }).click();

    const result = page.getByRole("dialog", { name: "おみくじ結果", exact: true });
    await expect(result).toBeVisible({ timeout: 20000 });
    const resultText = await result.innerText();
    const savedHistory = await page.evaluate(() => localStorage.getItem("omikuji_history_v2"));
    expect(savedHistory).not.toBeNull();
    expect(JSON.parse(savedHistory!).length).toBe(1);
    await result.getByRole("button", { name: "持ち帰る", exact: true }).click();
    await expect(page.getByRole("button", { name: "結果をもう一度見る" })).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "結果をもう一度見る" }).click();
    await expect(result).toHaveText(resultText, { useInnerText: true });
    expect(await page.evaluate(() => localStorage.getItem("omikuji_history_v2"))).toBe(
      savedHistory
    );
    await expect(page.getByRole("button", { name: "おみくじを引く", exact: true })).toHaveCount(0);
  });

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

  test("result overlay is exposed as a modal dialog (focus trap attributes)", async ({ page }) => {
    await gotoRoute(page, "/");

    const drawButton = page.getByRole("button", { name: "おみくじを引く" });
    await expect(drawButton).toBeVisible({ timeout: 15000 });
    await drawButton.click();

    // Wait for the result overlay (the only one with user-actionable focusables)
    await expect(page.getByText(/大吉|中吉|小吉|末吉|凶|吉/).first()).toBeVisible({
      timeout: 20000,
    });

    // ExperienceScreenTemplate should have tagged the overlay container as
    // a modal dialog for assistive tech + keyboard focus management.
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
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
    await expect(page.getByText("エラーの診断情報", { exact: true })).toBeVisible();
    await expect(
      page.getByText("診断機能が有効な配布版ではSentryを利用します。", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText("すでに送信された診断情報は削除されません。", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText("基本的に外部サーバーへのデータ送信を行いません", { exact: false })
    ).toHaveCount(0);
    await page.getByRole("button", { name: "← 戻る" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("新春デジタルおみくじ", { exact: true })).toBeVisible({
      timeout: 10000,
    });
  });
});

test("empty history offers an explicit return to the fortune screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/history");
  await expect(page.getByText("まだ履歴がありません。", { exact: false })).toBeVisible();
  const action = page.getByRole("button", { name: "おみくじの画面へ", exact: true });
  await expect(action).toBeInViewport({ ratio: 1 });
  await page.evaluate(() => document.fonts.ready);
  const actionBox = await action.boundingBox();
  const versionBox = await page.getByText(/^v\d+\.\d+\.\d+$/).boundingBox();
  expect(actionBox).not.toBeNull();
  expect(versionBox).not.toBeNull();
  expect(actionBox!.y + actionBox!.height).toBeLessThanOrEqual(versionBox!.y);
  await action.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "おみくじを引く", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("reduced motion preference survives reload and can be turned off", async ({ page }) => {
  await page.goto("/settings");
  const toggle = page.getByRole("switch", { name: "アニメーションを抑える", exact: true });
  await expect(toggle).toBeEnabled();
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("app_settings_v1") ?? "{}").forceReducedMotion
      )
    )
    .toBe(true);
  await page.reload();
  await expect(toggle).toBeEnabled();
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("app_settings_v1") ?? "{}").forceReducedMotion
      )
    )
    .toBe(false);
  await page.reload();
  await expect(toggle).toBeEnabled();
  await expect(toggle).not.toBeChecked();
  await page.getByRole("button", { name: "← 戻る", exact: true }).click();
  await expect(page.getByRole("button", { name: "おみくじを引く", exact: true })).toBeVisible();
});

test("cancelling history deletion preserves the saved fortune after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "おみくじを引く", exact: true }).click();
  const result = page.getByRole("dialog", { name: "おみくじ結果", exact: true });
  await expect(result).toBeVisible({ timeout: 20000 });
  await result.getByRole("button", { name: "持ち帰る", exact: true }).click();
  await page.goto("/history");
  const remove = page.getByRole("button", { name: "全削除", exact: true });
  await expect(remove).toBeVisible();
  const saved = await page.evaluate(() => ({
    history: localStorage.getItem("omikuji_history_v2"),
    lastDraw: localStorage.getItem("omikuji_last_draw_date"),
  }));
  expect(saved.history).not.toBeNull();
  expect(saved.lastDraw).not.toBeNull();
  expect(JSON.parse(saved.history!)).toHaveLength(1);
  const confirmation = page.waitForEvent("dialog");
  const click = remove.click();
  const dialog = await confirmation;
  expect(dialog.type()).toBe("confirm");
  expect(dialog.message()).toBe("本当にすべての履歴を削除しますか？");
  await dialog.dismiss();
  await click;
  await page.reload();
  await expect(remove).toBeVisible();
  expect(
    await page.evaluate(() => ({
      history: localStorage.getItem("omikuji_history_v2"),
      lastDraw: localStorage.getItem("omikuji_last_draw_date"),
    }))
  ).toEqual(saved);
  await expect(page.getByText("まだ履歴がありません。", { exact: false })).toHaveCount(0);
});

test("rapid double activation saves one fortune and revisits the same result", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "おみくじを引く", exact: true }).dblclick();
  const result = page.getByRole("dialog", { name: "おみくじ結果", exact: true });
  await expect(result).toBeVisible({ timeout: 20000 });
  const resultText = await result.innerText();
  const saved = await page.evaluate(() => localStorage.getItem("omikuji_history_v2"));
  expect(saved).not.toBeNull();
  expect(JSON.parse(saved!)).toHaveLength(1);
  await result.getByRole("button", { name: "持ち帰る", exact: true }).click();
  await expect(page.getByRole("button", { name: "おみくじを引く", exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "結果をもう一度見る", exact: true }).click();
  await expect(result).toHaveText(resultText, { useInnerText: true });
  expect(await page.evaluate(() => localStorage.getItem("omikuji_history_v2"))).toBe(saved);
});
