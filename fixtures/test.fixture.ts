import { test as base, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { AuthPage } from '../pages/AuthPage';

type Fixtures = {
  authenticatedPage: Page;
  secondAccountPage: Page;
  homePage: HomePage;
  articlePage: ArticlePage;
  authPage: AuthPage;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/first.json',
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  secondAccountPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/second.json',
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  homePage: async ({ authenticatedPage }, use) => {
    await use(new HomePage(authenticatedPage));
  },

  articlePage: async ({ authenticatedPage }, use) => {
    await use(new ArticlePage(authenticatedPage));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

export { expect };