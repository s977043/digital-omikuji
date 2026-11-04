import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
]) {
  test(`${viewport.width}px: draw and revisit without horizontal overflow`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const noHorizontalOverflow = async () => {
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(viewport.width);
    };
    const draw = page.getByRole("button", { name: "おみくじを引く", exact: true });
    await expect(draw).toBeVisible();
    await expect(draw).toBeInViewport({ ratio: 1 });
    await page.evaluate(() => document.fonts.ready);
    const heading = page.getByText(/静かに息を整えて/);
    await expect(heading).toBeVisible();
    expect(
      await heading.evaluate(
        (element) =>
          element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)
      )
    ).toBeLessThanOrEqual(2.01);
    await expect(heading).toHaveText("静かに息を整えて\n今日のおみくじを");
    await noHorizontalOverflow();
    await testInfo.attach("initial-screen", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await draw.scrollIntoViewIfNeeded();
    await draw.click();
    const result = page.getByRole("dialog", { name: "おみくじ結果" });
    await expect(result).toBeVisible({ timeout: 20000 });
    await expect(result).toHaveAttribute("aria-modal", "true");
    await noHorizontalOverflow();
    await testInfo.attach("result-screen", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    const saved = await page.evaluate(() => localStorage.getItem("omikuji_history_v2"));
    expect(saved).not.toBeNull();
    const take = result.getByRole("button", { name: "持ち帰る", exact: true });
    const share = result.getByRole("button", { name: "シェア", exact: true });
    await take.focus();
    await page.keyboard.press("Tab");
    await expect(share).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(take).toBeFocused();
    await take.scrollIntoViewIfNeeded();
    await take.click();
    await page.reload();
    await page.getByRole("button", { name: "結果をもう一度見る" }).click();
    await expect(result).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("omikuji_history_v2"))).toBe(saved);
    await noHorizontalOverflow();
  });
}
