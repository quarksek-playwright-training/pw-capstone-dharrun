import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openProfile(username: string): Promise<void> {
    await this.page.getByRole('link', { name: username }).click();
  }

  async openTag(tag: string): Promise<void> {
    await this.page.getByRole('link', { name: tag, exact: true }).click();
  }

  article(title: string) {
    return this.page.getByRole('link', { name: title });
  }
}
