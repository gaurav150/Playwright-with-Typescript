import { LoginPage } from "./LoginPage";
import { DashBoardPage } from "./DashBoardPage";
import { CartPage } from "./CartPage";
import { CheckOutPage } from "./CheckOutPage";
import { ConfirmationPage } from "./ConfirmationPage";
import { Expect, Page } from "@playwright/test";

export class POManager {
  readonly page: Page;
  readonly expect: Expect;
  readonly loginPage: LoginPage;
  readonly dashBoardPage: DashBoardPage;
  readonly cartPage: CartPage;
  readonly checkOutPage: CheckOutPage;
  readonly confirmationPage: ConfirmationPage;
  constructor(page: Page, expect: Expect) {
    this.page = page;
    this.expect = expect;

    this.loginPage = new LoginPage(this.page);
    this.dashBoardPage = new DashBoardPage(this.page, this.expect);
    this.cartPage = new CartPage(this.page, this.expect);
    this.checkOutPage = new CheckOutPage(this.page, this.expect);
    this.confirmationPage = new ConfirmationPage(this.page, this.expect);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getDashBoardPage() {
    return this.dashBoardPage;
  }

  getCartPage() {
    return this.cartPage;
  }

  getCheckOutPage() {
    return this.checkOutPage;
  }

  getConfirmationPage() {
    return this.confirmationPage;
  }
}
