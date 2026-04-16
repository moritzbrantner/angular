import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../core/services/seo.service';
import { SHOWCASE_REPOSITORY } from '../../shared/data-access/content.repositories';
import { ShowcaseCardComponent } from '../../shared/ui/showcase-card.component';

@Component({
  selector: 'app-showcase-page',
  imports: [ShowcaseCardComponent],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Production showcase</p>
        <h1>Examples built around proof, delivery detail, and implementation clarity.</h1>
        <p class="lead-copy">
          These case studies are authored from typed content today and can later move behind APIs
          or a CMS without changing the rendering layer.
        </p>
      </section>

      <section class="section">
        <div class="filters filters--compact">
          <label class="field">
            <span>Search</span>
            <input
              type="search"
              [value]="query()"
              (input)="updateQuery($event)"
              placeholder="Search showcase"
            />
          </label>

          <label class="field">
            <span>Sector</span>
            <select [value]="selectedSector()" (change)="updateSector($event)">
              @for (sector of sectors(); track sector) {
                <option [value]="sector">{{ sector }}</option>
              }
            </select>
          </label>
        </div>

        <div class="card-grid">
          @for (showcase of filteredShowcases(); track showcase.slug) {
            <app-showcase-card [showcase]="showcase" />
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './showcase.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcasePageComponent {
  private readonly showcaseRepository = inject(SHOWCASE_REPOSITORY);
  private readonly seo = inject(SeoService);
  private readonly showcases = toSignal(this.showcaseRepository.list(), { initialValue: [] });

  protected readonly query = signal('');
  protected readonly selectedSector = signal('All');
  protected readonly sectors = computed(() => [
    'All',
    ...new Set(this.showcases().map((showcase) => showcase.sector)),
  ]);
  protected readonly filteredShowcases = computed(() =>
    this.showcases().filter((showcase) => {
      const query = this.query().trim().toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        `${showcase.name} ${showcase.challenge} ${showcase.summary}`.toLowerCase().includes(query);
      const matchesSector =
        this.selectedSector() === 'All' || showcase.sector === this.selectedSector();

      return matchesQuery && matchesSector;
    }),
  );

  constructor() {
    this.seo.setPage(
      'Showcase',
      'Case-study pages that combine outcomes, stack choices, and proof-driven storytelling.',
    );
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected updateSector(event: Event): void {
    this.selectedSector.set((event.target as HTMLSelectElement).value);
  }
}
