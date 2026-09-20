import { test, expect } from '@playwright/test';

test.describe('Luồng 3: Đăng nhập', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('hiển thị thông báo lỗi khi thông tin đăng nhập sai', async ({ page }) => {
    await page.locator('input#auth-email').fill('wrong_account@example.com');
    await page.locator('input#auth-password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Email hoặc mật khẩu không đúng')).toBeVisible({ timeout: 15000 });
  });

  test('validate trường email khi submit form trống', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Email không hợp lệ')).toBeVisible();
  });
});
