import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { CHANGELOG_ENTRIES } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-changelog-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Changelog</p>
        <h1>{{ locale() === 'de' ? 'Operative Aenderungen und Plattform-Updates' : 'Operational changes and platform updates' }}</h1>
      </section>

      <section class="post-list">
        @for (entry of entries(); track entry.title) {
          <article class="content-card">
            <time [attr.datetime]="entry.date">{{ entry.date }}</time>
            <h2>{{ entry.title }}</h2>
            <p class="muted-copy">{{ entry.summary }}</p>
          </article>
        }
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogPageComponent {
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly entries = computed(() => CHANGELOG_ENTRIES[this.locale()]);

  constructor() {
    this.seo.setPage('Changelog', 'Operational changes and platform updates.');
  }
}
