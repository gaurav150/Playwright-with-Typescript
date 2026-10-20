import { test, expect } from '@playwright/test';


test('PlayWright Special Locators', async({page}) => {


    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await expect(page.getByLabel("Check me out if you Love IceCreams!")).toBeChecked();
    await page.getByLabel("Check me out if you Love IceCreams!").uncheck();
    await expect(page.getByLabel("Check me out if you Love IceCreams!")).not.toBeChecked();

    await page.getByLabel("Employed").check();
    await expect(page.getByLabel("Employed")).toBeChecked();

    await page.getByLabel("Gender").selectOption("Male");
    await page.getByPlaceholder("Password").fill("Learning@830$3mK2");
    await page.getByRole("button", { name: "Submit" }).click();

    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // default timeout for expect is 5 seconds, we can override it by passing timeout in options
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10_000});

    await page.getByRole("link", { name: "Shop" }).click();

    await page.locator("app-card").first().waitFor();
    await page.locator("app-card").filter({ hasText: "Blackberry" }).getByRole("button", { name: "Add " }).click();
    // await expect(page.locator("app-card").filter({ hasText: "Blackberry" }).getByRole("button", { name: "Add to Cart" })).toBeVisible();

    await page.locator(".nav-link.btn").click();
    // await page.getByRole('link', { name: /Checkout/ }).click();
});

test('PlayWright testLevel timeout testing', async({page}) => {

    test.setTimeout(70*1000); // test level timeout for this test case, default timeout for test is 30 seconds, we can override it by passing timeout in options on test level
    
    // default timeout for expect is 5 seconds, we can override it by passing timeout in options on test level
    const slowExpect : any=  expect.configure({timeout: 9000});

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await slowExpect(page.getByLabel("Check me out if you Love IceCreams!")).toBeChecked();
    await page.getByLabel("Check me out if you Love IceCreams!").uncheck();
    await slowExpect(page.getByLabel("Check me out if you Love IceCreams!")).not.toBeChecked();

    await page.getByLabel("Employed").check();
    await slowExpect(page.getByLabel("Employed")).toBeChecked();

    await page.getByLabel("Gender").selectOption("Male");
    await page.getByPlaceholder("Password").fill("Learning@830$3mK2");
    await page.getByRole("button", { name: "Submit" }).click();

    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // default timeout for expect is 5 seconds, we can override it by passing timeout in options
    await slowExpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();

    await page.getByRole("link", { name: "Shop" }).click();
    await slowExpect(page.locator("h1.my-4")).toHaveText("Shop Name");

    await page.locator("app-card").first().waitFor();
    await page.locator("app-card").filter({ hasText: "Blackberry" }).getByRole("button", { name: "Add " }).click();
    // await expect(page.locator("app-card").filter({ hasText: "Blackberry" }).getByRole("button", { name: "Add to Cart" })).toBeVisible();

    await page.locator(".nav-link.btn").click();
    // await page.getByRole('link', { name: /Checkout/ }).click();
});