import { AppEnvironment } from '../app/core/config/app-environment';

export const environment: AppEnvironment = {
  siteName: 'Foundry Stack',
  siteDescription:
    'A connected Angular deployment that reads content and form actions from backend services.',
  siteUrl: 'https://example.com',
  contentMode: 'api',
  apiBaseUrl: '/api',
  contactEndpoint: '/api/contact',
};
