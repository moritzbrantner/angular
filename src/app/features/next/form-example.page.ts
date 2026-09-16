import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { FORM_STATE_NOTES } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-form-example-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Formularbeispiel' : 'Form example' }}</p>
        <h1>{{ locale() === 'de' ? 'Mitarbeiterprofil-Formular' : 'Employee profile form' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Ein produktionsnahes Reactive-Forms-Beispiel mit zehn Feldern und einer kompakten Zustandsreferenz.' : 'A production-leaning Reactive Forms example with ten fields and a quick state-management reference.' }}
        </p>
      </section>

      <section class="section card-grid">
        @for (note of notes(); track note.eyebrow) {
          <article class="content-card">
            <p class="eyebrow">{{ note.eyebrow }}</p>
            <h2>{{ note.title }}</h2>
            <p class="muted-copy">{{ note.lead }}</p>
          </article>
        }
      </section>

      <form class="section content-card plain-form" [formGroup]="form" (ngSubmit)="submit()">
        <h2>{{ locale() === 'de' ? 'Mitarbeiterprofil-Formular' : 'Employee profile form' }}</h2>
        <div class="form-grid">
          <label class="field">
            <span>First name</span>
            <input type="text" formControlName="firstName" />
          </label>
          <label class="field">
            <span>Last name</span>
            <input type="text" formControlName="lastName" />
          </label>
          <label class="field">
            <span>Email</span>
            <input type="email" formControlName="email" />
          </label>
          <label class="field">
            <span>Phone</span>
            <input type="tel" formControlName="phone" />
          </label>
          <label class="field">
            <span>Age</span>
            <input type="number" formControlName="age" />
          </label>
          <label class="field">
            <span>Job title</span>
            <input type="text" formControlName="jobTitle" />
          </label>
          <label class="field">
            <span>Start date</span>
            <input type="date" formControlName="startDate" />
          </label>
          <label class="field">
            <span>Department</span>
            <select formControlName="department">
              @for (department of departments; track department) {
                <option [value]="department">{{ department }}</option>
              }
            </select>
          </label>
          <label class="field field--full">
            <span>Short bio</span>
            <textarea rows="5" formControlName="bio"></textarea>
          </label>
          <label class="field field--full checkbox-field">
            <span>
              <input type="checkbox" formControlName="newsletter" />
              Subscribe to newsletter
            </span>
          </label>
        </div>

        @if (form.invalid && submitted()) {
          <p class="status-copy status-copy--error">Complete required fields with valid values.</p>
        }

        @if (message()) {
          <p class="status-copy">{{ message() }}</p>
        }

        <div class="form-actions">
          <button class="button button--primary" type="submit">Submit profile</button>
          <button class="button button--secondary" type="button" (click)="reset()">Reset</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExamplePageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly notes = computed(() => FORM_STATE_NOTES[this.locale()]);
  protected readonly submitted = signal(false);
  protected readonly message = signal('');
  protected readonly departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'People Ops'];
  protected readonly form = this.formBuilder.group({
    firstName: ['Alex', Validators.required],
    lastName: ['Johnson', Validators.required],
    email: ['alex@example.com', [Validators.required, Validators.email]],
    phone: ['+49 30 123456'],
    age: [34, [Validators.required, Validators.min(18)]],
    jobTitle: ['Frontend Lead', Validators.required],
    startDate: ['2026-04-20', Validators.required],
    department: ['Engineering', Validators.required],
    newsletter: [true],
    bio: ['Builds accessible Angular application foundations.', [Validators.required, Validators.minLength(20)]],
  });

  constructor() {
    this.seo.setPage('Employee profile form', 'Reactive Forms example with validation and state notes.');
  }

  protected submit(): void {
    this.submitted.set(true);
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.message.set('Profile submitted locally. The form is ready to connect to an API repository.');
  }

  protected reset(): void {
    this.submitted.set(false);
    this.message.set('');
    this.form.reset({
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@example.com',
      phone: '+49 30 123456',
      age: 34,
      jobTitle: 'Frontend Lead',
      startDate: '2026-04-20',
      department: 'Engineering',
      newsletter: true,
      bio: 'Builds accessible Angular application foundations.',
    });
  }
}
