import { test, expect } from '@playwright/test';

test.describe('Luồng E2E: Khám phá Template & Chỉnh sửa CV Realtime', () => {
  test('chọn template, chỉnh sửa thông tin và kiểm tra preview cập nhật tức thì', async ({ page }) => {
    // Mock template API nếu backend chưa chạy
    await page.route('**/api/templates*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'mock-template-1',
            name: 'Mẫu Tiêu Chuẩn',
            description: 'Mẫu CV chuyên nghiệp chuẩn ATS',
            thumbnailUrl: '/templates/standard.png',
            category: 'standard',
            isPremium: false,
            isPublished: true,
            layoutType: 'standard',
            popularityScore: 100,
            usageCount: 50,
            version: '1.0',
            designConfig: { theme: { primaryColor: '#000000' } },
            sectionsConfig: {},
            tags: ['Tất cả', 'Chuyên nghiệp', 'ATS Friendly'],
          },
        ]),
      });
    });

    // 1. Đi tới trang thư viện mẫu CV
    await page.goto('/templates');

    // 2. Kiểm tra tiêu đề trang đã render
    await expect(page.locator('h1')).toContainText('Khám phá thư viện mẫu CV');

    // 3. Tìm thẻ card template đầu tiên
    const firstCard = page.locator('article.template-library-card').first();
    await expect(firstCard).toBeVisible();

    // Rê chuột vào card để hiện các nút bấm ẩn
    await firstCard.hover();

    // Click nút "Tạo CV" (hoặc "Chọn Mẫu")
    const createBtn = firstCard.getByRole('button', { name: /Tạo CV|Chọn Mẫu/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // 4. Assert trình duyệt đã chuyển sang trang Editor /cvs/create
    await expect(page).toHaveURL(/.*cvs\/create/);

    // 5. Điền thông tin vào input "Họ và tên"
    const nameContainer = page.locator('.cv-pages-wrapper .editable-container').filter({
      has: page.locator('[data-placeholder*="Họ và tên" i]'),
    });
    await nameContainer.click();
    await page.keyboard.insertText('Nguyễn Văn A - Software Engineer');

    // 6. Điền thông tin vào input "Chức danh"
    const roleContainer = page.locator('.cv-pages-wrapper .editable-container').filter({
      has: page.locator('[data-placeholder*="ứng tuyển" i]'),
    });
    await roleContainer.click();
    await page.keyboard.insertText('Senior Fullstack Developer');


    // 7. Assert: Bản xem trước (Preview) bên phải phải cập nhật chữ vừa gõ ngay lập tức
    const previewWrapper = page.locator('.cv-pages-wrapper').first();
    await expect(previewWrapper).toContainText('Nguyễn Văn A - Software Engineer');
    await expect(previewWrapper).toContainText('Senior Fullstack Developer');

    // 8. Kiểm tra nút "Lưu CV" trên thanh công cụ chuyển sang màu xanh và enable
    const saveBtn = page.getByRole('button', { name: 'Lưu CV' });
    await expect(saveBtn).toBeEnabled();

    // 9. Click "Lưu CV" khi chưa đăng nhập -> Toast thông báo bảo vệ phải hiện lên
    await saveBtn.click();
    await expect(page.locator('text=Bạn cần đăng nhập để lưu CV')).toBeVisible();
  });
});
