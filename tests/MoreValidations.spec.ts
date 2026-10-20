import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' }); // means run all tests of this  file in parallel
// there are three modes are available parallel, serial, default
test('Popup validations', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("https://google.com/");
    // await page.goBack();
    // await page.goForward();
    // await page.reload();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const dropDown = page.locator(".mouse-hover-content");
    await expect(dropDown).toBeVisible();
    const options = await dropDown.locator("a").all();
    for (const option of options) {
        const text:any = await option.textContent();
        if (text.trim() === "Top") {
            await option.click();
            break;
        }
    }
    await expect(dropDown).toBeHidden();
    await page.locator("#mousehover").hover();
    const options2 = await dropDown.locator("a").all();
    for (const option of options2) {
        const text:any = await option.textContent();
        if (text.trim() === "Reload") {
            await option.click();
            break;
        }
    }
});

test("IFrames Validations", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    await framesPage.locator(".text h2").waitFor();
    const text:any = await framesPage.locator(".text h2").textContent();
    console.log(text);
    const numberOfSubscribers = text.split(" ")[1].trim();
    console.log(numberOfSubscribers);
    console.log(typeof numberOfSubscribers);
    const numberOfSubscribersInt = parseInt(numberOfSubscribers.replace(/,/g, ''));
    console.log(numberOfSubscribersInt);
    console.log(typeof numberOfSubscribersInt);
});

test("Screenshot Validations & Visual comparisons", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await page.screenshot({ path: "hide-textbox.png" });
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();

    // Take a screenshot of the element and save it to a file
    await page.locator("#displayed-text").screenshot({ path: "displayed-text.png" });
});

test.skip("Visual Comparisons", async ({ page }) => { 
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#opentab").waitFor();
    expect(await page.screenshot()).toMatchSnapshot("AutomationPractice.png");

    // for this test cases i used the below command to update the snapshot
    // npx playwright test tests/MoreValidations.spec.js --update-snapshots
});