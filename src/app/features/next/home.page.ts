import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { LocaleService } from '../../core/services/locale.service';
import { HOME_COPY, HOME_FEATURES } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-next-home-page',
  imports: [RouterLink],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ copy().eyebrow }}</p>
        <h1>{{ copy().title }}</h1>
        <p class="lead-copy">{{ copy().lead }}</p>
        <div class="hero-actions">
          <a class="button button--primary" [routerLink]="localeService.localizedPath('examples/forms')">
            {{ locale() === 'de' ? 'Formularbeispiel oeffnen' : 'Open Form Example' }}
          </a>
          <a class="button button--secondary" [routerLink]="localeService.localizedPath('examples/story')">
            {{ locale() === 'de' ? 'Story-Beispiel oeffnen' : 'Open Story Example' }}
          </a>
          <a class="button button--secondary" [routerLink]="localeService.localizedPath('examples/communication')">
            {{ locale() === 'de' ? 'Kommunikationsbeispiel oeffnen' : 'Open Communication Example' }}
          </a>
          <a class="button button--secondary" [routerLink]="localeService.localizedPath('examples/uploads')">
            {{ locale() === 'de' ? 'Upload-Beispiel oeffnen' : 'Open Upload Example' }}
          </a>
        </div>
      </section>

      <section class="section card-grid card-grid--three">
        @for (feature of features(); track feature.eyebrow) {
          <article class="content-card feature-card">
            <p class="eyebrow">{{ feature.eyebrow }}</p>
            <h2>{{ feature.title }}</h2>
            <p class="muted-copy">{{ feature.lead }}</p>
          </article>
        }
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextHomePageComponent {
  protected readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly copy = computed(() => HOME_COPY[this.locale()]);
  protected readonly features = computed(() => HOME_FEATURES[this.locale()]);

  constructor() {
    this.seo.setPage(
      'Next Template',
      'Localized Angular application foundation with auth, forms, data views, storytelling, communication notes, and upload scaffolding.',
    );
  }
}
