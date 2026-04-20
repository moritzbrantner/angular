import { RenderMode, ServerRoute } from '@angular/ssr';

const localizedPaths = [
  'en',
  'de',
  'en/about',
  'de/about',
  'en/login',
  'de/login',
  'en/register',
  'de/register',
  'en/examples/forms',
  'de/examples/forms',
  'en/examples/story',
  'de/examples/story',
  'en/examples/communication',
  'de/examples/communication',
  'en/examples/uploads',
  'de/examples/uploads',
  'en/table',
  'de/table',
  'en/remocn',
  'de/remocn',
  'en/blog',
  'de/blog',
  'en/changelog',
  'de/changelog',
  'en/report-problem',
  'de/report-problem',
];

const localizedServerRoutes: ServerRoute[] = localizedPaths.map((path) => ({
  path,
  renderMode: RenderMode.Prerender,
}));

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  ...localizedServerRoutes,
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
