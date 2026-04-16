import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShowcaseRecord } from '../models/content.models';

@Component({
  selector: 'app-showcase-card',
  imports: [RouterLink],
  template: `
    <article class="content-card showcase-card">
      <div class="showcase-card__meta">
        <span class="pill pill--alt">{{ showcase().sector }}</span>
        <span class="muted-copy">{{ showcase().outcome }}</span>
      </div>

      <h3>{{ showcase().name }}</h3>
      <p class="lead-copy">{{ showcase().challenge }}</p>
      <p>{{ showcase().summary }}</p>

      <ul class="inline-list" aria-label="Project results">
        @for (result of showcase().results; track result) {
          <li>{{ result }}</li>
        }
      </ul>

      <div class="showcase-card__footer">
        <span class="muted-copy">{{ showcase().stack.join(' · ') }}</span>
        <a [routerLink]="['/showcase', showcase().slug]">View case study</a>
      </div>
    </article>
  `,
  styleUrl: './showcase-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseCardComponent {
  readonly showcase = input.required<ShowcaseRecord>();
}
