import { test, expect } from '@playwright/test';

test.describe('Luồng 7: CV Editor - Bố cục (Sidebar)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cvs/create');
    await expect(page.locator('.cv-pages-wrapper').first()).toBeVisible({ timeout: 15000 });
  });

  test('chuyển sang tab Bố cục và ẩn section', async ({ page }) => {
    // Tab "Bố cục" chính xác trong sidebar
    await page.getByRole('button', { name: 'Bố cục', exact: true }).click();

    const hideBtn = page.locator('.sidebar-body button[title="Ẩn mục này"]').first();
    await hideBtn.click();

    await expect(page.getByText('Kéo thả vào đây để ẩn mục')).toBeVisible();
  });
});
