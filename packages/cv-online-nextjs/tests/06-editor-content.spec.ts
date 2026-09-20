import { test, expect } from '@playwright/test';

test.describe('Luồng 6: CV Editor - Soạn thảo trực tiếp', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cvs/create');
    await expect(page.locator('.cv-pages-wrapper').first()).toBeVisible({ timeout: 15000 });
  });

  test('soạn thảo thông tin trực tiếp và kiểm tra preview cập nhật', async ({ page }) => {
    // 1. Nhập Họ và tên trực tiếp trên CV
    const nameEl = page.locator('.cv-pages-wrapper').getByText('Trần Văn A');
    await nameEl.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.type('Nguyễn Văn A - Software Engineer');

    // 3. Kiểm tra Preview cập nhật tức thì
    const previewWrapper = page.locator('.cv-pages-wrapper').first();
    await expect(previewWrapper).toContainText('Nguyễn Văn A - Software Engineer');

    // 4. Nhấn Lưu CV khi chưa đăng nhập -> hiển thị thông báo bảo vệ
    const saveBtn = page.getByRole('button', { name: 'Lưu CV' });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.locator('text=Bạn cần đăng nhập để lưu CV')).toBeVisible();
  });
});
