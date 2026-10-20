import { Locator, Page } from "@playwright/test";

export class DashBoardPage {
  readonly page: Page;
  readonly expect: any;
  readonly products: Locator;
  readonly productText: Locator;
  readonly cartButton: Locator;
  readonly toast: Locator;
  constructor(page: Page, expect: any) {
    this.page = page;
    this.expect = expect;
    this.products = this.page.locator(".card-body");
    this.productText = this.page.locator(".card-body b");
    this.cartButton = this.page.locator("[routerlink*='cart']");
    this.toast = this.page.getByRole("alert", {
      name: "Product Added To Cart",
    });
  }

  async searchProductAddCart(productName: string) {
    await this.productText.first().waitFor();
    const productCount = await this.products.count();
    for (let i = 0; i < productCount; ++i) {
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }

  async verifyProductAddedToCartAlert() {
    await this.expect(this.toast).toHaveText("Product Added To Cart");
  }

  async navigateToCart() {
    await this.cartButton.click();
  }
}
