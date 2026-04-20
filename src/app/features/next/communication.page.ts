import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { NEWSLETTER_REPOSITORY } from '../../shared/data-access/content.repositories';

@Component({
  selector: 'app-communication-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Kommunikationskategorie' : 'Communication category' }}</p>
        <h1>{{ locale() === 'de' ? 'Echtzeitkommunikation' : 'Realtime communication' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Eine kurze Referenz fuer Kollaborationsbausteine, sobald mehrere Clients denselben Zustand teilen muessen.' : 'A quick reference for collaboration primitives once multiple clients must share state.' }}
        </p>
      </section>

      <section class="section split-layout">
        <form class="content-card newsletter-card" [formGroup]="form" (ngSubmit)="subscribe()">
          <p class="eyebrow">{{ locale() === 'de' ? 'E-Mail-Kanal' : 'Email channel' }}</p>
          <h2>Newsletter</h2>
          <p class="muted-copy">{{ locale() === 'de' ? 'Erfasse eine E-Mail-Adresse und leite sie an den passenden Adapter weiter.' : 'Capture an email address and route it through the current repository adapter.' }}</p>
          <label class="field">
            <span>{{ locale() === 'de' ? 'E-Mail-Adresse' : 'Email address' }}</span>
            <input type="email" formControlName="email" autocomplete="email" />
          </label>
          <button class="button button--primary" type="submit" [disabled]="submitting()">
            {{ locale() === 'de' ? 'Abonnieren' : 'Subscribe' }}
          </button>
          @if (message()) {
            <p class="status-copy" [class.status-copy--error]="hasError()">{{ message() }}</p>
          }
        </form>

        <div class="section">
          <article class="content-card">
            <p class="eyebrow">{{ locale() === 'de' ? 'Kommunikationsthema' : 'Communication topic' }}</p>
            <h2>WebSockets</h2>
            <p class="muted-copy">WebSockets keep one long-lived connection open so clients and servers can exchange low-latency events without repeated request setup.</p>
            <ul class="stack-list">
              <li>Useful for presence, chat, collaborative cursors, and streaming updates.</li>
              <li>Most apps need auth refresh, heartbeats, reconnect state, and backoff.</li>
              <li>Small event payloads are easier to merge incrementally in the UI.</li>
            </ul>
          </article>

          <article class="content-card">
            <p class="eyebrow">{{ locale() === 'de' ? 'Kommunikationsthema' : 'Communication topic' }}</p>
            <h2>CRDTs</h2>
            <p class="muted-copy">CRDTs let multiple clients edit shared state concurrently and still converge without central lock-step coordination.</p>
            <ul class="stack-list">
              <li>Useful when collaboration must survive offline periods.</li>
              <li>Operations are often stored locally and synced later.</li>
              <li>Conflict resolution moves into the data structure.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly newsletterRepository = inject(NEWSLETTER_REPOSITORY);
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  protected readonly submitting = signal(false);
  protected readonly message = signal('');
  protected readonly hasError = signal(false);

  constructor() {
    this.seo.setPage('Realtime communication', 'Newsletter, WebSocket, and CRDT communication scaffolding.');
  }

  protected subscribe(): void {
    this.message.set('');
    this.hasError.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasError.set(true);
      this.message.set('Enter a valid email address.');
      return;
    }

    this.submitting.set(true);
    this.form.disable();
    this.newsletterRepository
      .subscribe(this.form.getRawValue())
      .pipe(finalize(() => {
        this.submitting.set(false);
        this.form.enable();
      }))
      .subscribe((result) => {
        this.hasError.set(!result.ok);
        this.message.set(result.message);
      });
  }
}
