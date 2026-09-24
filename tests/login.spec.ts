import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { accounts } from '../utils/accounts';

test('[smoke][auth] user can log in with valid credentials', async ({
  page,
}) => {
  const auth = new AuthPage(page);

  await page.goto('/');
  await auth.openLogin();

  await auth.login(
    accounts.first.email,
    accounts.first.password
  );

  await expect(page).not.toHaveURL(/\/login/);

  await expect(
    page.getByRole('link', { name: accounts.first.username })
  ).toBeVisible();
});