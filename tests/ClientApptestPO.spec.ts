import { test, expect } from "@playwright/test";
import { customTest } from "../utils/test-base";
import { POManager } from "../pageobjects/POManager";
// JSON -> String -> js object
import dataset from "../utils/placeorderTestData.json";
import parmeterizedataset from "../utils/parameterizePlaceOrderTestData.json";
import { CheckOutPage } from "../pageobjects/CheckOutPage";
import { CartPage } from "../pageobjects/CartPage";
import { DashBoardPage } from "../pageobjects/DashBoardPage";
import { LoginPage } from "../pageobjects/LoginPage";
import { ConfirmationPage } from "../pageobjects/ConfirmationPage";

test("@Web Verify end-to-end product purchase and order confirmation using Page Object Model", async ({
  page,
}) => {
  const poManager = new POManager(page, expect);
  // Logging in to the page
  const loginPage: LoginPage = poManager.getLoginPage();
  await loginPage.goToUrl("https://rahulshettyacademy.com/client/");
  await loginPage.validLogin(dataset.username, dataset.password);

  // DashBoard Page
  const dashBoardPage: DashBoardPage = poManager.getDashBoardPage();
  await dashBoardPage.searchProductAddCart(dataset.productName);
  await dashBoardPage.verifyProductAddedToCartAlert();
  await dashBoardPage.navigateToCart();

  // CartPage
  const cartPage: CartPage = poManager.getCartPage();
  await cartPage.searchProductInCartPage(dataset.productName);
  await cartPage.clickingToCheckout();

  // Checkout page
  const checkOut: CheckOutPage = poManager.getCheckOutPage();
  await checkOut.placeOrder(
    dataset.cvvData,
    dataset.fullName,
    dataset.couponCode,
    dataset.partialCountryName,
    dataset.fullCountryName,
  );

  // next confirmation page
  const confirmationPage = poManager.getConfirmationPage();
  await confirmationPage.verifyOrderConfirmationMessage();
  const actualOrderId: any =
    await confirmationPage.getOrderIdFromConfirmationPage();
  const expectdOrderId: any =
    await confirmationPage.getOrderIdFromOrderDetailsPage();
  confirmationPage.verifyOrderIdsMatch(actualOrderId, expectdOrderId);
});

for (const data of parmeterizedataset) {
  test(`@Web Verify end-to-end product purchase for ${data.productName} using POM`, async ({
    page,
  }) => {
    const poManager: POManager = new POManager(page, expect);
    // Logging in to the page
    const loginPage: LoginPage = poManager.getLoginPage();
    await loginPage.goToUrl("https://rahulshettyacademy.com/client/");
    await loginPage.validLogin(dataset.username, dataset.password);

    // DashBoard Page
    const dashBoardPage: DashBoardPage = poManager.getDashBoardPage();
    await dashBoardPage.searchProductAddCart(data.productName);
    await dashBoardPage.verifyProductAddedToCartAlert();
    await dashBoardPage.navigateToCart();

    // CartPage
    const cartPage: CartPage = poManager.getCartPage();
    await cartPage.searchProductInCartPage(data.productName);
    await cartPage.clickingToCheckout();

    // Checkout page
    const checkOut: CheckOutPage = poManager.getCheckOutPage();
    await checkOut.placeOrder(
      data.cvvData,
      data.fullName,
      data.couponCode,
      data.partialCountryName,
      data.fullCountryName,
    );

    // next confirmation page
    const confirmationPage: ConfirmationPage = poManager.getConfirmationPage();
    await confirmationPage.verifyOrderConfirmationMessage();
    const actualOrderId: any =
      await confirmationPage.getOrderIdFromConfirmationPage();
    const expectdOrderId: any =
      await confirmationPage.getOrderIdFromOrderDetailsPage();
    confirmationPage.verifyOrderIdsMatch(actualOrderId, expectdOrderId);
  });
}

customTest(
  "@Web Verify product purchase with parameterized test data and fixtures",
  async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page, expect);
    // Logging in to the page
    const loginPage = poManager.getLoginPage();
    await loginPage.goToUrl("https://rahulshettyacademy.com/client/");
    await loginPage.validLogin(
      testDataForOrder.username,
      testDataForOrder.password,
    );

    // DashBoard Page
    const dashBoardPage = poManager.getDashBoardPage();
    await dashBoardPage.searchProductAddCart(testDataForOrder.productName);
    await dashBoardPage.verifyProductAddedToCartAlert();
    await dashBoardPage.navigateToCart();

    // CartPage
    const cartPage = poManager.getCartPage();
    await cartPage.searchProductInCartPage(testDataForOrder.productName);
    await cartPage.clickingToCheckout();

    // Checkout page
    const checkOut = poManager.getCheckOutPage();
    await checkOut.placeOrder(
      testDataForOrder.cvvData,
      testDataForOrder.fullName,
      testDataForOrder.couponCode,
      testDataForOrder.partialCountryName,
      testDataForOrder.fullCountryName,
    );

    // next confirmation page
    const confirmationPage = poManager.getConfirmationPage();
    await confirmationPage.verifyOrderConfirmationMessage();
    const actualOrderId =
      await confirmationPage.getOrderIdFromConfirmationPage();
    const expectdOrderId =
      await confirmationPage.getOrderIdFromOrderDetailsPage();
    confirmationPage.verifyOrderIdsMatch(actualOrderId, expectdOrderId);
  },
);
