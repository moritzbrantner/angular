import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { TEMPLATES } from '../content/site.content';
import {
  ApiNewsletterRepository,
  ApiTemplatesRepository,
  StaticAuthRepository,
  StaticContactRepository,
  StaticEmployeeRepository,
  StaticProblemReportRepository,
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

    it('supports the new static auth, employee, and report repositories', async () => {
      const authRepository = TestBed.inject(StaticAuthRepository);
      const employeeRepository = TestBed.inject(StaticEmployeeRepository);
      const reportRepository = TestBed.inject(StaticProblemReportRepository);

      const auth = await firstValueFrom(
        authRepository.login({
          email: 'alex@example.com',
          password: 'password',
        }),
      );
      const employees = await firstValueFrom(employeeRepository.list());
      const report = await firstValueFrom(
        reportRepository.submit({
          name: 'Alex',
          email: 'alex@example.com',
          area: 'Bug',
          pageUrl: 'https://app.example.test',
          subject: 'Unexpected state',
          details: 'The application entered an unexpected state after saving.',
        }),
      );

      expect(auth.ok).toBe(true);
      expect(employees.length).toBeGreaterThan(0);
      expect(report.referenceId).toMatch(/^STATIC-/);
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

    it('posts newsletter subscriptions to the configured API endpoint', async () => {
      const repository = TestBed.inject(ApiNewsletterRepository);
      const request = firstValueFrom(repository.subscribe({ email: 'alex@example.com' }));
      const http = TestBed.inject(HttpTestingController);

      const pending = http.expectOne('https://api.example.test/newsletter');
      expect(pending.request.method).toBe('POST');

      pending.flush({ ok: true, message: 'Subscribed.' });

      await expect(request).resolves.toEqual({ ok: true, message: 'Subscribed.' });
    });
  });
});
