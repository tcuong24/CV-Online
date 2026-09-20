import { test, expect } from '@playwright/test';

test.describe('Luồng 4: Thư viện mẫu CV', () => {
  test('kiểm tra bộ lọc tags và chọn mẫu CV để tạo', async ({ page }) => {
    // Mock template API nếu backend chưa chạy
    await page.route(/.*\/api\/templates.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        },
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

    await expect(page).toHaveURL(/.*cvs\/create/, { timeout: 15000 });
  });
});
