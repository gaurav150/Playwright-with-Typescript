import {
  test as base,
  request,
  type Locator,
  type Page,
} from "@playwright/test";

import { APIUtils } from "./APIUtils";

interface LoginPayload {
  userEmail: string;
  userPassword: string;
}

interface OrderPayload {
  orders: {
    country: string;
    productOrderedId: string;
  }[];
}

interface CreateOrderFixture {
  orderId: string;
  loginToken: string;
}

interface CustomFixtures {
  authenticatedPage: Page;
  createOrder: CreateOrderFixture;
}

const loginPayload: LoginPayload = {
  userEmail: process.env.API_USER_EMAIL ?? "sky@ymail.com",
  userPassword: process.env.API_USER_PASSWORD ?? "Learning@830$3mK2",
};

const orderPayload: OrderPayload = {
  orders: [
    {
      country: "India",
      productOrderedId: "6960eac0c941646b7a8b3e68",
    },
  ],
};

function validateCredentials(): void {
  if (!loginPayload.userEmail || !loginPayload.userPassword) {
    throw new Error(
      "Set API_USER_EMAIL and API_USER_PASSWORD environment variables.",
    );
  }
}

export const customTest = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    validateCredentials();

    const userEmail: Locator = page.locator("#userEmail");
    const userPassword: Locator = page.locator("#userPassword");
    const loginButton: Locator = page.locator("#login");
    const productTitle: Locator = page.locator(".card-body b");

    await page.goto("https://rahulshettyacademy.com/client/");
    await userEmail.fill(loginPayload.userEmail);
    await userPassword.fill(loginPayload.userPassword);
    await loginButton.click();

    await page.waitForLoadState("networkidle");
    await productTitle.first().waitFor();

    await use(page);

    // Playwright automatically manages the built-in page fixture.
    // No explicit page.close() is required.
  },

  createOrder: async ({}, use) => {
    validateCredentials();

    const apiContext = await request.newContext();

    try {
      const apiUtils = new APIUtils(apiContext, null, loginPayload);

      const loginToken: string = await apiUtils.getToken();
      const orderId: string = await apiUtils.createOrder(
        orderPayload,
        loginToken,
      );

      await use({ orderId, loginToken });
    } finally {
      await apiContext.dispose();
    }
  },
});
