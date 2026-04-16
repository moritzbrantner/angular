import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Static-first template and showcase platform',
    loadComponent: () => import('./features/home/home.page').then((module) => module.HomePageComponent),
  },
  {
    path: 'templates',
    title: 'Templates',
    loadComponent: () =>
      import('./features/templates/templates.page').then((module) => module.TemplatesPageComponent),
  },
  {
    path: 'templates/:slug',
    title: 'Template detail',
    loadComponent: () =>
      import('./features/templates/template-detail.page').then(
        (module) => module.TemplateDetailPageComponent,
      ),
  },
  {
    path: 'showcase',
    title: 'Showcase',
    loadComponent: () =>
      import('./features/showcase/showcase.page').then((module) => module.ShowcasePageComponent),
  },
  {
    path: 'showcase/:slug',
    title: 'Showcase detail',
    loadComponent: () =>
      import('./features/showcase/showcase-detail.page').then(
        (module) => module.ShowcaseDetailPageComponent,
      ),
  },
  {
    path: 'docs',
    title: 'Documentation',
    loadComponent: () => import('./features/docs/docs.page').then((module) => module.DocsPageComponent),
  },
  {
    path: 'about',
    title: 'About',
    loadComponent: () =>
      import('./features/about/about.page').then((module) => module.AboutPageComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () =>
      import('./features/contact/contact.page').then((module) => module.ContactPageComponent),
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () =>
      import('./features/docs/not-found.page').then((module) => module.NotFoundPageComponent),
  },
];
