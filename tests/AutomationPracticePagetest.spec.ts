import { test, expect, type Locator, type Page } from "@playwright/test";
import testData from "../utils/green-kart-testData.json";

test(
  "@AutomationPractice @Regression Verify Web Table Fixed Header Amount",
  
  async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    const rows: Locator = page.locator(".tableFixHead tbody tr");
    await expect(rows.first()).toBeVisible();

    const rowCount: number = await rows.count();
    let total = 0;

    for (let i = 0; i < rowCount; i++) {
      const amount: any = await rows.nth(i).locator("td").last().textContent();
      const value = Number(amount.trim());
      total += value;
    }

    const totalAmount: Locator = page.locator(".totalAmount");
    await expect(totalAmount).toContainText("296");
  },
);

test("@seleniumPractice @Regression Verify Selenium Practice Page Price ", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/seleniumPractise/");
  const order: any = testData.Order;
  let grandTotal: number = 0;

  const products: Locator = page.locator(".products .product");
  await products.first().waitFor();
  const productCount: number = await products.count();

  for (let i = 0; i < productCount; i++) {
    const productLocator: any = products.nth(i);
    const text: any = (await productLocator.locator("h4").textContent()).trim();
    const price = Number(
      (await productLocator.locator("p").textContent()).replace(/[^\d.]/g, ""),
    );

    const orderItem: any = order.find((item: any) =>
      text.startsWith(item.orderProduct),
    );
    if (orderItem) {
      const increment: Locator = productLocator.locator(
        ".stepper-input .increment",
      );
      // Default quantity is 1, so click count - 1 times.
      for (let b: number = 1; b < orderItem.count; b++) {
        await increment.click();
      }
      await productLocator.getByRole("button", { name: "ADD TO CART" }).click();
      grandTotal += price * orderItem.count;
    }
  }

  const numberOfItems: number = Number(
    await page.locator(".cart-info strong").first().textContent(),
  );
  const TotalPrice: number = Number(
    await page.locator(".cart-info strong").last().textContent(),
  );

  expect(grandTotal).toEqual(TotalPrice);
  expect(order.length).toEqual(numberOfItems);
});

test.skip("@seleniumPractice @Regression Verify Selenium Practice Page Price Top Deals", async ({
  page,
  context,
}) => {
  await page.goto("https://rahulshettyacademy.com/seleniumPractise/");
  const products: any = page.locator(".products .product");
  await products.first().waitFor();
  const productName: any[] = [];

  // Wait for the new tab while clicking the link
  const newPagePromise: Promise<Page> = context.waitForEvent("page");

  await page.locator(".cart-header-navlink[href*='offers']").click();

  const newPage: any = await newPagePromise;
  // Wait for the new tab to load
  await newPage.waitForLoadState();
  await newPage.locator(".date-field-container label").waitFor();
  await newPage.getByLabel("Page size:").selectOption("20");

  await newPage.locator("button[class*='calendar-button']").click();
  const titleOfCalendar: any = newPage.locator("button[class*='label']");
  await titleOfCalendar.waitFor();
  await titleOfCalendar.click();
  const year: number = Number(
    await titleOfCalendar.locator("span").textContent(),
  );
  const requiredYear: number = 2030;
  const requiredMonth: string = "August";
  const requiredDate: string = "30";
  const diff: number = requiredYear - year;
  if (diff > 0) {
    for (let i: number = 0; i < diff; i++) {
      await newPage.locator("button[class*='next-button']").click();
    }
  } else if (diff < 0) {
    for (let i: number = 0; i < Math.abs(diff); i++) {
      await newPage.locator("button[class*='prev-button']").click();
    }
  }

  await newPage
    .locator("div[class*='months'] button")
    .filter({ hasText: requiredMonth })
    .click();

  // const date = await newPage.locator("div[class*='days'] button").allTextContents();

  await newPage
    .locator(
      ".react-calendar__month-view__days__day:not(.react-calendar__month-view__days__day--neighboringMonth)",
    )
    .filter({ hasText: new RegExp(`^${requiredDate}$`) })
    .click();

  const deliveryYear: any = await newPage
    .locator("input[name='year']")
    .inputValue();
  expect(deliveryYear).toEqual(String(requiredYear));
});


test("@seleniumPractice @Regression Verify Selenium Practice Page To Flight Booking Page", async ({
  page,
  context,
}) => {
  await page.goto("https://rahulshettyacademy.com/seleniumPractise/");
  const products: any = page.locator(".products .product");
  await products.first().waitFor();

  // Wait for the new tab while clicking the link. const newPagePromise: Promise<Page>
  const newPagePromise: Promise<Page> = context.waitForEvent("page");

  await page.locator(".cart-header-navlink[href*='dropdownsPractise']").click();

  const newPage: Page = await newPagePromise;
  // Wait for the new tab to load
  await newPage.waitForLoadState();
  await newPage.locator(".book_flight").waitFor();
});
