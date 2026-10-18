import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL = "https://api.eventhub.rahulshettyacademy.com/api";

const YAHOO_USER = {
  email: "ak@yahoo.com",
  password: "Learning@830$3mK2",
};

const GMAIL_USER = {
  email: "ak@gmail.com",
  password: "Learning@830$3mK2",
};

async function loginAs(page: Page, user: any) {
  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");

  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(user.password);

  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes("/login")),
    page.locator("#login-btn").click(),
  ]);

  await page.goto(`${BASE_URL}/events`);
}

test("@API User cannot access another user booking", async ({
  request,
  page,
}) => {
  // --------------------------------------------------
  // Step 1: Login as Yahoo user via API
  // --------------------------------------------------

  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password,
    },
  });

  console.log("Status:", loginRes.status());
  console.log("Response:", await loginRes.text());

  expect(loginRes.ok()).toBeTruthy();

  const loginBody: any = await loginRes.json();
  expect(loginBody.success).toBeTruthy();

  const token = loginBody.token;
  expect(token).toBeTruthy();

  // --------------------------------------------------
  // Step 2: Fetch events via API
  // --------------------------------------------------

  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(eventsRes.ok()).toBeTruthy();

  const eventsBody = await eventsRes.json();

  const eventId = eventsBody.data[0].id;

  expect(eventId).toBeTruthy();

  // --------------------------------------------------
  // Step 3: Create booking as Yahoo user via API
  // --------------------------------------------------

  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      eventId: eventId,
      customerName: "Yahoo User",
      customerEmail: YAHOO_USER.email,
      customerPhone: "9876543210",
      quantity: 1,
    },
  });

  expect(bookingRes.ok()).toBeTruthy();

  const bookingBody = await bookingRes.json();

  const yahooBookingId = bookingBody.data.id;
  expect(yahooBookingId).toBeTruthy();

  // --------------------------------------------------
  // Step 4: Login as Gmail user via browser
  // --------------------------------------------------

  await loginAs(page, GMAIL_USER);

  // --------------------------------------------------
  // Step 5: Navigate to Yahoo user's booking
  // --------------------------------------------------

  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
    waitUntil: "networkidle",
  });

  // --------------------------------------------------
  // Step 6: Validate Access Denied
  // --------------------------------------------------

  await expect(page.getByText("Access Denied")).toBeVisible();

  await expect(
    page.getByText("You are not authorized to view this booking"),
  ).toBeVisible();
});
