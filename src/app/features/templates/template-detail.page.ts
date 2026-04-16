import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { SeoService } from '../../core/services/seo.service';
import { SHOWCASE_REPOSITORY, TEMPLATES_REPOSITORY } from '../../shared/data-access/content.repositories';
import { ShowcaseCardComponent } from '../../shared/ui/showcase-card.component';

@Component({
  selector: 'app-template-detail-page',
  imports: [NgOptimizedImage, RouterLink, ShowcaseCardComponent],
  template: `
    <div class="page-shell">
      @if (template(); as activeTemplate) {
        <section class="detail-hero">
          <div class="detail-hero__copy">
            <p class="eyebrow">{{ activeTemplate.category }}</p>
            <h1>{{ activeTemplate.name }}</h1>
            <p class="lead-copy">{{ activeTemplate.tagline }}</p>
            <p>{{ activeTemplate.summary }}</p>

            <div class="stack-list__wrap">
              <ul class="stack-list" aria-label="Template stack">
                @for (item of activeTemplate.stack; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>

            <div class="detail-hero__actions">
              <a class="button button--primary" routerLink="/contact">Request implementation</a>
              <a class="button button--secondary" routerLink="/templates">Back to catalog</a>
            </div>
          </div>

          <div class="content-card">
            <img
              [ngSrc]="activeTemplate.hero.src"
              [width]="activeTemplate.hero.width"
              [height]="activeTemplate.hero.height"
              [alt]="activeTemplate.hero.alt"
              priority
            />
          </div>
        </section>

        <section class="section detail-grid">
          <article class="content-card">
            <h2>Capabilities</h2>
            <ul class="stack-list">
              @for (capability of activeTemplate.capabilities; track capability) {
                <li>{{ capability }}</li>
              }
            </ul>
          </article>

          <article class="content-card">
            <h2>Deployment fit</h2>
            <ul class="stack-list">
              @for (mode of activeTemplate.deploymentModes; track mode) {
                <li>{{ mode }}</li>
              }
            </ul>
            <p class="muted-copy">{{ activeTemplate.highlight }}</p>
          </article>
        </section>

        <section class="section">
          <div class="section-heading">
            <p class="eyebrow">Related showcase</p>
            <h2>Where this template shape fits in production.</h2>
          </div>

          <div class="card-grid">
            @for (showcase of relatedShowcases(); track showcase.slug) {
              <app-showcase-card [showcase]="showcase" />
            }
          </div>
        </section>
      } @else {
        <section class="empty-state">
          <p class="eyebrow">Template missing</p>
          <h1>That template could not be found.</h1>
          <a class="button button--primary" routerLink="/templates">Return to templates</a>
        </section>
      }
    </div>
  `,
  styleUrl: './template-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly templatesRepository = inject(TEMPLATES_REPOSITORY);
  private readonly showcaseRepository = inject(SHOWCASE_REPOSITORY);
  private readonly seo = inject(SeoService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: '',
  });
  private readonly showcases = toSignal(this.showcaseRepository.list(), { initialValue: [] });

  protected readonly template = toSignal(
    toObservable(this.slug).pipe(switchMap((slug) => this.templatesRepository.getBySlug(slug))),
    { initialValue: undefined },
  );
  protected readonly relatedShowcases = computed(() => {
    const activeTemplate = this.template();
    if (!activeTemplate) {
      return [];
    }

    return this.showcases().filter((showcase) => activeTemplate.relatedShowcases.includes(showcase.slug));
  });

  constructor() {
    effect(() => {
      const activeTemplate = this.template();
      if (activeTemplate) {
        this.seo.setPage(activeTemplate.name, activeTemplate.summary);
        return;
      }

      this.seo.setPage('Template not found', 'The requested template detail page does not exist.');
    });
  }
}
