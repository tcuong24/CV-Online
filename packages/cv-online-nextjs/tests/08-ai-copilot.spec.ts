import { test, expect } from '@playwright/test';

test.describe('Luồng 8: AI Co-pilot Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API AI: endpoint trong axios là /cv/ai/chat
    await page.route('**/*cv/ai/chat*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: JSON.stringify({
            intent: 'improve_writing',
            analysis: 'Đoạn văn đã được tối ưu từ ngữ chuyên nghiệp.',
            issues: ['Cần bổ sung số liệu cụ thể'],
            suggestions: [
              {
                field: 'summary',
                label: 'Giới thiệu bản thân',
                oldText: '',
                newText: 'Senior Fullstack Engineer với 5 năm kinh nghiệm...',
              },
            ],
            score: { before: 70, after: 95 },
          }),
        }),
      });
    });

    await page.goto('/templates');
    const firstCard = page.locator('article.template-library-card').first();
    await firstCard.hover();
    await firstCard.getByRole('button', { name: /Tạo CV|Chọn Mẫu/i }).click();
    await page.waitForURL(/.*cvs\/create/);
  });

  test('mở AI chatbox, gửi prompt và nhận phản hồi', async ({ page }) => {
    await page.getByRole('button', { name: 'AI Co-pilot' }).click();

    const aiInput = page.getByPlaceholder('Nhập yêu cầu cải thiện CV...');
    await expect(aiInput).toBeVisible();
    await aiInput.fill('Viết lại phần tóm tắt bản thân chuyên nghiệp hơn');
    await page.keyboard.press('Enter');

    // Kiểm tra nội dung phân tích từ mock response xuất hiện
    await expect(page.getByText('Đoạn văn đã được tối ưu từ ngữ chuyên nghiệp.')).toBeVisible({ timeout: 8000 });
  });
});
