import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
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
    {
      provide: AUTH_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticAuthRepository,
        apiRepository: ApiAuthRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticAuthRepository, ApiAuthRepository],
    },
    {
      provide: EMPLOYEE_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticEmployeeRepository,
        apiRepository: ApiEmployeeRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticEmployeeRepository, ApiEmployeeRepository],
    },
    {
      provide: NEWSLETTER_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticNewsletterRepository,
        apiRepository: ApiNewsletterRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticNewsletterRepository, ApiNewsletterRepository],
    },
    {
      provide: PROBLEM_REPORT_REPOSITORY,
      useFactory: (
        environment: AppEnvironment,
        staticRepository: StaticProblemReportRepository,
        apiRepository: ApiProblemReportRepository,
      ) => (environment.contentMode === 'api' ? apiRepository : staticRepository),
      deps: [APP_ENVIRONMENT, StaticProblemReportRepository, ApiProblemReportRepository],
    },
  ]);
}
