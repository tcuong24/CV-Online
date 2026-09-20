import { test, expect } from '@playwright/test';

test.describe('Luồng 7: CV Editor - Bố cục (Sidebar)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/templates');
    const firstCard = page.locator('article.template-library-card').first();
    await firstCard.hover();
    await firstCard.getByRole('button', { name: /Tạo CV|Chọn Mẫu/i }).click();
    await page.waitForURL(/.*cvs\/create/);
  });

  test('chuyển sang tab Bố cục và ẩn section', async ({ page }) => {
    // Tab "Bố cục" chính xác trong sidebar
    await page.getByRole('button', { name: 'Bố cục', exact: true }).click();

    const hideBtn = page.locator('.sidebar-body button[title="Ẩn mục này"]').first();
    await hideBtn.click();

    await expect(page.getByText('Kéo thả vào đây để ẩn mục')).toBeVisible();
  });
});
