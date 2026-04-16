import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { SHOWCASES, TEMPLATES } from './shared/content/site.content';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'templates',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'templates/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return TEMPLATES.map(({ slug }) => ({ slug }));
    },
  },
  {
    path: 'showcase',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'showcase/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return SHOWCASES.map(({ slug }) => ({ slug }));
    },
  },
  {
    path: 'docs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
