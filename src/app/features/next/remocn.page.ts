import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-remocn-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Registry components</p>
        <h1>A remocn showcase route inside the existing app shell.</h1>
        <p class="lead-copy">
          This Angular route mirrors the registry showcase with browser-safe motion treatments and reusable preview blocks.
        </p>
        <div class="example-links">
          <a class="button button--primary" href="https://remocn.dev" target="_blank" rel="noreferrer">Open component catalog</a>
          <a class="button button--secondary" href="https://remocn.dev/docs" target="_blank" rel="noreferrer">Open installation guide</a>
        </div>
      </section>

      <section class="remocn-grid">
        <article class="content-card terminal">
          <p class="eyebrow">UI block</p>
          <h2>TerminalSimulator</h2>
          <pre><code>~/projects/remocn-showcase
bunx shadcn add @remocn/blur-reveal
registry installed: 4 components</code></pre>
        </article>

        <article class="content-card">
          <p class="eyebrow">Typography</p>
          <h2>BlurReveal</h2>
          <p class="lead-copy">A heavy-to-sharp text reveal that works well for hero copy, intros, and product names.</p>
        </article>

        <article class="content-card">
          <p class="eyebrow">Typography</p>
          <h2>MatrixDecode</h2>
          <p class="decode">RE-%&#64;?(% =$-_\\</p>
        </article>

        <article class="content-card spotlight">
          <p class="eyebrow">Environment and lighting</p>
          <h2>SpotlightCard</h2>
          <p class="muted-copy">A synthetic cursor treatment makes the card surface and border respond to motion.</p>
        </article>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemocnPageComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPage('remocn showcase', 'Registry component showcase inside the Angular app shell.');
  }
}
