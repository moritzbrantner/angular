import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { TEMPLATES } from '../content/site.content';
import {
  ApiTemplatesRepository,
  StaticContactRepository,
  StaticTemplatesRepository,
} from './content.repositories';

describe('Content repositories unit', () => {
  describe('Static repositories', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({});
    });

    it('returns template records by slug', async () => {
      const repository = TestBed.inject(StaticTemplatesRepository);
      const template = await firstValueFrom(repository.getBySlug('atlas-launch-kit'));

      expect(template?.name).toBe('Atlas Launch Kit');
    });

    it('returns the first three templates as featured content', async () => {
      const repository = TestBed.inject(StaticTemplatesRepository);
      const templates = await firstValueFrom(repository.featured());

      expect(templates).toHaveLength(3);
      expect(templates.map((template) => template.slug)).toEqual(
        TEMPLATES.slice(0, 3).map((template) => template.slug),
      );
    });

    it('accepts contact submissions in static mode', async () => {
      const repository = TestBed.inject(StaticContactRepository);
      const result = await firstValueFrom(
        repository.submit({
          name: 'Alex',
          email: 'alex@example.com',
          company: 'Foundry',
          projectType: 'Showcase site',
          message: 'We need a static-first site that can later move behind APIs.',
        }),
      );

      expect(result.ok).toBe(true);
    });
  });

  describe('API repositories', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: APP_ENVIRONMENT,
            useValue: {
              ...environment,
              contentMode: 'api',
              apiBaseUrl: 'https://api.example.test',
              contactEndpoint: 'https://api.example.test/contact',
            },
          },
        ],
      });
    });

    afterEach(() => {
      TestBed.inject(HttpTestingController).verify();
    });

    it('requests template details from the configured API endpoint', async () => {
      const repository = TestBed.inject(ApiTemplatesRepository);
      const request = firstValueFrom(repository.getBySlug('atlas-launch-kit'));
      const http = TestBed.inject(HttpTestingController);

      const pending = http.expectOne('https://api.example.test/templates/atlas-launch-kit');
      expect(pending.request.method).toBe('GET');

      pending.flush(TEMPLATES[0]);

      await expect(request).resolves.toEqual(TEMPLATES[0]);
    });
  });
});
