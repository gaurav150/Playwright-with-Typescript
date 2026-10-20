import { test as base } from "@playwright/test";

type OrderTestData = {
  username: string;
  password: string;
  productName: string;
  cvvData: string;
  fullName: string;
  couponCode: string;
  partialCountryName: string;
  fullCountryName: string;
};

type MyFixtures = {
  testDataForOrder: OrderTestData;
};

export const customTest = base.extend<MyFixtures>({
  testDataForOrder: {
    username: "sky@ymail.com",
    password: "Learning@830$3mK2",
    productName: "ZARA COAT 3",
    cvvData: "123",
    fullName: "Shivank Kumar",
    couponCode: "rahulshettyacademy",
    partialCountryName: "ind",
    fullCountryName: "India",
  },
});
