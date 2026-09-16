import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/en',
  '/en/login',
  '/en/examples/forms',
  '/en/table',
  '/en/report-problem',
  '/de',
] as const;

async function expectNoWcagViolations(page: Parameters<typeof AxeBuilder>[0]['page']): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
}

for (const route of representativeRoutes) {
  test(`passes Axe WCAG checks at ${route}`, async ({ page }) => {
    await page.goto(route);
    await expectNoWcagViolations(page);
  });
}

test('passes Axe checks with the hotkey dialog open', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Show navigation hotkeys' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectNoWcagViolations(page);
});

test('passes Axe checks in dark mode', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expectNoWcagViolations(page);
});
