# Foundry Stack

Static-first Angular showcase and template website with an optional server/backend path.

## Scripts

```bash
npm start
npm run build
npm run build:github-pages
npm run build:connected
npm run build:server
npm test -- --watch=false
```

## Deployment modes

- `build`: browser-only production build for static hosting.
- `build:github-pages`: static build plus `404.html` fallback copy for GitHub Pages.
- `build:connected`: same frontend with API-backed repository providers.
- `build:server`: browser + server bundles with Express endpoints under `/api/*`.

## GitHub Actions

- `.github/workflows/github-pages.yml`: tests the app, builds the static site, and deploys `dist/angular2/browser` to GitHub Pages.
- `.github/workflows/server-build.yml`: tests the app, builds the optional server variant, and uploads `dist/angular2` as an artifact.

## GitHub Pages setup

- Enable GitHub Pages in the repository settings and set the source to `GitHub Actions`.
- The Pages workflow derives `baseHref` from the repository name automatically.
- For local verification you can override the path:

```bash
GITHUB_PAGES_BASE_HREF=/angular/ npm run build:github-pages
```

## Architecture

- Standalone, lazy-loaded Angular routes.
- Signals for local page state.
- Typed in-repo content for templates and showcases.
- Repository abstraction to switch between static and API data.
- Optional Express service endpoints for templates, showcases, and contact submissions.
