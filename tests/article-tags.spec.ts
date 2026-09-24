import { test, expect } from '../fixtures/test.fixture';
import { accounts } from '../utils/accounts';
import { login, deleteArticle } from '../utils/api';

const articles = [
  {
    title: `Playwright Article ${Date.now()}`,
    tag: 'playwright',
  },
  {
    title: `Automation Article ${Date.now()}`,
    tag: 'automation',
  },
  {
    title: `Git Article ${Date.now()}`,
    tag: 'Git',
  },
];

test.describe('[regression][articles]', () => {
  const createdSlugs: string[] = [];
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await login(
      request,
      accounts.first.email,
      accounts.first.password
    );
  });

  test.afterEach(async ({ request }) => {
    for (const slug of createdSlugs) {
      await deleteArticle(request, token, slug);
    }

    createdSlugs.length = 0;
  });

  test('[regression][articles] data-driven articles contain their tags', async ({
    authenticatedPage,
    articlePage,
  }) => {
    await authenticatedPage.goto('/');

    for (const article of articles) {
      await articlePage.openEditor();

      const slug = await articlePage.publish(
        article.title,
        'Data-driven article',
        `Article created for ${article.tag}.`,
        [article.tag]
      );

      createdSlugs.push(slug);
    }

    await authenticatedPage.goto('/');

    for (const article of articles) {
      const articleCard = authenticatedPage
        .getByRole('link', { name: new RegExp(article.title) });

      await expect(articleCard).toContainText(article.tag);
    }
  });
});