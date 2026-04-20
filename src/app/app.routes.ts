import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

const localeGuard: CanActivateFn = (route) => {
  const locale = route.paramMap.get('locale');
  return locale === 'en' || locale === 'de' ? true : inject(Router).parseUrl('/en');
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en',
  },
  {
    path: ':locale',
    canActivate: [localeGuard],
    children: [
      {
        path: '',
        title: 'Next Template',
        loadComponent: () => import('./features/next/home.page').then((module) => module.NextHomePageComponent),
      },
      {
        path: 'about',
        title: 'About This Project',
        loadComponent: () => import('./features/next/about.page').then((module) => module.NextAboutPageComponent),
      },
      {
        path: 'login',
        title: 'Log in',
        loadComponent: () => import('./features/next/login.page').then((module) => module.LoginPageComponent),
      },
      {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./features/next/register.page').then((module) => module.RegisterPageComponent),
      },
      {
        path: 'examples/forms',
        title: 'Employee profile form',
        loadComponent: () =>
          import('./features/next/form-example.page').then((module) => module.FormExamplePageComponent),
      },
      {
        path: 'examples/story',
        title: 'Story Scroll Demo',
        loadComponent: () => import('./features/next/story.page').then((module) => module.StoryPageComponent),
      },
      {
        path: 'examples/communication',
        title: 'Realtime communication',
        loadComponent: () =>
          import('./features/next/communication.page').then((module) => module.CommunicationPageComponent),
      },
      {
        path: 'examples/uploads',
        title: 'Uploads',
        loadComponent: () => import('./features/next/uploads.page').then((module) => module.UploadsPageComponent),
      },
      {
        path: 'table',
        title: 'Employee table',
        loadComponent: () => import('./features/next/table.page').then((module) => module.TablePageComponent),
      },
      {
        path: 'remocn',
        title: 'remocn showcase',
        loadComponent: () => import('./features/next/remocn.page').then((module) => module.RemocnPageComponent),
      },
      {
        path: 'blog',
        title: 'Blog',
        loadComponent: () => import('./features/next/blog.page').then((module) => module.BlogPageComponent),
      },
      {
        path: 'changelog',
        title: 'Changelog',
        loadComponent: () => import('./features/next/changelog.page').then((module) => module.ChangelogPageComponent),
      },
      {
        path: 'report-problem',
        title: 'Report a problem',
        loadComponent: () =>
          import('./features/next/report-problem.page').then((module) => module.ReportProblemPageComponent),
      },
      {
        path: '**',
        title: 'Not found',
        loadComponent: () =>
          import('./features/next/localized-not-found.page').then((module) => module.LocalizedNotFoundPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'en',
  },
];
