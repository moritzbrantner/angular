import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { LocaleService } from '../../core/services/locale.service';
import { ABOUT_COPY } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-next-about-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ copy().eyebrow }}</p>
        <h1>{{ copy().title }}</h1>
        <p class="lead-copy">{{ copy().lead }}</p>
      </section>

      <section class="section card-grid card-grid--three">
        <article class="content-card">
          <h2>Locale routing</h2>
          <p class="muted-copy">Routes like /en/about and /de/about share components while reading localized content.</p>
        </article>
        <article class="content-card">
          <h2>Typed content</h2>
          <p class="muted-copy">Page copy, posts, changelog entries, employees, and demo records use stable TypeScript models.</p>
        </article>
        <article class="content-card">
          <h2>Backend optional</h2>
          <p class="muted-copy">Repositories keep static hosting viable while connected and server builds can use API endpoints.</p>
        </article>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextAboutPageComponent {
  private readonly seo = inject(SeoService);
  private readonly localeService = inject(LocaleService);
  protected readonly copy = computed(() => ABOUT_COPY[this.localeService.locale()]);

  constructor() {
    this.seo.setPage('About This Project', 'Locale routing and typed feature routes for the Angular template.');
  }
}
