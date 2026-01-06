import { test, expect } from '@playwright/test';

test.describe('Digital Omikuji Web', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display title and draw button', async ({ page }) => {
        // Check for title containing "デジタルおみくじ"
        await expect(page.getByText(/デジタルおみくじ/)).toBeVisible();

        // Check for "Draw" button (Web version shows this when sensors are unavailable)
        const drawButton = page.getByRole('button', { name: 'おみくじを引く' });
        await expect(drawButton).toBeVisible();
    });

    test('should draw omikuji and show result', async ({ page }) => {
        // Click draw button
        await page.getByRole('button', { name: 'おみくじを引く' }).click();

        // Should enter SHAKING state (Wait for animation)
        // "念を込めて..." text appears
        await expect(page.getByText('念を込めて...')).toBeVisible();

        // Wait for result (approx 4-5 seconds total animation)
        // Expect "大吉" or similar fortune result text, but more reliably check for result display elements
        // The result screen has a "もう一度引く" (Draw again) or similar, but initially it shows the fortune.
        // Let's check for the fortune level text which is usually large.
        // Since it's random, we check for visibility of the result container or common elements.

        // We can check if "運勢" is displayed or specific fortune levels.
        // Or wait for the "history" button to potentially changes? No.
        // Let's wait for a known text on the result card like "願望" (Wish) or "待人" (Waiting person) which are in details.
        // Or simply the large character display.

        // Using a generous timeout for the animation
        await expect(page.locator('text=運勢')).toBeVisible({ timeout: 10000 });
    });
});
