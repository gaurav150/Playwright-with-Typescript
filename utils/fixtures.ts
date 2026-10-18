import { test as base, expect, type Page } from "@playwright/test";
import getFutureDate from "../utils/dateUtils";

const USERNAME = "ak@email.com";
const PASSWORD = "Learning@830$3mK2";


const futureEventDate = getFutureDate(30);

type EventData = {
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
};

type MyFixtures = {
  authenticatedPage: Page;
  createEvent: EventData;
};

export const customTest = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("https://eventhub.rahulshettyacademy.com/login");

    await page.locator("#email").fill(USERNAME);
    await page.locator("#password").fill(PASSWORD);

    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes("/login")),
      page.locator("#login-btn").click(),
    ]);

    await page.locator("#event-card").first().waitFor();
    await use(page);
  },

  createEvent: async ({ request }, use) => {
    const loginResponse = await request.post(
      "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
      {
        data: { email: USERNAME, password: PASSWORD },
      },
    );

    expect(loginResponse.ok()).toBeTruthy();

    const loginData: { token: string } = await loginResponse.json();

    const payload: EventData = {
      title: "Office Party",
      description: "Event created through Playwright API fixture",
      category: "Conference",
      venue: "Social Jp Nagar",
      city: "bangalore",
      eventDate: futureEventDate,
      price: 0.01,
      totalSeats: 100,
    };

    const response = await request.post(
      "https://api.eventhub.rahulshettyacademy.com/api/events",
      {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
        data: payload,
      },
    );

    expect(response.ok()).toBeTruthy();

    const responseData: { data: EventData } = await response.json();
    await use(responseData.data);
  },
});

export { expect };
