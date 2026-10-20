import { test, expect, Page, Locator } from '@playwright/test';

const BASE_URL: string = 'https://eventhub.rahulshettyacademy.com';

const USERNAME: string = 'ak@email.com';

const PASSWORD: string = 'Learning@830$3mK2';

const SIX_EVENTS_RESPONSE: {
  data: {
    id: number;
    title: string;
    category: string;
    eventDate: string;
    venue: string;
    city: string;
    price: string;
    totalSeats: number;
    availableSeats: number;
    imageUrl: any;
    isStatic: boolean;
  }[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
} = {
  data: [
    {
      id: 1,
      title: "Tech Summit 2025",
      category: "Conference",
      eventDate: "2025-06-01T10:00:00.000Z",
      venue: "HICC",
      city: "Hyderabad",
      price: "999",
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 2,
      title: "Rock Night Live",
      category: "Concert",
      eventDate: "2025-06-05T18:00:00.000Z",
      venue: "Palace Grounds",
      city: "Bangalore",
      price: "1500",
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 3,
      title: "IPL Finals",
      category: "Sports",
      eventDate: "2025-06-10T19:30:00.000Z",
      venue: "Chinnaswamy",
      city: "Bangalore",
      price: "2000",
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 4,
      title: "UX Design Workshop",
      category: "Workshop",
      eventDate: "2025-06-15T09:00:00.000Z",
      venue: "WeWork",
      city: "Mumbai",
      price: "500",
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 5,
      title: "Lollapalooza India",
      category: "Festival",
      eventDate: "2025-06-20T12:00:00.000Z",
      venue: "Mahalaxmi Racecourse",
      city: "Mumbai",
      price: "3000",
      totalSeats: 5000,
      availableSeats: 2000,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 6,
      title: "AI & ML Expo",
      category: "Conference",
      eventDate: "2025-06-25T10:00:00.000Z",
      venue: "Bangalore International Exhibition Centre",
      city: "Bangalore",
      price: "750",
      totalSeats: 300,
      availableSeats: 180,
      imageUrl: null,
      isStatic: false,
    },
  ],

  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE: {
  data: {
    id: number;
    title: string;
    category: string;
    eventDate: string;
    venue: string;
    city: string;
    price: string;
    totalSeats: number;
    availableSeats: number;
    imageUrl: any;
    isStatic: boolean;
  }[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
} = {
  data: [
    {
      id: 1,
      title: "Tech Summit 2025",
      category: "Conference",
      eventDate: "2025-06-01T10:00:00.000Z",
      venue: "HICC",
      city: "Hyderabad",
      price: "999",
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 2,
      title: "Rock Night Live",
      category: "Concert",
      eventDate: "2025-06-05T18:00:00.000Z",
      venue: "Palace Grounds",
      city: "Bangalore",
      price: "1500",
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 3,
      title: "IPL Finals",
      category: "Sports",
      eventDate: "2025-06-10T19:30:00.000Z",
      venue: "Chinnaswamy",
      city: "Bangalore",
      price: "2000",
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false,
    },

    {
      id: 4,
      title: "UX Design Workshop",
      category: "Workshop",
      eventDate: "2025-06-15T09:00:00.000Z",
      venue: "WeWork",
      city: "Mumbai",
      price: "500",
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false,
    },
  ],

  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

// Helper

async function loginAndGoToEvents(page: Page) {

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.locator("#email").fill(USERNAME);
    await page.locator("#password").fill(PASSWORD);
    await Promise.all([
        page.waitForURL(url => !url.pathname.includes('/login')),
        page.locator("#login-btn").click()
    ]);
    await page.goto(`${BASE_URL}/events`);

}

// Test 1

test('Verify sandbox banner is visible when more than 5 events are returned', async ({ page }) => {

    // Step 1: Mock API BEFORE navigating to Events

    await page.route('**/api/events**', async route => {

        await route.fulfill({

            status: 200,

            contentType: 'application/json',

            body: JSON.stringify(SIX_EVENTS_RESPONSE),

        });

    });

    // Step 2: Login and navigate to Events

    await loginAndGoToEvents(page);

    // Step 3: Verify 6 event cards loaded

    const eventCards: Locator = page.getByTestId('event-card');
    await page.waitForLoadState('networkidle');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(6);
    // Step 4: Verify sandbox banner
    const sandboxBanner: Locator = page.getByText(/sandbox holds up to/i);
    await expect(sandboxBanner).toBeVisible();
    await expect(sandboxBanner).toContainText('9 bookings');

});

// Test 2

test('Verify sandbox banner is hidden when 4 events are returned', async ({ page }) => {

    // Step 1: Mock API BEFORE navigating to Events

    await page.route('**/api/events**', async route => {

        await route.fulfill({

            status: 200,

            contentType: 'application/json',

            body: JSON.stringify(FOUR_EVENTS_RESPONSE),

        });

    });

    // Step 2: Login and navigate to Events

    await loginAndGoToEvents(page);

    // Step 3: Verify 4 event cards loaded

    const eventCards: Locator = page.getByTestId('event-card');
    await page.waitForLoadState('networkidle');
    await expect(eventCards.first()).toBeVisible();

    await expect(eventCards).toHaveCount(4);

    // Step 4: Verify sandbox banner is NOT visible

    const sandboxBanner: Locator = page.getByText(/sandbox holds up to/i);

    await expect(sandboxBanner).not.toBeVisible();

});