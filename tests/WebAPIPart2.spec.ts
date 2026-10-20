import { test, expect, request, Locator } from "@playwright/test";
import { APIUtils } from "../utils/APIUtils";
const loginPayload: {
  userEmail: string;
  userPassword: string;
} = { userEmail: "sky@ymail.com", userPassword: "Learning@830$3mK2" };
const orderPayload: {
  orders: {
    country: string;
    productOrderedId: string;
  }[];
} = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};

let loginToken: any;
let orderId: any;
let apiContext: any;
let apiUtils: any;

test.beforeAll(async () => {
  apiContext = await request.newContext();

  apiUtils = new APIUtils(apiContext, null, loginPayload); // Pass null for page initially, will set it later in the test
  loginToken = await apiUtils.getToken();
  console.log("Login Token:", loginToken);
});

// Verify if order created is showing in history page
// So pre condition is create order and then verify in history page
// So we can create order using API and then verify in history page using UI

test("Verify API-created order appears in order history", async ({ page }) => {
  // Give the current test's page to APIUtils
  apiUtils.page = page;

  // Create order using API

  orderId = await apiUtils.createOrder(orderPayload, loginToken);
  console.log("Order ID:", orderId);

  // Now we are going to verify the order in history page using UI
  await apiUtils.addTokenToLocalStorage(loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const cartButton: Locator = page.locator("[routerlink*='myorders']");
  await expect(cartButton).toBeVisible();
  await cartButton.click();
  await page.locator("tbody").waitFor();
  const orderRows: Locator = page.locator("tbody tr");
  const orderCount: number = await orderRows.count();
  for (let i: number = 0; i < orderCount; ++i) {
    const rowOrderId: any = await orderRows.nth(i).locator("th").textContent();
    if (rowOrderId === orderId) {
      await orderRows.nth(i).locator("button.btn-primary").click();
      break;
    }
  }
  const orderDetailsIdLocator: Locator = page.locator(".col-text");
  const orderDetailsIdText: any = await orderDetailsIdLocator.textContent();
  const orderDetailsId = orderDetailsIdText.replace(/\|/g, "").trim();
  expect(orderId).toEqual(orderDetailsId);
});
