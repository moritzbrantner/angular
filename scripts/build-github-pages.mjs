import { spawn } from 'node:child_process';

const defaultBaseHref = '/angular/';
const environmentBaseHref = process.env.GITHUB_PAGES_BASE_HREF;
const cliBaseHref = process.argv.find((argument) => argument.startsWith('--base-href='))?.split('=')[1];
const baseHref = cliBaseHref ?? environmentBaseHref ?? defaultBaseHref;

if (!baseHref.startsWith('/') || !baseHref.endsWith('/')) {
  console.error(`Invalid GitHub Pages base href "${baseHref}". Expected a value like "/repo-name/".`);
  process.exit(1);
}

const ngExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const ngArguments = [
  'ng',
  'build',
  '--configuration',
  'production',
  '--base-href',
  baseHref,
];

const build = spawn(ngExecutable, ngArguments, {
  stdio: 'inherit',
  shell: false,
});

build.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  const postbuild = spawn(process.execPath, ['scripts/postbuild-github-pages.mjs'], {
    stdio: 'inherit',
    shell: false,
  });

  postbuild.on('exit', (postbuildCode) => {
    process.exit(postbuildCode ?? 1);
  });
});
