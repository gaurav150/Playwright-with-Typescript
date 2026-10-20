import { Expect, Locator, Page } from "@playwright/test";

export class CheckOutPage {
  readonly page: Page;
  readonly expect: Expect;
  readonly cvv: Locator;
  readonly nameCard: Locator;
  readonly applyCoupon: Locator;
  readonly countryNameLocator: Locator;
  readonly dropDown: Locator;
  readonly couponSuccess: Locator;
  readonly submitCouponCode: Locator;
  readonly countryButton: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page, expect: Expect) {
    this.page = page;
    this.expect = expect;
    this.cvv = this.page.locator(".field.small").filter({ hasText: "CVV Code" })
      .getByRole("textbox");
    this.nameCard = this.page.getByText("Name on Card").locator("..")
      .getByRole("textbox");
    this.applyCoupon = this.page.locator('input[name="coupon"]');
    this.countryNameLocator = this.page.getByRole("textbox", {
      name: "Select Country",
    });
    this.dropDown = this.page.locator(".ta-results");
    this.couponSuccess = this.page.locator(".field.small p");
    this.submitCouponCode = this.page.locator("button[type='submit']");
    this.countryButton = this.dropDown.locator("button");
    this.placeOrderButton = page.locator(".actions a");
  }

  async placeOrder(
    cvvData:any,
    userName:string,
    couponCode:string,
    partialCountryName:string,
    countryName:string,
  ) {
    await this.cvv.waitFor();
    await this.cvv.fill(cvvData);
    await this.nameCard.fill(userName);
    await this.applyCoupon.fill(couponCode);
    await this.submitCouponCode.click();
    await this.expect(this.couponSuccess).toHaveText("* Coupon Applied");
    await this.countryNameLocator.pressSequentially(partialCountryName, {
      delay: 300,
    });
    await this.dropDown.waitFor();

    const countryOption = this.dropDown
      .locator("button.ta-item")
      .filter({ hasText: new RegExp(`^\\s*${countryName}\\s*$`) });

    await countryOption.click();
    await this.expect(this.dropDown).toBeHidden();
    await this.placeOrderButton.click();
  }
}