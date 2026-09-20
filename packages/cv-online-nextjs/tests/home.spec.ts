import { test, expect } from '@playwright/test';

test.describe('Luồng Trang Chủ & Xem Mẫu CV', () => {
  test('mở trang chủ và điều hướng sang trang Templates thành công', async ({ page }) => {
    // 1. Đi tới trang chủ
    await page.goto('http://localhost:3000');

    // 2. Kiểm tra tiêu đề H1 xuất hiện đúng nội dung
    const heading = page.locator('h1');
    await expect(heading).toContainText('Sự nghiệp của bạn');

    // 3. Tìm nút "Xem các mẫu CV" và click
    const exploreBtn = page.getByRole('link', { name: 'Xem các mẫu CV' });
    await expect(exploreBtn).toBeVisible();
    await exploreBtn.click();

    // 4. Assert trình duyệt đã chuyển sang trang /templates
    await expect(page).toHaveURL(/.*templates/);
  });
});
