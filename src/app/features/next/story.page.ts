import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { STORY_STEPS } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-story-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Story-Scroll-Demo' : 'Story Scroll Demo' }}</p>
        <h1>Package-powered story sequence</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Diese Angular-Version bildet die scroll- und tastaturgesteuerte Story als zugaengliche Komponente nach.' : 'This Angular version recreates the scroll and keyboard driven story as an accessible component.' }}
        </p>
      </section>

      <section class="story-shell">
        <aside class="content-card story-minimap" aria-label="Story minimap">
          <p class="eyebrow">Step {{ activeIndex() + 1 }} / {{ steps.length }}</p>
          <button class="button button--secondary" type="button" (click)="reset()">Reset</button>
          @for (step of steps; track step.title; let index = $index) {
            <button type="button" [class.active]="index === activeIndex()" (click)="setActive(index)">
              <strong>0{{ index + 1 }}</strong>
              <span>{{ step.title }}</span>
            </button>
          }
        </aside>

        <article class="content-card story-stage" tabindex="0" (keydown)="handleStageKeydown($event)">
          <div class="story-orbit" aria-hidden="true"></div>
          <p class="eyebrow">{{ activeStep().eyebrow }}</p>
          <h2>{{ activeStep().title }}</h2>
          <p class="lead-copy">{{ activeStep().lead }}</p>
          <ul class="inline-list">
            <li>Progress {{ (activeIndex() + 1) * 100 - 100 }}-{{ (activeIndex() + 1) * 100 }}</li>
            <li>{{ settings.settings().reducedMotion ? 'Reduced motion' : 'Animated' }}</li>
            <li>Arrow keys enabled</li>
          </ul>
          <div class="story-controls">
            <button class="button button--secondary" type="button" (click)="previous()">Previous</button>
            <button class="button button--primary" type="button" (click)="next()">Next</button>
          </div>
        </article>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryPageComponent {
  protected readonly settings = inject(AppSettingsService);
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly steps = STORY_STEPS;
  protected readonly activeIndex = signal(0);
  protected readonly activeStep = computed(() => this.steps[this.activeIndex()]);

  constructor() {
    this.seo.setPage('Story Scroll Demo', 'Keyboard and scroll-friendly story sequence for Angular.');
  }

  protected setActive(index: number): void {
    this.activeIndex.set(Math.max(0, Math.min(index, this.steps.length - 1)));
  }

  protected reset(): void {
    this.activeIndex.set(0);
  }

  protected next(): void {
    this.setActive(this.activeIndex() + 1);
  }

  protected previous(): void {
    this.setActive(this.activeIndex() - 1);
  }

  protected handleStageKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.next();
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.previous();
    }
  }
}
