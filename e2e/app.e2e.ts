import { expect, test } from '@playwright/test';

test('navigates from the home page through templates to the contact flow', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Build once for GitHub Pages, then grow into backend services without rewriting the UI.',
    }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Browse templates' }).click();
  await expect(page).toHaveURL(/\/templates$/);

  await page.getByRole('searchbox', { name: 'Search' }).fill('Atlas');
  await expect(page.getByText('1 templates matched.')).toBeVisible();

  await page.getByRole('link', { name: 'View template' }).click();
  await expect(page).toHaveURL(/\/templates\/atlas-launch-kit$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Atlas Launch Kit' })).toBeVisible();

  await page.getByRole('link', { name: 'Request implementation' }).click();
  await expect(page).toHaveURL(/\/contact$/);

  await page.getByRole('textbox', { name: 'Name' }).fill('Alex');
  await page.getByRole('textbox', { name: 'Email' }).fill('alex@example.com');
  await page.getByRole('textbox', { name: 'Company' }).fill('Foundry');
  await page.getByRole('combobox', { name: 'Project type' }).selectOption('Migration');
  await page
    .getByRole('textbox', { name: 'Message' })
    .fill('We need a migration path that keeps the public site static while backend services are phased in.');

  await page.getByRole('button', { name: 'Send request' }).click();

  await expect(
    page.getByText(
      'Message captured in static mode. Swap to the connected or server build to send it to a backend.',
    ),
  ).toBeVisible();
});

test('serves deep links and the not-found route from the built app', async ({ page }) => {
  await page.goto('/showcase/northstar-ops');

  await expect(page.getByRole('heading', { level: 1, name: 'Northstar Ops' })).toBeVisible();
  await expect(page.getByText('This project maps back to a reusable template system.')).toBeVisible();

  await page.goto('/missing-route');

  await expect(page.getByRole('heading', { level: 1, name: 'That page does not exist in this build.' })).toBeVisible();
});
