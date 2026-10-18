
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Run tests in parallel where supported
  fullyParallel: true,

  // Fail on CI if test.only is accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 1,

  // Configure workers
  workers: process.env.CI ? 2 : 1,

  // HTML test report
  reporter: "html",

  // Shared settings for all tests
  use: {
    trace: "on-first-retry",
    headless: true,
  },

  // Run tests only on Chromium
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
