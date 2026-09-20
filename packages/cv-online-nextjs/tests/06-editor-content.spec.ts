import { test, expect } from '@playwright/test';

test.describe('Luồng 6: CV Editor - Soạn thảo trực tiếp', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/templates');
    const firstCard = page.locator('article.template-library-card').first();
    await firstCard.hover();
    await firstCard.getByRole('button', { name: /Tạo CV|Chọn Mẫu/i }).click();
    await page.waitForURL(/.*cvs\/create/);
  });

  test('soạn thảo thông tin trực tiếp và kiểm tra preview cập nhật', async ({ page }) => {
    // 1. Nhập Họ và tên qua container
    const nameContainer = page.locator('.cv-pages-wrapper .editable-container').filter({
      has: page.locator('[data-placeholder*="Họ và tên" i]'),
    });
    await nameContainer.click();
    await page.keyboard.insertText('Nguyễn Văn A - Software Engineer');

    // 2. Nhập Vị trí ứng tuyển
    const roleContainer = page.locator('.cv-pages-wrapper .editable-container').filter({
      has: page.locator('[data-placeholder*="ứng tuyển" i]'),
    });
    await roleContainer.click();
    await page.keyboard.insertText('Senior Fullstack Developer');

    // 3. Kiểm tra Preview cập nhật tức thì
    const previewWrapper = page.locator('.cv-pages-wrapper').first();
    await expect(previewWrapper).toContainText('Nguyễn Văn A - Software Engineer');
    await expect(previewWrapper).toContainText('Senior Fullstack Developer');

    // 4. Nhấn Lưu CV khi chưa đăng nhập -> hiển thị thông báo bảo vệ
    const saveBtn = page.getByRole('button', { name: 'Lưu CV' });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.locator('text=Bạn cần đăng nhập để lưu CV')).toBeVisible();
  });
});
