import { test, expect } from '@playwright/test';

test.describe('Luồng 10: Responsive & Mobile Viewport', () => {
  test('hiển thị hướng dẫn xoay ngang trên mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cvs/create');

    await expect(page.getByText('Xoay ngang điện thoại')).toBeVisible();
  });
});
