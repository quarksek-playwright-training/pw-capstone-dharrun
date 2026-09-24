import { test, expect } from '../fixtures/test.fixture';
import { accounts } from '../utils/accounts';
import { login, deleteArticle } from '../utils/api';

test.describe('[smoke][articles]', () => {
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

  test('[smoke][articles] user can publish an article', async ({
    authenticatedPage,
    articlePage,
  }) => {
    const title = `Playwright Article ${Date.now()}`;

    await authenticatedPage.goto('/');

    await articlePage.openEditor();

    createdSlug = await articlePage.publish(
      title,
      'Playwright article',
      'This article was created during the Playwright framework test.',
      ['playwright', 'automation']
    );

    await articlePage.openAuthorProfile(
      accounts.first.username
    );

    await expect(
      authenticatedPage.getByRole('heading', { name: title })
    ).toBeVisible();
  });
});