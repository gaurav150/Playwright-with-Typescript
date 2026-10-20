import { test, expect, request } from "@playwright/test";
import { APIUtils } from "../utils/APIUtils";
import fs from "fs";
const loginPayload: { userEmail: string; userPassword: string } = {
  userEmail: "sky@ymail.com",
  userPassword: "Learning@830$3mK2",
};
const orderPayload: {
  orders: { country: string; productOrderedId: string }[];
} = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};

let loginToken: any;
let orderId: any;
let apiContext: any;
let apiUtils: any;
let logStream: any;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  logStream = fs.createWriteStream("networkForNetworkInterceptTest2.log", {
    flags: "w",
  });
  apiUtils = new APIUtils(apiContext, null, loginPayload); // Pass null for page initially, will set it later in the test
  loginToken = await apiUtils.getToken();
  console.log("Login Token:", loginToken);
});

// { flags: 'a' }  // append → keeps previous logs
// { flags: 'w' }  // write   → overwrites previous logs

test.afterAll(async () => {
  logStream.end();
});

test("Security test request intercept", async ({ page }) => {
  // Give the current test's page to APIUtils
  apiUtils.page = page;

  // Create order using API
  orderId = await apiUtils.createOrder(orderPayload, loginToken);

  // Now we are going to verify the order in history page using UI
  await apiUtils.addTokenToLocalStorage(loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const cartButton = page.locator("[routerlink*='myorders']");
  await expect(cartButton).toBeVisible();
  await cartButton.click();
  await page.locator("tbody").waitFor();

  // Intercepting the network request to simulate a scenario where there are no orders for the customer.
  // to intercept the network request calls, i used route.continue() method to continue the request with a different URL.
  const orderIdToIntercept = "621661f884b053f6765465b6"; // Replace with the actual order ID you want to intercept
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) =>
      route.continue({
        url:
          "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=" +
          orderIdToIntercept,
      }),
  );

  await page.locator("button:has-text('View')").first().click();
  await page.locator(".blink_me").waitFor();
  const textOfBlinkMe: any = await page.locator(".blink_me").textContent();
  expect(textOfBlinkMe.trim()).toContain(
    "You are not authorize to view this order",
  );

  const currentUrl = page.url();
  // Assert that the current URL does not contain the intercepted order ID
  expect(currentUrl).not.toContain(orderIdToIntercept);
});

test("Security test request intercept with aborting it", async ({ page }) => {
  // Give the current test's page to APIUtils
  apiUtils.page = page;

  // // Log all requests and responses for debugging purposes
  // page.on('request', request => console.log('Request:', request.url()));
  // page.on('response', response => console.log('Response:', response.url(), response.status()));

  await apiUtils.getLogs(logStream);

  // Create order using API
  orderId = await apiUtils.createOrder(orderPayload, loginToken);

  // Now we are going to verify the order in history page using UI
  await apiUtils.addTokenToLocalStorage(loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const cartButton = page.locator("[routerlink*='myorders']");
  await expect(cartButton).toBeVisible();
  await cartButton.click();
  await page.locator("tbody").waitFor();
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) => route.abort(),
  ); // Aborting the request to simulate a failure scenario
  await page.locator("button:has-text('View')").first().click();
  await page.locator(".blink_me").waitFor();
  const textOfBlinkMe: any = await page.locator(".blink_me").textContent();
  expect(textOfBlinkMe.trim()).toContain(
    "You are not authorize to view this order",
  );
});
