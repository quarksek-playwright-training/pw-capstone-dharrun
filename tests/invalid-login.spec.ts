import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { accounts } from '../utils/accounts';

test('[regression][auth][negative] invalid password shows exact login error', async ({
  page,
}) => {
  const auth = new AuthPage(page);

  await page.goto('/');
  await auth.openLogin();

  await auth.login(
    accounts.first.email,
    'DefinitelyWrongPassword123!'
  );

  await expect(page).toHaveURL(/\/login/);

  await expect(
    page.getByText('email or password is invalid', { exact: true })
  ).toBeVisible();
});