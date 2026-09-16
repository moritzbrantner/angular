import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-localized-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Not found</p>
        <h1>{{ locale() === 'de' ? 'Die Seite existiert nicht.' : 'The page does not exist.' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Nutze die Navigation oder kehre zur lokalisierten Startseite zurueck.' : 'Use the main navigation or return to the localized home page.' }}
        </p>
        <a class="button button--primary" [routerLink]="localeService.localizedPath('')">
          {{ locale() === 'de' ? 'Zur Startseite' : 'Go home' }}
        </a>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalizedNotFoundPageComponent {
  protected readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;

  constructor() {
    this.seo.setPage('Not found', 'The requested localized route does not exist.');
  }
}
