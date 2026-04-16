import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { SeoService } from '../../core/services/seo.service';
import { SHOWCASE_REPOSITORY, TEMPLATES_REPOSITORY } from '../../shared/data-access/content.repositories';
import { FAQS, PLATFORM_MODES, SITE_STATS } from '../../shared/content/site.content';
import { ShowcaseCardComponent } from '../../shared/ui/showcase-card.component';
import { TemplateCardComponent } from '../../shared/ui/template-card.component';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, RouterLink, TemplateCardComponent, ShowcaseCardComponent],
  template: `
    <div class="page-shell">
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">Comprehensive template and showcase platform</p>
          <h1>Build once for GitHub Pages, then grow into backend services without rewriting the UI.</h1>
          <p class="lead-copy">
            Foundry Stack is a static-first Angular architecture for template catalogs, case studies,
            docs, and conversion pages. The same frontend can later attach to APIs or a server build.
          </p>

          <div class="hero__actions">
            <a class="button button--primary" routerLink="/templates">Browse templates</a>
            <a class="button button--secondary" routerLink="/docs">Read the architecture</a>
          </div>

          <div class="status-panel">
            <p class="status-panel__label">Current build mode</p>
            <p class="status-panel__value">{{ environment.contentMode === 'api' ? 'Connected' : 'Static' }}</p>
            <p class="status-panel__copy">
              {{
                environment.contentMode === 'api'
                  ? 'Repositories are currently resolved through backend endpoints.'
                  : 'Public routes and content are ready for static hosting with no backend dependency.'
              }}
            </p>
          </div>
        </div>

        <div class="hero__visual content-card">
          <img
            ngSrc="images/template-atlas.svg"
            width="960"
            height="720"
            priority
            alt="Abstract launch template preview with dashboards and content panels."
          />

          <div class="hero__rail">
            <div class="hero__rail-item">
              <span>Deployment</span>
              <strong>Static output by default</strong>
            </div>
            <div class="hero__rail-item">
              <span>Data</span>
              <strong>Typed content or live APIs</strong>
            </div>
            <div class="hero__rail-item">
              <span>Backend</span>
              <strong>Optional Express services</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">Why this shape works</p>
          <h2>A single Angular app with three delivery modes.</h2>
        </div>

        <div class="metrics-grid">
          @for (stat of siteStats; track stat.label) {
            <article class="content-card">
              <p class="metric-value">{{ stat.value }}</p>
              <p class="muted-copy">{{ stat.label }}</p>
            </article>
          }
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">Delivery modes</p>
          <h2>Start simple and keep a clean upgrade path.</h2>
        </div>

        <div class="card-grid card-grid--three">
          @for (mode of platformModes; track mode.name) {
            <article class="content-card">
              <h3>{{ mode.name }}</h3>
              <p>{{ mode.description }}</p>

              <ul class="stack-list">
                @for (strength of mode.strengths; track strength) {
                  <li>{{ strength }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">Featured templates</p>
          <h2>Catalog entries that explain the template, not just decorate it.</h2>
        </div>

        <div class="card-grid">
          @for (template of featuredTemplates(); track template.slug) {
            <app-template-card [template]="template" />
          }
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">Featured showcase</p>
          <h2>Project stories with proof, stack details, and implementation context.</h2>
        </div>

        <div class="card-grid">
          @for (showcase of featuredShowcases(); track showcase.slug) {
            <app-showcase-card [showcase]="showcase" />
          }
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2>Operational decisions to make early.</h2>
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
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly templatesRepository = inject(TEMPLATES_REPOSITORY);
  private readonly showcaseRepository = inject(SHOWCASE_REPOSITORY);
  private readonly seo = inject(SeoService);

  protected readonly environment = inject(APP_ENVIRONMENT);
  protected readonly featuredTemplates = toSignal(this.templatesRepository.featured(), {
    initialValue: [],
  });
  protected readonly featuredShowcases = toSignal(this.showcaseRepository.featured(), {
    initialValue: [],
  });
  protected readonly siteStats = SITE_STATS;
  protected readonly platformModes = PLATFORM_MODES;
  protected readonly faqs = FAQS;

  constructor() {
    this.seo.setPage(
      'Static-first template and showcase platform',
      'An Angular template and showcase website designed for GitHub Pages first, with clear seams for backend services later.',
    );
  }
}
