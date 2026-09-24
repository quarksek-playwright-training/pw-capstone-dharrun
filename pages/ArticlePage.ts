import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openEditor(): Promise<void> {
    await this.page.getByRole('link', { name: 'New Article' }).click();
    await this.page.waitForURL('/editor');
  }

  async publish(
    title: string,
    description: string,
    body: string,
    tags: string[]
  ): Promise<string> {
    await this.page.getByPlaceholder('Article Title').fill(title);

    await this.page
      .getByPlaceholder("What's this article about?")
      .fill(description);

    await this.page
      .getByPlaceholder('Write your article (in markdown)')
      .fill(body);

    // XPath #1 — sibling axis is required by the assignment.
    // The tag input is identified relative to the tag-list sibling.
    const tagInput = this.page.locator(
      'xpath=//div[contains(@class,"tag-list")]/preceding-sibling::input[@placeholder="Enter tags"]'
    );

    for (const tag of tags) {
      await tagInput.fill(tag);
      await tagInput.press('Enter');
    }

    // XPath #2 — exact button text is used for the second
    // XPath requirement.
    const publishButton = this.page.locator(
      'xpath=//button[normalize-space()="Publish Article"]'
    );

    await publishButton.click();

    await this.page.waitForURL(/\/article\//);

    return this.page.url().split('/article/')[1];
  }

  async openAuthorProfile(username: string): Promise<void> {
    await this.page.getByRole('link', { name: username }).click();
    await this.page.waitForURL(`/profile/${username}`);
  }
}