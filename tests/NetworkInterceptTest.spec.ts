import { test, expect, request, APIResponse } from "@playwright/test";
import { APIUtils } from "../utils/APIUtils";
const loginPayload: { userEmail: string; userPassword: string } = {
  userEmail: "sky@ymail.com",
  userPassword: "Learning@830$3mK2",
};
const orderPayload: {
  orders: { country: string; productOrderedId: string }[];
} = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};
const fakePayLoadOrders: {
  data: any[];
  message: string;
} = { data: [], message: "No Orders" };
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

test("Verify UI displays no orders when order history API response is intercepted", async ({
  page,
}) => {
  // Give the current test's page to APIUtils
  apiUtils.page = page;

  // Create order using API
  orderId = await apiUtils.createOrder(orderPayload, loginToken);
  console.log("Order ID:", orderId);

  // Now we are going to verify the order in history page using UI
  await apiUtils.addTokenToLocalStorage(loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const cartButton = page.locator("[routerlink*='myorders']");
  await expect(cartButton).toBeVisible();
  page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      const response: APIResponse<any> = await page.request.fetch(
        route.request(),
      );
      let body: string = JSON.stringify(fakePayLoadOrders);
      await route.fulfill({ response, body });
    },
  );
  // intercepting the network request to simulate a scenario where there are no orders for the customer.
  // intercepting response -> Api Response -> {playWright fakeResponse } -> browser -> UI
  await cartButton.click();
  // await page.waitForResponse means that the test will wait for the network response from the specified URL before proceeding.
  // This is important because it ensures that the page has received the necessary data (in this case, the order history)
  // before the test continues to check for elements on the page. Without this wait, the test might try to interact with elements that haven't been rendered yet, leading to failures.
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
  );
  await page.locator(".mt-4").waitFor();
  const noOrdersText: any = await page.locator(".mt-4").textContent();
  console.log("No Orders Text:", noOrdersText);
  expect(noOrdersText.trim()).toContain(
    "You have No Orders to show at this time.",
  );
});
