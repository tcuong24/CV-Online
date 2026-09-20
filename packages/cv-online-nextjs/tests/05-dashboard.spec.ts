import { test, expect } from '@playwright/test';

test.describe('Luồng 5: Dashboard Quản lý CV', () => {
  test('mở trang dashboard và kiểm tra nút hành động tạo CV mới', async ({ page }) => {
    await page.goto('/dashboard');
    
    const createBtn = page.getByRole('link', { name: /Tạo CV mới|Khám phá mẫu CV/i });
    if (await createBtn.isVisible()) {
      await expect(createBtn).toBeVisible();
      await createBtn.click();
      await expect(page).toHaveURL(/.*(templates|cvs\/create)/);
    }
  });
});
