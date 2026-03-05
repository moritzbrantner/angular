import { expect, test } from '@playwright/test';

test('smoke: home page renders headline', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hello, Patty' })).toBeVisible();
  await expect(page.getByText('I love you 🎉')).toBeVisible();
});
