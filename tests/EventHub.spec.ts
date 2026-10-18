import { customTest, expect } from '../utils/fixtures';

customTest('@Event Verify created event is visible', async ({ authenticatedPage, createEvent }) => {

    await authenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');

    await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
});