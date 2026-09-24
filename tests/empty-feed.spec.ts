import { test, expect } from '../fixtures/test.fixture';

test('[regression][articles][negative] empty feed is handled correctly', async ({
  authenticatedPage,
}) => {
  await authenticatedPage.route(
    '**/api/articles?limit=10&offset=0',
    async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [],
          articlesCount: 0,
        }),
      });
    }
  );

  await authenticatedPage.goto('/');

  await expect(
    authenticatedPage.getByText('No articles are here... yet.')
  ).toBeVisible();
});