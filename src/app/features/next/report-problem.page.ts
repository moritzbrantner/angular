import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { PROBLEM_REPORT_REPOSITORY } from '../../shared/data-access/content.repositories';

@Component({
  selector: 'app-report-problem-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Support Intake' : 'Support intake' }}</p>
        <h1>{{ locale() === 'de' ? 'Problem melden' : 'Report a problem' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Teile das Problem, wo es passiert ist, und genug Details fuer eine schnelle Reproduktion.' : 'Share the issue, where it happened, and enough detail for someone to reproduce it quickly.' }}
        </p>
      </section>

      <section class="section split-layout">
        <form class="content-card plain-form" [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <label class="field">
              <span>Your name</span>
              <input type="text" formControlName="name" autocomplete="name" />
            </label>
            <label class="field">
              <span>Email address</span>
              <input type="email" formControlName="email" autocomplete="email" />
            </label>
            <label class="field">
              <span>Problem area</span>
              <select formControlName="area">
                @for (area of areas; track area) {
                  <option [value]="area">{{ area }}</option>
                }
              </select>
            </label>
            <label class="field">
              <span>Page URL</span>
              <input type="url" formControlName="pageUrl" placeholder="https://app.example.com/settings" />
            </label>
            <label class="field field--full">
              <span>Short summary</span>
              <input type="text" formControlName="subject" placeholder="Saving changes closes the modal unexpectedly" />
            </label>
            <label class="field field--full">
              <span>What happened?</span>
              <textarea rows="6" formControlName="details" placeholder="What did you expect, what actually happened, and how can someone reproduce it?"></textarea>
            </label>
          </div>

          <p class="muted-copy">Avoid pasting passwords, secrets, or personal data that is not needed to understand the issue.</p>

          <button class="button button--primary" type="submit" [disabled]="submitting()">Send report</button>

          @if (message()) {
            <p class="status-copy" [class.status-copy--error]="hasError()">{{ message() }}</p>
          }
        </form>

        <div class="section">
          @for (tip of tips; track tip.title) {
            <article class="content-card">
              <h2>{{ tip.title }}</h2>
              <p class="muted-copy">{{ tip.copy }}</p>
            </article>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportProblemPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly problemReportRepository = inject(PROBLEM_REPORT_REPOSITORY);
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly submitting = signal(false);
  protected readonly message = signal('');
  protected readonly hasError = signal(false);
  protected readonly areas = ['Bug', 'Performance', 'Account or access', 'Billing', 'Other'];
  protected readonly tips = [
    { title: 'Lead with the symptom', copy: 'Describe the visible failure first so triage can classify it quickly.' },
    { title: 'Point to the exact surface', copy: 'Include the page, workflow, or action that triggered the problem.' },
    { title: 'Leave a reachable contact', copy: 'Use an email someone can reply to if more context is needed.' },
  ];
  protected readonly form = this.formBuilder.group({
    name: ['Alex Johnson', Validators.required],
    email: ['alex@example.com', [Validators.required, Validators.email]],
    area: ['Bug', Validators.required],
    pageUrl: ['https://app.example.com/settings', Validators.required],
    subject: ['Saving changes closes the modal unexpectedly', Validators.required],
    details: ['', [Validators.required, Validators.minLength(20)]],
  });

  constructor() {
    this.seo.setPage('Report a problem', 'Support intake form with static and API repository behavior.');
  }

  protected submit(): void {
    this.message.set('');
    this.hasError.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasError.set(true);
      this.message.set('Complete the required fields before sending the report.');
      return;
    }

    this.submitting.set(true);
    this.form.disable();
    this.problemReportRepository
      .submit(this.form.getRawValue())
      .pipe(finalize(() => {
        this.submitting.set(false);
        this.form.enable();
      }))
      .subscribe((result) => {
        this.hasError.set(!result.ok);
        this.message.set(`${result.message} Reference: ${result.referenceId}`);
      });
  }
}
