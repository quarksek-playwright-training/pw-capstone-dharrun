import { test, expect } from '../fixtures/test.fixture';
import { accounts } from '../utils/accounts';
import { login, deleteArticle } from '../utils/api';

test.describe('[regression][articles]', () => {
  let createdSlug: string | undefined;
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await login(
      request,
      accounts.first.email,
      accounts.first.password
    );
  });

  test.afterEach(async ({ request }) => {
    if (createdSlug) {
      await deleteArticle(request, token, createdSlug);
      createdSlug = undefined;
    }
  });

  test('[regression][articles] article is isolated between accounts', async ({
    authenticatedPage,
    articlePage,
    secondAccountPage,
  }) => {
    const title = `Private Article ${Date.now()}`;

    // Account 1 creates the article.
    await authenticatedPage.goto('/');

    await articlePage.openEditor();

    createdSlug = await articlePage.publish(
      title,
      'State isolation test',
      'This article belongs to the first account.',
      ['isolation']
    );

    // Account 2 opens Account 1's profile.
    await secondAccountPage.goto(
      `/profile/${accounts.first.username}`
    );

    // Account 2 should not see Account 1's article.
    await expect(
      secondAccountPage.getByRole('link', { name: title })
    ).not.toBeVisible();
  });
});