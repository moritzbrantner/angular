import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
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
import { AppEnvironment } from '../config/app-environment';

export function provideDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(),
    {
      provide: TEMPLATES_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticTemplatesRepository,
        apiRepository: ApiTemplatesRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticTemplatesRepository, ApiTemplatesRepository],
    },
    {
      provide: SHOWCASE_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticShowcaseRepository,
        apiRepository: ApiShowcaseRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticShowcaseRepository, ApiShowcaseRepository],
    },
    {
      provide: CONTACT_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticContactRepository,
        apiRepository: ApiContactRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticContactRepository, ApiContactRepository],
    },
  ]);
}
