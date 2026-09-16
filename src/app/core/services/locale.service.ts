import { computed, Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Locale } from '../../shared/models/content.models';

function normalizeLocale(value: string | undefined): Locale {
  return value === 'de' ? 'de' : 'en';
}

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly locale = computed(() => normalizeLocale(this.url().split('/').filter(Boolean)[0]));
  readonly relativePath = computed(() => {
    const segments = this.url().split('?')[0].split('/').filter(Boolean);
    return segments.length > 1 ? segments.slice(1).join('/') : '';
  });

  localizedPath(path: string, locale = this.locale()): string {
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    return cleanPath.length > 0 ? `/${locale}/${cleanPath}` : `/${locale}`;
  }

  currentPathFor(locale: Locale): string {
    return this.localizedPath(this.relativePath(), locale);
  }
}
