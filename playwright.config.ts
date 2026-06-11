import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:5181',
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['html', {open: 'on-failure'}]],
  use: {
    baseURL: 'http://localhost:5181/',
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
});
