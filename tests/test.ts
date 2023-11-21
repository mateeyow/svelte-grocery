import { expect, test } from '@playwright/test';

test('index page has expected input', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByPlaceholder('Please enter your grocery item')).toBeVisible();
});
