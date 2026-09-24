import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openLogin(): Promise<void> {
    await this.page.getByRole('link', { name: 'Sign in' }).click();
  }

  async openSignup(): Promise<void> {
    await this.page.getByRole('link', { name: 'Sign up' }).click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }
}
