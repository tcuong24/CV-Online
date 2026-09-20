import { test, expect } from '@playwright/test';

test.describe('Luồng 2: Đăng ký tài khoản', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Đăng ký' }).first().click();
  });

  test('validate các trường bắt buộc khi submit form trống', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Email không hợp lệ')).toBeVisible();
  });

  test('validate khi mật khẩu không khớp', async ({ page }) => {
    await page.locator('input#auth-email').fill('user@test.com');
    await page.locator('input#fullName').fill('Tester');
    await page.locator('input#auth-password').fill('123456');
    await page.locator('input#repeat-password').fill('654321');
    await page.locator('input#terms').check();
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Mật khẩu không khớp')).toBeVisible();
  });

  test('đăng ký thành công với thông tin hợp lệ (mock)', async ({ page }) => {
    // API endpoint tạo tài khoản trong Next.js là /api/register
    await page.route('**/api/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Đăng ký thành công' }),
      });
    });

    const uniqueEmail = `user_${Date.now()}@example.com`;
    await page.locator('input#auth-email').fill(uniqueEmail);
    await page.locator('input#fullName').fill('Nguyen Van A');
    await page.locator('input#auth-password').fill('password123');
    await page.locator('input#repeat-password').fill('password123');
    await page.locator('input#terms').check();
    await page.locator('button[type="submit"]').click();
  });
});
