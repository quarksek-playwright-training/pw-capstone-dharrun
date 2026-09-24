import { Page } from '@playwright/test';

export class BasePage {
  constructor(
    protected page: Page,
    protected path = ''
  ) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
