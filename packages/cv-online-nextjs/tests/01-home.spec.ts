import { test, expect } from '@playwright/test';

test.describe('Luồng 1: Trang chủ', () => {
  test('hiển thị hero section và điều hướng sang trang templates', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Sự nghiệp của bạn');

    const exploreBtn = page.getByRole('link', { name: 'Xem các mẫu CV' });
    await expect(exploreBtn).toBeVisible();
    await exploreBtn.click();
    await expect(page).toHaveURL(/.*templates/, { timeout: 15000 });
  });
});
