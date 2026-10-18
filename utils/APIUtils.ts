import { expect, Page } from "@playwright/test";

export class APIUtils {
  readonly page: Page;
  readonly apiContext: any;
  readonly loginPayload: any;
  constructor(apiContext: any, page: any, loginPayload: any) {
    this.apiContext = apiContext;
    this.page = page;
    this.loginPayload = loginPayload;
  }

  async makeRequest(url: string, method: any, headers: any, body: any) {
    const response = await this.apiContext[method](url, {
      headers,
      data: body,
    });

    return response;
  }

  async getToken() {
    const response = await this.makeRequest(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      "post",
      {},
      this.loginPayload,
    );
    const responseBody = await response.json();
    const loginToken = responseBody.token;
    return loginToken;
  }

  async createOrder(orderPayload: any, loginToken: any) {
    const orderCreationResponse = await this.makeRequest(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      "post",
      {
        Authorization: loginToken,
        "Content-Type": "application/json",
      },
      orderPayload,
    );
    expect(orderCreationResponse.ok()).toBeTruthy();
    const orderCreationResponseBody = await orderCreationResponse.json();
    const orderId = orderCreationResponseBody.orders[0];
    return orderId;
  }

  async addTokenToLocalStorage(loginToken: any) {
    await this.page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, loginToken);
  }

  async getLogs(logStream: any) {
    this.page.on("request", (request) => {
      const logEntry = `[${new Date().toISOString()}] Request: ${request.method()} ${request.url()}\n`;
      logStream.write(logEntry);
    });

    this.page.on("response", async (response) => {
      const logEntry = `[${new Date().toISOString()}] Response: ${response.status()} ${response.url()}\n`;
      logStream.write(logEntry);
    });
  }
}
