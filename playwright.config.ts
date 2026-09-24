import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  reporter: 'html',

  use: {
    baseURL: 'https://conduit.bondaracademy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
  {
    name: 'setup',
    testMatch: /auth\.setup\.ts/,
  },

  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
    },
    dependencies: ['setup'],
  },

  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
    dependencies: ['setup'],
  },

  {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
    },
    dependencies: ['setup'],
  },
],
});
