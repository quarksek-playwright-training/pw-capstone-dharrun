import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { accounts } from '../utils/accounts';

test('[regression][auth][negative] duplicate signup is rejected', async ({
  page,
}) => {
  const auth = new AuthPage(page);

  await page.goto('/');
  await auth.openSignup();

  await auth.signup(
    'another_username',
    accounts.first.email,
    'Password123!'
  );

  await expect(page).toHaveURL(/\/register/);

  await expect(
    page.getByText('email has already been taken', { exact: true })
  ).toBeVisible();
});