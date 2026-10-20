import { Expect, Locator, Page } from "@playwright/test";

export class ConfirmationPage {
  readonly page: Page;
  readonly expect: Expect;
  readonly confirmationMessage: Locator;
  readonly orderIdLocator: Locator;
  readonly orderButton: Locator;
  readonly orderRows: Locator;
  readonly orderDetailsIdLocator: Locator;

  constructor(page: Page, expect: Expect) {
    this.page = page;
    this.expect = expect;
    this.confirmationMessage = this.page.locator(".hero-primary");
    this.orderIdLocator = this.page.locator(".em-spacer-1 .ng-star-inserted");
    this.orderButton = this.page.locator("button[routerlink*='myorders']");
    this.orderRows = this.page.locator("tbody tr");
    this.orderDetailsIdLocator = this.page.locator(".col-text");
  }

  async verifyOrderConfirmationMessage() {
    await this.expect(this.confirmationMessage).toHaveText(
      " Thankyou for the order. ",
    );
  }

  async getOrderIdFromConfirmationPage() {
    const orderIdText = await this.orderIdLocator.textContent();
    if (orderIdText === null) {
      throw new Error("Order ID was not found on the confirmation page");
    }
    const orderId = orderIdText.replace(/\|/g, "").trim();
    return orderId;
  }

  async getOrderIdFromOrderDetailsPage() {
    const orderId = await this.getOrderIdFromConfirmationPage();
    await this.orderButton.click();
    await this.page.locator("tbody").waitFor();
    const orderCount = await this.orderRows.count();

    for (let i = 0; i < orderCount; ++i) {
      const rowOrderId = await this.orderRows
        .nth(i)
        .locator("th")
        .textContent();
      if (rowOrderId === orderId) {
        await this.orderRows.nth(i).locator("button.btn-primary").click();
        break;
      }
    }

    const orderDetailsIdText = await this.orderDetailsIdLocator.textContent();
    if (orderDetailsIdText === null) {
      throw new Error("Order ID was not found on the order details page");
    }
    const orderDetailsId = orderDetailsIdText.replace(/\|/g, "").trim();
    return orderDetailsId;
  }

  verifyOrderIdsMatch(actualOrderId: any, expectedOrderId: any) {
    this.expect(actualOrderId).toEqual(expectedOrderId);
  }
}
