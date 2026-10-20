import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly userEmail: Locator;
  readonly userPassword: Locator;
  readonly loginButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.userEmail = page.locator("#userEmail");
    this.userPassword = page.locator("#userPassword");
    this.loginButton = page.locator("#login");
  }

  async goToUrl(url: string) {
    await this.page.goto(url);
  }

  async validLogin(userEmail: string, userPassword: string) {
    await this.userEmail.fill(userEmail);
    await this.userPassword.fill(userPassword);
    await this.loginButton.click();
    await this.page.waitForLoadState("networkidle");
  }
}
