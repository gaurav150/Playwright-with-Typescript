import { expect } from '@playwright/test';
import { customTest } from "../utils/fixturesOld";


customTest("@Fixture @Regrssion Fixture test", async ({ authenticatedPage, createOrder }) => {

    await authenticatedPage.goto("https://rahulshettyacademy.com/client/");
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
});

