import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateRecord } from '../models/content.models';

@Component({
  selector: 'app-template-card',
  imports: [RouterLink],
  template: `
    <article class="content-card template-card">
      <div class="template-card__meta">
        <span class="pill">{{ template().category }}</span>
        <span class="muted-copy">{{ template().audience }}</span>
      </div>

      <h3>{{ template().name }}</h3>
      <p class="lead-copy">{{ template().tagline }}</p>
      <p>{{ template().summary }}</p>

      <ul class="inline-list" aria-label="Template capabilities">
        @for (capability of template().capabilities; track capability) {
          <li>{{ capability }}</li>
        }
      </ul>

      <div class="template-card__footer">
        <span class="muted-copy">{{ template().highlight }}</span>
        <a [routerLink]="['/templates', template().slug]">View template</a>
      </div>
    </article>
  `,
  styleUrl: './template-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCardComponent {
  readonly template = input.required<TemplateRecord>();
}
