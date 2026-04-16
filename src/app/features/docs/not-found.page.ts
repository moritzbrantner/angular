import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="empty-state">
      <p class="eyebrow">404</p>
      <h1>That page does not exist in this build.</h1>
      <p class="lead-copy">
        On static hosting, direct refreshes depend on the generated fallback file. Use the catalog
        and showcase routes from the main navigation when possible.
      </p>
      <a class="button button--primary" routerLink="/">Back home</a>
    </section>
  `,
  styleUrl: './not-found.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPage('Page not found', 'The requested page could not be found.');
  }
}
