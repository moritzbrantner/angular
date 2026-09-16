import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import {
  ApiAuthRepository,
  ApiContactRepository,
  ApiEmployeeRepository,
  ApiNewsletterRepository,
  ApiProblemReportRepository,
  ApiShowcaseRepository,
  ApiTemplatesRepository,
  AUTH_REPOSITORY,
  CONTACT_REPOSITORY,
  EMPLOYEE_REPOSITORY,
  NEWSLETTER_REPOSITORY,
  PROBLEM_REPORT_REPOSITORY,
  SHOWCASE_REPOSITORY,
  StaticAuthRepository,
  StaticContactRepository,
  StaticEmployeeRepository,
  StaticNewsletterRepository,
  StaticProblemReportRepository,
  StaticShowcaseRepository,
  StaticTemplatesRepository,
  TEMPLATES_REPOSITORY,
} from '../../shared/data-access/content.repositories';
import { APP_ENVIRONMENT } from '../config/environment.token';
import { provideDataAccess } from './data.providers';

describe('provideDataAccess unit', () => {
  it('wires static repositories for the static build mode', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_ENVIRONMENT, useValue: environment },
        provideDataAccess(),
        provideHttpClientTesting(),
      ],
    });

    expect(TestBed.inject(TEMPLATES_REPOSITORY)).toBeInstanceOf(StaticTemplatesRepository);
    expect(TestBed.inject(SHOWCASE_REPOSITORY)).toBeInstanceOf(StaticShowcaseRepository);
    expect(TestBed.inject(CONTACT_REPOSITORY)).toBeInstanceOf(StaticContactRepository);
    expect(TestBed.inject(AUTH_REPOSITORY)).toBeInstanceOf(StaticAuthRepository);
    expect(TestBed.inject(EMPLOYEE_REPOSITORY)).toBeInstanceOf(StaticEmployeeRepository);
    expect(TestBed.inject(NEWSLETTER_REPOSITORY)).toBeInstanceOf(StaticNewsletterRepository);
    expect(TestBed.inject(PROBLEM_REPORT_REPOSITORY)).toBeInstanceOf(StaticProblemReportRepository);
  });

  it('wires API repositories for the connected build mode', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_ENVIRONMENT,
          useValue: {
            ...environment,
            contentMode: 'api',
            apiBaseUrl: 'https://api.example.test',
            contactEndpoint: 'https://api.example.test/contact',
          },
        },
        provideDataAccess(),
        provideHttpClientTesting(),
      ],
    });

    expect(TestBed.inject(TEMPLATES_REPOSITORY)).toBeInstanceOf(ApiTemplatesRepository);
    expect(TestBed.inject(SHOWCASE_REPOSITORY)).toBeInstanceOf(ApiShowcaseRepository);
    expect(TestBed.inject(CONTACT_REPOSITORY)).toBeInstanceOf(ApiContactRepository);
    expect(TestBed.inject(AUTH_REPOSITORY)).toBeInstanceOf(ApiAuthRepository);
    expect(TestBed.inject(EMPLOYEE_REPOSITORY)).toBeInstanceOf(ApiEmployeeRepository);
    expect(TestBed.inject(NEWSLETTER_REPOSITORY)).toBeInstanceOf(ApiNewsletterRepository);
    expect(TestBed.inject(PROBLEM_REPORT_REPOSITORY)).toBeInstanceOf(ApiProblemReportRepository);
  });
});
