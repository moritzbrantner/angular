import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../core/services/seo.service';
import { TEMPLATES_REPOSITORY } from '../../shared/data-access/content.repositories';
import { TemplateCardComponent } from '../../shared/ui/template-card.component';

@Component({
  selector: 'app-templates-page',
  imports: [TemplateCardComponent],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Template library</p>
        <h1>Template systems designed for launches, docs, and proof-driven portfolios.</h1>
        <p class="lead-copy">
          The catalog is static-hosting friendly by default. Each record can also move behind an
          API without changing the page contract.
        </p>
      </section>

      <section class="section">
        <div class="filters">
          <label class="field">
            <span>Search</span>
            <input
              type="search"
              [value]="query()"
              (input)="updateQuery($event)"
              placeholder="Search templates"
            />
          </label>

          <label class="field">
            <span>Category</span>
            <select [value]="selectedCategory()" (change)="updateCategory($event)">
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Audience</span>
            <select [value]="selectedAudience()" (change)="updateAudience($event)">
              @for (audience of audiences(); track audience) {
                <option [value]="audience">{{ audience }}</option>
              }
            </select>
          </label>
        </div>

        <p class="muted-copy results-copy">{{ filteredTemplates().length }} templates matched.</p>

        <div class="card-grid">
          @for (template of filteredTemplates(); track template.slug) {
            <app-template-card [template]="template" />
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './templates.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesPageComponent {
  private readonly templatesRepository = inject(TEMPLATES_REPOSITORY);
  private readonly seo = inject(SeoService);

  private readonly templates = toSignal(this.templatesRepository.list(), {
    initialValue: [],
  });

  protected readonly query = signal('');
  protected readonly selectedCategory = signal('All');
  protected readonly selectedAudience = signal('All');
  protected readonly categories = computed(() => [
    'All',
    ...new Set(this.templates().map((template) => template.category)),
  ]);
  protected readonly audiences = computed(() => [
    'All',
    ...new Set(this.templates().map((template) => template.audience)),
  ]);
  protected readonly filteredTemplates = computed(() =>
    this.templates().filter((template) => {
      const query = this.query().trim().toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        `${template.name} ${template.tagline} ${template.summary}`.toLowerCase().includes(query);
      const matchesCategory =
        this.selectedCategory() === 'All' || template.category === this.selectedCategory();
      const matchesAudience =
        this.selectedAudience() === 'All' || template.audience === this.selectedAudience();

      return matchesQuery && matchesCategory && matchesAudience;
    }),
  );

  constructor() {
    this.seo.setPage(
      'Templates',
      'Browse Angular template systems for launch pages, docs, and showcase-heavy sites.',
    );
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected updateCategory(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  protected updateAudience(event: Event): void {
    this.selectedAudience.set((event.target as HTMLSelectElement).value);
  }
}
