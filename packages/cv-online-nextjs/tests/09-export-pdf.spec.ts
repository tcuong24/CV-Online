import { test, expect } from '@playwright/test';

test.describe('Luồng 9: Xem trước & Tải PDF', () => {
  test('kiểm tra giao diện xem trước CV qua ID và nút Tải xuống PDF', async ({ page }) => {
    // Mock API endpoint public-cvs của NestJS
    await page.route('**/*public-cvs/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-cv-id',
          title: 'CV Lập Trình Viên',
          personalInfo: {
            fullName: 'Nguyễn Văn A',
            jobTitle: 'Senior Developer',
            email: 'nguyenvana@gmail.com',
          },
          template: {
            id: 'template-default',
            layoutType: 'two-column',
            designConfig: {
              colors: { primary: '#2563eb' },
              typography: { fontId: 'inter', fontSize: 13 },
            },
            sectionsConfig: {},
          },
        }),
      });
    });

    // Mở trang preview của CV theo ID
    await page.goto('/preview/mock-cv-id');

    // Kiểm tra tên hiển thị trên thanh Preview Bar
    await expect(page.locator('.preview-title')).toContainText('Nguyễn Văn A');

    // Kiểm tra nút Tải xuống PDF
    const downloadBtn = page.getByRole('button', { name: /Tải xuống PDF|Tải PDF/i });
    await expect(downloadBtn).toBeVisible({ timeout: 5000 });
    await expect(downloadBtn).toBeEnabled();
  });

  test('hiển thị trạng thái rỗng khi truy cập trực tiếp /preview mà chưa có dữ liệu CV', async ({ page }) => {
    await page.goto('/preview');
    await expect(page.getByText('Chưa có dữ liệu CV')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tạo CV ngay →' })).toBeVisible();
  });
});
