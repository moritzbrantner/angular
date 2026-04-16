import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_ENVIRONMENT } from '../config/environment.token';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly environment = inject(APP_ENVIRONMENT);

  setPage(title: string, description: string): void {
    this.title.setTitle(`${title} | ${this.environment.siteName}`);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: `${title} | ${this.environment.siteName}` });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.environment.siteName });
  }
}
