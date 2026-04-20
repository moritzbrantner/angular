# Next Template Angular Parity

Localized Angular application foundation modeled after the deployed `next-template` reference. It includes locale routing, navigation menus, hotkeys, auth screens, form and table demos, communication notes, uploads, repo-managed content, problem reporting, static data providers, and optional server/API providers.

## Scripts

```bash
npm start
npm run build
npm run build:github-pages
npm run build:connected
npm run build:server
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:ci
```

## Public routes

- `/` redirects to `/en`
- `/:locale`
- `/:locale/about`
- `/:locale/login`
- `/:locale/register`
- `/:locale/examples/forms`
- `/:locale/examples/story`
- `/:locale/examples/communication`
- `/:locale/examples/uploads`
- `/:locale/table`
- `/:locale/remocn`
- `/:locale/blog`
- `/:locale/changelog`
- `/:locale/report-problem`
- `/:locale/**`

Supported locales are `en` and `de`. Locale links preserve the current path when switching languages.

## Feature surface

- Reference-style app shell with Discover and Workspace menus.
- Alt-key navigation shortcuts and a hotkey dialog.
- Light/dark theme persistence with an inline startup script to reduce theme flash.
- Privacy consent persistence for necessary-only or analytics opt-in.
- Reactive auth, registration, reset, employee profile, newsletter, and report-problem forms.
- Upload queue with file classification and strategy suggestions.
- Employee table with repository-backed data and loading/error/empty states.
- Static blog and changelog content stored as typed records.

## Deployment modes

- `build`: browser-only production build for static hosting.
- `build:github-pages`: static build plus `404.html` fallback copy for GitHub Pages.
- `build:connected`: same frontend with API-backed repository providers.
- `build:server`: browser + server bundles with Express endpoints under `/api/*`.

## Server endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/password-reset`
- `POST /api/newsletter`
- `POST /api/problem-reports`
- `GET /api/employees`
- Existing template, showcase, and contact endpoints remain available.

## Architecture

- Standalone lazy-loaded Angular routes.
- URL-based locale service for `en` and `de`.
- Signals for local UI state.
- Reactive Forms for user input.
- Repository abstraction for static, connected, and server-backed behavior.
- GitHub Pages fallback routing through a copied `404.html`.
