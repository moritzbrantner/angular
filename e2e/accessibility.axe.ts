import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const representativeRoutes = [
  { path: '/en', heading: 'One template, multiple production-ready starting points.' },
  { path: '/en/login', heading: 'Sign in to continue where you left off.' },
  { path: '/en/examples/forms', heading: 'Employee profile form' },
  { path: '/en/table', heading: 'Employee table' },
  { path: '/en/report-problem', heading: 'Report a problem' },
  { path: '/de', heading: 'Eine Vorlage mit mehreren produktionsnahen Ausgangspunkten.' },
] as const;

async function expectRouteReady(page: Page, heading: string): Promise<void> {
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
}

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

for (const route of representativeRoutes) {
  test(`passes all Axe checks at ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    await expectRouteReady(page, route.heading);
    await expectNoAxeViolations(page);
  });
}

test('passes all Axe checks with the hotkey dialog open', async ({ page }) => {
  await page.goto('/en');
  await expectRouteReady(page, 'One template, multiple production-ready starting points.');
  await page.getByRole('button', { name: 'Show navigation hotkeys' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectNoAxeViolations(page);
});

test('passes all Axe checks in dark mode', async ({ page }) => {
  await page.goto('/en');
  await expectRouteReady(page, 'One template, multiple production-ready starting points.');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expectNoAxeViolations(page);
});
