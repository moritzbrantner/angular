import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import {
  ContactRequest,
  ContactSubmissionResult,
  ShowcaseRecord,
  TemplateRecord,
} from '../models/content.models';
import { SHOWCASES, TEMPLATES } from '../content/site.content';

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

export const TEMPLATES_REPOSITORY = new InjectionToken<TemplatesRepository>('TEMPLATES_REPOSITORY');
export const SHOWCASE_REPOSITORY = new InjectionToken<ShowcaseRepository>('SHOWCASE_REPOSITORY');
export const CONTACT_REPOSITORY = new InjectionToken<ContactRepository>('CONTACT_REPOSITORY');

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
