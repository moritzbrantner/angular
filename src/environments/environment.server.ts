import { AppEnvironment } from '../app/core/config/app-environment';

export const environment: AppEnvironment = {
  siteName: 'Foundry Stack',
  siteDescription:
    'A server-backed Angular deployment with optional APIs and SSR-compatible delivery.',
  siteUrl: 'https://example.com',
  contentMode: 'api',
  apiBaseUrl: '/api',
  contactEndpoint: '/api/contact',
};
