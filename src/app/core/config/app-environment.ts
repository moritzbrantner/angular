export type ContentMode = 'static' | 'api';

export interface AppEnvironment {
  readonly siteName: string;
  readonly siteDescription: string;
  readonly siteUrl: string;
  readonly contentMode: ContentMode;
  readonly apiBaseUrl: string | null;
  readonly contactEndpoint: string | null;
}
