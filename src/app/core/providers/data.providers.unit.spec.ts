import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import {
  ApiContactRepository,
  ApiShowcaseRepository,
  ApiTemplatesRepository,
  CONTACT_REPOSITORY,
  SHOWCASE_REPOSITORY,
  StaticContactRepository,
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
  });
});
