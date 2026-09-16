import { expect, test } from '@playwright/test';

test('redirects to localized home and supports locale switching plus hotkeys', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('heading', { level: 1, name: 'One template, multiple production-ready starting points.' })).toBeVisible();

  await page.getByRole('link', { name: 'DE' }).click();
  await expect(page).toHaveURL(/\/de$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Eine Vorlage mit mehreren produktionsnahen Ausgangspunkten.' })).toBeVisible();

  await page.keyboard.press('Alt+F');
  await expect(page).toHaveURL(/\/de\/examples\/forms$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Mitarbeiterprofil-Formular' })).toBeVisible();

  await page.getByRole('button', { name: /Show navigation hotkeys/ }).click();
  await expect(page.getByRole('dialog', { name: /Jump between routes/ })).toBeVisible();
});

test('runs auth, upload, report, and not-found flows', async ({ page }) => {
  await page.goto('/en/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('alex@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Signed in with the static auth adapter')).toBeVisible();

  await page.goto('/en/examples/uploads');
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Choose files').click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: 'records.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{}'),
  });
  await expect(page.getByText('Validate schema')).toBeVisible();

  await page.goto('/en/report-problem');
  await page.getByRole('textbox', { name: 'What happened?' }).fill('Saving changes closed the modal before the confirmation was visible.');
  await page.getByRole('button', { name: 'Send report' }).click();
  await expect(page.getByText(/Reference: STATIC-/)).toBeVisible();

  await page.goto('/en/missing-route');
  await expect(page.getByRole('heading', { level: 1, name: 'The page does not exist.' })).toBeVisible();
});
