import { test as setup, Page } from '@playwright/test';
import { accounts } from '../utils/accounts';
import { AuthPage } from '../pages/AuthPage';

async function loginAccount(
  page: Page,
  account: typeof accounts.first,
  authFile: string
): Promise<boolean> {
  const auth = new AuthPage(page);

  await page.goto('/');
  await auth.openLogin();

  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('/api/users/login') &&
      response.request().method() === 'POST'
  );

  await auth.login(account.email, account.password);

  const response = await responsePromise;

  console.log('LOGIN API:', response.url());
  console.log('LOGIN STATUS:', response.status());


  if (response.status() !== 200) {
    return false;
  }

  await page.context().storageState({ path: authFile });

  return true;
}

async function createAccount(
  page: Page,
  account: typeof accounts.first
): Promise<boolean> {
  const auth = new AuthPage(page);

  await page.goto('/');
  await auth.openSignup();

  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('/api/users') &&
      response.request().method() === 'POST'
  );

  await auth.signup(
    account.username,
    account.email,
    account.password
  );

  const response = await responsePromise;

  console.log('SIGNUP API:', response.url());
  console.log('SIGNUP STATUS:', response.status());


  return response.status() === 201;
}

async function prepareAccount(
  page: Page,
  account: typeof accounts.first,
  authFile: string
) {
  console.log(`\nPreparing account: ${account.username}`);

  // Try existing account first.
  const loggedIn = await loginAccount(
    page,
    account,
    authFile
  );

  if (loggedIn) {
    console.log(`Account already exists: ${account.username}`);
    return;
  }

  // Account doesn't exist, so create it.
  const created = await createAccount(page, account);

  if (!created) {
    throw new Error(
      `Could not create account: ${account.username}`
    );
  }

  // Login after successful signup and save storage state.
  await page.context().storageState({
  path: authFile,
});

console.log(`Authentication state saved: ${authFile}`);
}

setup('prepare first account', async ({ page }) => {
  await prepareAccount(
    page,
    accounts.first,
    '.auth/first.json'
  );
});

setup('prepare second account', async ({ page }) => {
  await prepareAccount(
    page,
    accounts.second,
    '.auth/second.json'
  );
});