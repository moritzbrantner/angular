import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import {
  AuthCredentials,
  AuthResult,
  ContactRequest,
  ContactSubmissionResult,
  EmployeeRecord,
  NewsletterSubscription,
  PasswordResetRequest,
  ProblemReportRequest,
  ProblemReportResult,
  RegisterRequest,
  ShowcaseRecord,
  TemplateRecord,
} from '../models/content.models';
import { SHOWCASES, TEMPLATES } from '../content/site.content';
import { EMPLOYEES } from '../content/next-template.content';

export interface TemplatesRepository {
  list(): Observable<readonly TemplateRecord[]>;
  featured(): Observable<readonly TemplateRecord[]>;
  getBySlug(slug: string): Observable<TemplateRecord | undefined>;
}

export interface ShowcaseRepository {
  list(): Observable<readonly ShowcaseRecord[]>;
  featured(): Observable<readonly ShowcaseRecord[]>;
  getBySlug(slug: string): Observable<ShowcaseRecord | undefined>;
}

export interface ContactRepository {
  submit(request: ContactRequest): Observable<ContactSubmissionResult>;
}

export interface AuthRepository {
  login(request: AuthCredentials): Observable<AuthResult>;
  register(request: RegisterRequest): Observable<AuthResult>;
  requestPasswordReset(request: PasswordResetRequest): Observable<AuthResult>;
}

export interface EmployeeRepository {
  list(): Observable<readonly EmployeeRecord[]>;
}

export interface NewsletterRepository {
  subscribe(request: NewsletterSubscription): Observable<ContactSubmissionResult>;
}

export interface ProblemReportRepository {
  submit(request: ProblemReportRequest): Observable<ProblemReportResult>;
}

export const TEMPLATES_REPOSITORY = new InjectionToken<TemplatesRepository>('TEMPLATES_REPOSITORY');
export const SHOWCASE_REPOSITORY = new InjectionToken<ShowcaseRepository>('SHOWCASE_REPOSITORY');
export const CONTACT_REPOSITORY = new InjectionToken<ContactRepository>('CONTACT_REPOSITORY');
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
export const EMPLOYEE_REPOSITORY = new InjectionToken<EmployeeRepository>('EMPLOYEE_REPOSITORY');
export const NEWSLETTER_REPOSITORY = new InjectionToken<NewsletterRepository>('NEWSLETTER_REPOSITORY');
export const PROBLEM_REPORT_REPOSITORY = new InjectionToken<ProblemReportRepository>('PROBLEM_REPORT_REPOSITORY');

@Injectable({
  providedIn: 'root',
})
export class StaticTemplatesRepository implements TemplatesRepository {
  list(): Observable<readonly TemplateRecord[]> {
    return of(TEMPLATES);
  }

  featured(): Observable<readonly TemplateRecord[]> {
    return of(TEMPLATES.slice(0, 3));
  }

  getBySlug(slug: string): Observable<TemplateRecord | undefined> {
    return of(TEMPLATES.find((template) => template.slug === slug));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiTemplatesRepository implements TemplatesRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<readonly TemplateRecord[]> {
    return this.http.get<readonly TemplateRecord[]>(`${this.environment.apiBaseUrl}/templates`);
  }

  featured(): Observable<readonly TemplateRecord[]> {
    return this.http.get<readonly TemplateRecord[]>(`${this.environment.apiBaseUrl}/templates/featured`);
  }

  getBySlug(slug: string): Observable<TemplateRecord | undefined> {
    return this.http.get<TemplateRecord>(`${this.environment.apiBaseUrl}/templates/${slug}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticShowcaseRepository implements ShowcaseRepository {
  list(): Observable<readonly ShowcaseRecord[]> {
    return of(SHOWCASES);
  }

  featured(): Observable<readonly ShowcaseRecord[]> {
    return of(SHOWCASES.slice(0, 3));
  }

  getBySlug(slug: string): Observable<ShowcaseRecord | undefined> {
    return of(SHOWCASES.find((showcase) => showcase.slug === slug));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiShowcaseRepository implements ShowcaseRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<readonly ShowcaseRecord[]> {
    return this.http.get<readonly ShowcaseRecord[]>(`${this.environment.apiBaseUrl}/showcases`);
  }

  featured(): Observable<readonly ShowcaseRecord[]> {
    return this.http.get<readonly ShowcaseRecord[]>(`${this.environment.apiBaseUrl}/showcases/featured`);
  }

  getBySlug(slug: string): Observable<ShowcaseRecord | undefined> {
    return this.http.get<ShowcaseRecord>(`${this.environment.apiBaseUrl}/showcases/${slug}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticContactRepository implements ContactRepository {
  submit(_: ContactRequest): Observable<ContactSubmissionResult> {
    return of({
      ok: true,
      message: 'Message captured in static mode. Swap to the connected or server build to send it to a backend.',
    }).pipe(delay(250));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiContactRepository implements ContactRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  submit(request: ContactRequest): Observable<ContactSubmissionResult> {
    return this.http.post<ContactSubmissionResult>(
      this.environment.contactEndpoint ?? `${this.environment.apiBaseUrl}/contact`,
      request,
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticAuthRepository implements AuthRepository {
  login(request: AuthCredentials): Observable<AuthResult> {
    return of({
      ok: request.email.includes('@') && request.password.length > 0,
      message: 'Signed in with the static auth adapter. Swap to the server build for real sessions.',
    }).pipe(delay(250));
  }

  register(request: RegisterRequest): Observable<AuthResult> {
    const passwordsMatch = request.password === request.confirmPassword;
    return of({
      ok: passwordsMatch,
      message: passwordsMatch
        ? 'Account created in static mode and ready for the connected adapter.'
        : 'Passwords must match before the account can be created.',
    }).pipe(delay(250));
  }

  requestPasswordReset(_: PasswordResetRequest): Observable<AuthResult> {
    return of({
      ok: true,
      message: 'Reset link queued in static mode.',
    }).pipe(delay(250));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiAuthRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  login(request: AuthCredentials): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.environment.apiBaseUrl}/auth/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.environment.apiBaseUrl}/auth/register`, request);
  }

  requestPasswordReset(request: PasswordResetRequest): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.environment.apiBaseUrl}/auth/password-reset`, request);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticEmployeeRepository implements EmployeeRepository {
  list(): Observable<readonly EmployeeRecord[]> {
    return of(EMPLOYEES).pipe(delay(150));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiEmployeeRepository implements EmployeeRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  list(): Observable<readonly EmployeeRecord[]> {
    return this.http.get<readonly EmployeeRecord[]>(`${this.environment.apiBaseUrl}/employees`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticNewsletterRepository implements NewsletterRepository {
  subscribe(request: NewsletterSubscription): Observable<ContactSubmissionResult> {
    return of({
      ok: request.email.includes('@'),
      message: 'Newsletter subscription captured in static mode.',
    }).pipe(delay(250));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiNewsletterRepository implements NewsletterRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  subscribe(request: NewsletterSubscription): Observable<ContactSubmissionResult> {
    return this.http.post<ContactSubmissionResult>(`${this.environment.apiBaseUrl}/newsletter`, request);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StaticProblemReportRepository implements ProblemReportRepository {
  submit(_: ProblemReportRequest): Observable<ProblemReportResult> {
    return of({
      ok: true,
      referenceId: `STATIC-${Date.now().toString(36).toUpperCase()}`,
      message: 'Problem report captured in static mode.',
    }).pipe(delay(250));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiProblemReportRepository implements ProblemReportRepository {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  submit(request: ProblemReportRequest): Observable<ProblemReportResult> {
    return this.http.post<ProblemReportResult>(`${this.environment.apiBaseUrl}/problem-reports`, request);
  }
}
