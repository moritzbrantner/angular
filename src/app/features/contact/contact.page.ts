import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { SeoService } from '../../core/services/seo.service';
import { CONTACT_REPOSITORY } from '../../shared/data-access/content.repositories';

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Contact</p>
        <h1>Request a build path that starts static and leaves room for services.</h1>
        <p class="lead-copy">
          The form works in every mode. In static mode it simulates a successful handoff; in
          connected or server mode it posts to the configured endpoint.
        </p>
      </section>

      <section class="section contact-layout">
        <article class="content-card contact-card">
          <p class="eyebrow">Current mode</p>
          <h2>{{ environment.contentMode === 'api' ? 'Connected or server build' : 'Static build' }}</h2>
          <p>
            {{
              environment.contentMode === 'api'
                ? 'Messages will be posted to the configured endpoint.'
                : 'Messages are accepted locally so the static site stays functional without a backend.'
            }}
          </p>

          <ul class="stack-list">
            <li>Lead capture form</li>
            <li>Backend-ready submission contract</li>
            <li>Accessible validation and focus flow</li>
          </ul>
        </article>

        <form class="content-card contact-form" [formGroup]="form" (ngSubmit)="submit()">
          <label class="field">
            <span>Name</span>
            <input
              type="text"
              formControlName="name"
              autocomplete="name"
              [attr.aria-invalid]="hasError('name')"
            />
            @if (hasError('name')) {
              <small class="error-copy">Name is required.</small>
            }
          </label>

          <label class="field">
            <span>Email</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="email"
              [attr.aria-invalid]="hasError('email')"
            />
            @if (hasError('email')) {
              <small class="error-copy">Enter a valid email address.</small>
            }
          </label>

          <label class="field">
            <span>Company</span>
            <input type="text" formControlName="company" autocomplete="organization" />
          </label>

          <label class="field">
            <span>Project type</span>
            <select formControlName="projectType">
              @for (type of projectTypes; track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Message</span>
            <textarea
              rows="6"
              formControlName="message"
              [attr.aria-invalid]="hasError('message')"
            ></textarea>
            @if (hasError('message')) {
              <small class="error-copy">Share a few details about the site or migration you want.</small>
            }
          </label>

          <button class="button button--primary" type="submit" [disabled]="submitting()">
            {{ submitting() ? 'Sending…' : 'Send request' }}
          </button>

          @if (submissionMessage()) {
            <p class="submission-copy" [class.submission-copy--error]="submissionHasError()">
              {{ submissionMessage() }}
            </p>
          }
        </form>
      </section>
    </div>
  `,
  styleUrl: './contact.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactRepository = inject(CONTACT_REPOSITORY);
  private readonly seo = inject(SeoService);

  protected readonly environment = inject(APP_ENVIRONMENT);
  protected readonly projectTypes = ['Template implementation', 'Showcase site', 'Docs platform', 'Migration'];
  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    projectType: ['Template implementation'],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });
  protected readonly submitting = signal(false);
  protected readonly submissionMessage = signal('');
  protected readonly submissionHasError = signal(false);

  constructor() {
    this.seo.setPage(
      'Contact',
      'Request implementation help for a static-first Angular template and showcase website.',
    );
  }

  protected hasError(controlName: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    this.submissionMessage.set('');
    this.submissionHasError.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.form.disable();

    this.contactRepository
      .submit(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.submitting.set(false);
          this.form.enable();
        }),
      )
      .subscribe({
        next: (result) => {
          this.submissionHasError.set(!result.ok);
          this.submissionMessage.set(result.message);

          if (result.ok) {
            this.form.reset({
              name: '',
              email: '',
              company: '',
              projectType: 'Template implementation',
              message: '',
            });
          }
        },
        error: () => {
          this.submissionHasError.set(true);
          this.submissionMessage.set('Submission failed. Verify the configured backend endpoint and try again.');
        },
      });
  }
}
