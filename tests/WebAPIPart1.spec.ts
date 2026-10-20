import { test, expect, request, Locator } from "@playwright/test";

const loginPayload: { userEmail: string; userPassword: string } = {
  userEmail: "sky@ymail.com",
  userPassword: "Learning@830$3mK2",
};
const orderPayload: {
  orders: {
    country: string;
    productOrderedId: string;
  }[];
} = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};
let loginToken: any;
let apiContext: any;
let orderId: any;

test.beforeAll(async () => {
  apiContext = await request.newContext();

  const loginResponse: any = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload,
    },
  );
  expect(loginResponse.ok()).toBeTruthy();
  const responseBody: any = await loginResponse.json();
  loginToken = responseBody.token;
  console.log("Login Token:", loginToken);
});

test("Place the order", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const productTitle: Locator = page.locator(".card-body b");
  const products: Locator = page.locator(".card-body");
  const productName: string = "ZARA COAT 3";
  const checkoutButton: Locator = page.locator(
    "li[class='totalRow'] button[type='button']",
  );
  await productTitle.first().waitFor();
  // await expect(productTitle.first()).toHaveText("ADIDAS ORIGINAL");

  // ZARA COAT 3
  const productCount: any = await products.count();
  for (let i = 0; i < productCount; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  const toast: Locator = page.getByRole("alert", {
    name: "Product Added To Cart",
  });

  await expect(toast).toHaveText("Product Added To Cart");

  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();
  const cartProducts: Locator = page.locator("h3");
  const cartCount: any = await cartProducts.count();
  let match: boolean = false;
  for (let i = 0; i < cartCount; ++i) {
    if ((await cartProducts.nth(i).textContent()) === productName) {
      match = true;
      break;
    }
  }
  expect(match).toBeTruthy();

  await checkoutButton.click();
  const cvv: Locator = page
    .locator(".field.small")
    .filter({ hasText: "CVV Code" })
    .getByRole("textbox");
  const nameCard: Locator = page
    .getByText("Name on Card")
    .locator("..")
    .getByRole("textbox");
  const applyCoupon: Locator = page.locator('input[name="coupon"]');
  const countryName: Locator = page.getByRole("textbox", {
    name: "Select Country",
  });
  const dropDown: Locator = page.locator(".ta-results");
  await cvv.fill("123");
  await nameCard.fill("Shivank Kumar");
  await applyCoupon.fill("rahulshettyacademy");
  const couponSuccess = page.locator(".field.small p");
  await page.locator("button[type='submit']").click();
  await expect(couponSuccess).toHaveText("* Coupon Applied");
  await countryName.pressSequentially("ind", { delay: 300 });
  await dropDown.waitFor();
  const countryButton: any = dropDown.locator("button");
  for (let i = 0; i < (await countryButton.count()); ++i) {
    const countryName: string = (
      await countryButton.nth(i).textContent()
    ).trim();
    if (countryName === "India") {
      await countryButton.nth(i).click();
      break;
    }
  }

  await expect(dropDown).toBeHidden();
  const placeOrderButton: Locator = page.locator(".actions a");
  await placeOrderButton.click();
  // next confirmation page
  const confirmationMessage: Locator = page.locator(".hero-primary");
  await expect(confirmationMessage).toHaveText(" Thankyou for the order. ");
  const orderIdLocator: Locator = page.locator(
    ".em-spacer-1 .ng-star-inserted",
  );
  const orderIdText: any = await orderIdLocator.textContent();

  const orderId = orderIdText.replace(/\|/g, "").trim();

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const orderRows: Locator = page.locator("tbody tr");
  const orderCount: number = await orderRows.count();
  for (let i = 0; i < orderCount; ++i) {
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

// Verify if order created is showing in history page
// So pre condition is create order and then verify in history page
// So we can create order using API and then verify in history page using UI

test("Verify order in history page", async ({ page }) => {
  // Create order using API

  const orderCreationResponse: any = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data: orderPayload,
      headers: {
        Authorization: loginToken,
        "Content-Type": "application/json",
      },
    },
  );
  expect(orderCreationResponse.ok()).toBeTruthy();
  const orderCreationResponseBody: any = await orderCreationResponse.json();
  orderId = orderCreationResponseBody.orders[0];
  console.log("Response is " + JSON.stringify(orderCreationResponseBody));
  console.log("Order ID:", orderId);

  // Now we are going to verify the order in history page using UI
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
  const cartButton: Locator = page.locator("[routerlink*='myorders']");
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
