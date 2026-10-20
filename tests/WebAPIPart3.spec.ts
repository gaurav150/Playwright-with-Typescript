

// in lecture it is mentioned as WebAPIPart2.spec.js but i am writing. as  this file WebAPIPart3.spec.js


// Login once UI. -> .json file
// test browser -> .json , cart-order, orderDetails

import { test, expect, request, BrowserContext, Page, Locator } from '@playwright/test';
let webContext: any;

test.beforeAll(async ({browser}) => {

    const context: BrowserContext = await browser.newContext();
    const page : Page= await context.newPage();
    const userEmail: Locator = page.locator("#userEmail");
    const userPassword: Locator = page.locator("#userPassword");
    const loginButton: Locator = page.locator("#login");
    const productTitle: Locator = page.locator(".card-body h5");
    

    await page.goto("https://rahulshettyacademy.com/client/");
    await userEmail.fill("sky@ymail.com");
    await userPassword.fill("Learning@830$3mK2");
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await expect(productTitle.first()).toBeVisible();
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
});


test('Client App Login with Existing Session Storage', async() => {

    const page : any = await webContext.newPage();
    const productTitle: Locator = page.locator(".card-body b");
    const products : Locator = page.locator(".card-body");
    const productName: string = "ZARA COAT 3";
    const checkoutButton : Locator= page.locator("li[class='totalRow'] button[type='button']");
    
    await page.goto("https://rahulshettyacademy.com/client/");
    await expect(productTitle.first()).toBeVisible();
    // await expect(productTitle.first()).toHaveText("ADIDAS ORIGINAL");

    // ZARA COAT 3
    const productCount: number  = await products.count();
    for(let i=0; i<productCount; ++i){
        if(await products.nth(i).locator("b").textContent() === productName){
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    const toast: Locator = page.getByRole('alert', {name: 'Product Added To Cart'});

    await expect(toast).toHaveText('Product Added To Cart');
    
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const cartProducts: Locator = page.locator("h3");
    const cartCount: number = await cartProducts.count();
    let match: boolean = false;
    for(let i: number=0; i<cartCount; ++i){
        if(await cartProducts.nth(i).textContent() === productName){
            match = true;
            break;
        }
    }
    expect(match).toBeTruthy();
    
    await checkoutButton.click();
    const cvv: Locator = page.locator('.field.small').filter({ hasText: 'CVV Code' }).getByRole('textbox');
    const nameCard: Locator = page.getByText('Name on Card').locator('..').getByRole('textbox');
    const applyCoupon: Locator = page.locator('input[name="coupon"]');
    const countryName: Locator = page.getByRole('textbox', { name: 'Select Country' });
    const dropDown: Locator = page.locator('.ta-results');
    await cvv.fill("123");
    await nameCard.fill("Shivank Kumar");
    await applyCoupon.fill("rahulshettyacademy");
    const couponSuccess = page.locator(".field.small p");
    await page.locator("button[type='submit']").click();
    await expect(couponSuccess).toHaveText("* Coupon Applied");
    await countryName.pressSequentially("ind", { delay: 300 });
    await dropDown.waitFor();
    const countryButton: any = dropDown.locator("button");
    for(let i=0; i<await countryButton.count(); ++i){
        const countryName = (await countryButton.nth(i).textContent()).trim();
         if (countryName === 'India') {
        await countryButton.nth(i).click();
        break;
        }
    }

    await expect(dropDown).toBeHidden();
    const placeOrderButton: Locator = page.locator(".actions a");
    await placeOrderButton.click();
    // next confirmation page
    const confirmationMessage: Locator = page.locator(".hero-primary");
    await expect(confirmationMessage).toHaveText(" Thankyou for the order. ");
    const orderIdLocator: Locator = page.locator(".em-spacer-1 .ng-star-inserted");
    const orderIdText: any = await orderIdLocator.textContent();

    const orderId = orderIdText
    .replace(/\|/g, '')
    .trim();

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderRows: Locator = page.locator("tbody tr");
    const orderCount: number = await orderRows.count();
    for(let i=0; i<orderCount; ++i){
        const rowOrderId : any= await orderRows.nth(i).locator("th").textContent();
        if(rowOrderId === orderId){
            await orderRows.nth(i).locator("button.btn-primary").click();
            break;
        }
    }
    const orderDetailsIdLocator: Locator = page.locator(".col-text");
    const orderDetailsIdText: any = await orderDetailsIdLocator.textContent();
    const orderDetailsId = orderDetailsIdText
    .replace(/\|/g, '')
    .trim();
    expect(orderId).toEqual(orderDetailsId);
    

});
