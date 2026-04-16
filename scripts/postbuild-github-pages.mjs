import { copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const browserOutput = join(process.cwd(), 'dist', 'angular2', 'browser');
const indexFile = join(browserOutput, 'index.html');
const fallbackFile = join(browserOutput, '404.html');

try {
  await stat(indexFile);
  await copyFile(indexFile, fallbackFile);
  console.log('Copied index.html to 404.html for GitHub Pages fallback handling.');
} catch {
  console.warn('GitHub Pages postbuild skipped because dist/angular2/browser/index.html was not found.');
}
