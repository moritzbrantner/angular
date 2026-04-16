import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { SeoService } from '../../core/services/seo.service';
import { SHOWCASE_REPOSITORY, TEMPLATES_REPOSITORY } from '../../shared/data-access/content.repositories';
import { TemplateCardComponent } from '../../shared/ui/template-card.component';

@Component({
  selector: 'app-showcase-detail-page',
  imports: [NgOptimizedImage, RouterLink, TemplateCardComponent],
  template: `
    <div class="page-shell">
      @if (showcase(); as activeShowcase) {
        <section class="detail-hero">
          <div class="detail-hero__copy">
            <p class="eyebrow">{{ activeShowcase.sector }}</p>
            <h1>{{ activeShowcase.name }}</h1>
            <p class="lead-copy">{{ activeShowcase.challenge }}</p>
            <p>{{ activeShowcase.summary }}</p>
            <p class="detail-outcome">{{ activeShowcase.outcome }}</p>
          </div>

          <div class="content-card">
            <img
              [ngSrc]="activeShowcase.hero.src"
              [width]="activeShowcase.hero.width"
              [height]="activeShowcase.hero.height"
              [alt]="activeShowcase.hero.alt"
              priority
            />
          </div>
        </section>

        <section class="section detail-grid">
          <article class="content-card">
            <h2>Results</h2>
            <ul class="stack-list">
              @for (result of activeShowcase.results; track result) {
                <li>{{ result }}</li>
              }
            </ul>
          </article>

          <article class="content-card">
            <h2>Stack</h2>
            <ul class="stack-list">
              @for (item of activeShowcase.stack; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </article>
        </section>

        @if (linkedTemplate(); as template) {
          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Linked template</p>
              <h2>This project maps back to a reusable template system.</h2>
            </div>

            <div class="card-grid">
              <app-template-card [template]="template" />
            </div>
          </section>
        }
      } @else {
        <section class="empty-state">
          <p class="eyebrow">Showcase missing</p>
          <h1>That case study could not be found.</h1>
          <a class="button button--primary" routerLink="/showcase">Return to showcase</a>
        </section>
      }
    </div>
  `,
  styleUrl: './showcase-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly showcaseRepository = inject(SHOWCASE_REPOSITORY);
  private readonly templatesRepository = inject(TEMPLATES_REPOSITORY);
  private readonly seo = inject(SeoService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: '',
  });
  private readonly templates = toSignal(this.templatesRepository.list(), { initialValue: [] });

  protected readonly showcase = toSignal(
    toObservable(this.slug).pipe(switchMap((slug) => this.showcaseRepository.getBySlug(slug))),
    { initialValue: undefined },
  );
  protected readonly linkedTemplate = computed(() => {
    const activeShowcase = this.showcase();
    if (!activeShowcase) {
      return undefined;
    }

    return this.templates().find((template) => template.slug === activeShowcase.linkedTemplateSlug);
  });

  constructor() {
    effect(() => {
      const activeShowcase = this.showcase();
      if (activeShowcase) {
        this.seo.setPage(activeShowcase.name, activeShowcase.summary);
        return;
      }

      this.seo.setPage('Showcase not found', 'The requested showcase detail page does not exist.');
    });
  }
}
