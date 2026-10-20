import { Expect, Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly expect: Expect;
  readonly listOfOrders: Locator;
  readonly cartProducts: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;
  constructor(page: Page, expect: Expect) {
    this.page = page;
    this.expect = expect;
    this.listOfOrders = page.locator("div li");
    this.cartProducts = page.locator("h3");
    this.checkoutButton = page.locator(
      "li[class='totalRow'] button[type='button']",
    );
    this.continueShopping = page.locator(
      ".heading button[routerlink*='dashboard']",
    );
  }

  async searchProductInCartPage(productName:string) {
    await this.continueShopping.waitFor();
    await this.listOfOrders.first().waitFor();
    const cartCount = await this.cartProducts.count();
    let match = false;
    for (let i = 0; i < cartCount; ++i) {
      if ((await this.cartProducts.nth(i).textContent()) === productName) {
        match = true;
        break;
      }
    }
    await this.expect(match).toBeTruthy();
  }

  async clickingToCheckout() {
    await this.checkoutButton.click();
  }
}
