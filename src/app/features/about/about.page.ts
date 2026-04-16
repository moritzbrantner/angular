import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">About the system</p>
        <h1>A site template should show how it scales, not only how it looks.</h1>
        <p class="lead-copy">
          This workspace is opinionated about structure: standalone routes, signals for local state,
          typed content, and repository seams for backend growth.
        </p>
      </section>

      <section class="section card-grid card-grid--three">
        <article class="content-card">
          <h2>Static first</h2>
          <p>Public pages ship as a browser-only build so GitHub Pages is a first-class deployment, not a fallback.</p>
        </article>

        <article class="content-card">
          <h2>Typed content</h2>
          <p>Templates and showcases use stable record shapes, making the eventual CMS or API migration mechanical instead of disruptive.</p>
        </article>

        <article class="content-card">
          <h2>Backend optional</h2>
          <p>Forms, search, or admin flows can move into server routes or remote APIs without rewriting page components.</p>
        </article>
      </section>

      <section class="section content-card">
        <p class="eyebrow">Implementation principles</p>
        <ul class="stack-list">
          <li>Standalone Angular components and lazy-loaded feature routes.</li>
          <li>Signals and computed state for local UI behavior.</li>
          <li>Accessible controls, visible focus, semantic landmarks, and WCAG-conscious contrast.</li>
          <li>One repository contract, multiple runtime providers.</li>
        </ul>
      </section>
    </div>
  `,
  styleUrl: './about.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPage(
      'About',
      'Design principles behind the static-first Angular template and showcase website.',
    );
  }
}
