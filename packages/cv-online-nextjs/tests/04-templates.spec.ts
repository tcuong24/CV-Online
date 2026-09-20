import { test, expect } from '@playwright/test';

test.describe('Luồng 4: Thư viện mẫu CV', () => {
  test('kiểm tra bộ lọc tags và chọn mẫu CV để tạo', async ({ page }) => {
    await page.goto('/templates');
    await expect(page.locator('h1')).toContainText('Khám phá thư viện mẫu CV');

    const allBtn = page.getByRole('button', { name: 'Tất cả' });
    await expect(allBtn).toBeVisible();

    const firstCard = page.locator('article.template-library-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.hover();

    const selectBtn = firstCard.getByRole('button', { name: /Tạo CV|Chọn Mẫu/i });
    await expect(selectBtn).toBeVisible();
    await selectBtn.click();

    await expect(page).toHaveURL(/.*cvs\/create/);
  });
});
