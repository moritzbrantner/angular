import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { SeoService } from '../../core/services/seo.service';
import { DOCUMENTATION_SECTIONS, FAQS } from '../../shared/content/site.content';

@Component({
  selector: 'app-docs-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Architecture docs</p>
        <h1>Use static hosting as the baseline, not as a temporary compromise.</h1>
        <p class="lead-copy">
          This workspace keeps the frontend stable while repositories decide whether content comes
          from local constants or backend endpoints.
        </p>
      </section>

      <section class="section docs-grid">
        @for (section of sections; track section.title) {
          <article class="content-card">
            <h2>{{ section.title }}</h2>
            <p>{{ section.summary }}</p>
            <ul class="stack-list">
              @for (bullet of section.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          </article>
        }
      </section>

      <section class="section code-grid">
        <article class="content-card">
          <p class="eyebrow">Build commands</p>
          <pre><code>npm run build
npm run build:github-pages -- --base-href /your-repo/
npm run build:connected
npm run build:server</code></pre>
        </article>

        <article class="content-card">
          <p class="eyebrow">Current environment</p>
          <pre><code>mode: {{ environment.contentMode }}
apiBaseUrl: {{ environment.apiBaseUrl ?? 'none' }}
contactEndpoint: {{ environment.contactEndpoint ?? 'none' }}</code></pre>
        </article>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2>Design choices that prevent future rewrites.</h2>
        </div>

        <div class="faq-list">
          @for (item of faqs; track item.question) {
            <details class="content-card">
              <summary>{{ item.question }}</summary>
              <p>{{ item.answer }}</p>
            </details>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './docs.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPageComponent {
  private readonly seo = inject(SeoService);

  protected readonly environment = inject(APP_ENVIRONMENT);
  protected readonly sections = DOCUMENTATION_SECTIONS;
  protected readonly faqs = FAQS;

  constructor() {
    this.seo.setPage(
      'Documentation',
      'Architecture notes for the static-first Angular template and showcase platform.',
    );
  }
}
