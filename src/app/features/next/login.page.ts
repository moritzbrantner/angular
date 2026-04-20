import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { AUTH_REPOSITORY } from '../../shared/data-access/content.repositories';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Willkommen zurueck' : 'Welcome back' }}</p>
        <h1>{{ locale() === 'de' ? 'Melde dich an und arbeite dort weiter, wo du zuletzt aufgehoert hast.' : 'Sign in to continue where you left off.' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Greife mit deiner E-Mail-Adresse und deinem Passwort auf geschuetzte Bereiche zu.' : 'Access protected tools with your email and password.' }}
        </p>
      </section>

      <section class="section auth-layout">
        <article class="content-card">
          <h2>{{ locale() === 'de' ? 'Anmelden' : 'Log in' }}</h2>
          <p class="muted-copy">{{ locale() === 'de' ? 'Nutze deine Zugangsdaten, um auf die Anwendung zuzugreifen.' : 'Use your account credentials to access the application.' }}</p>
        </article>

        <form class="content-card auth-form" [formGroup]="form" (ngSubmit)="submit()">
          <label class="field">
            <span>Email</span>
            <input type="email" autocomplete="email" formControlName="email" [attr.aria-invalid]="hasError('email')" />
            @if (hasError('email')) {
              <small>Enter a valid email address.</small>
            }
          </label>

          <label class="field">
            <span>{{ locale() === 'de' ? 'Passwort' : 'Password' }}</span>
            <input type="password" autocomplete="current-password" formControlName="password" [attr.aria-invalid]="hasError('password')" />
            @if (hasError('password')) {
              <small>Password is required.</small>
            }
          </label>

          <button class="button button--primary" type="submit" [disabled]="submitting()">
            {{ locale() === 'de' ? 'Anmelden' : 'Log in' }}
          </button>

          @if (message()) {
            <p class="status-copy" [class.status-copy--error]="hasSubmissionError()">{{ message() }}</p>
          }

          <p class="muted-copy">
            {{ locale() === 'de' ? 'Noch kein Konto?' : 'Need an account?' }}
            <a [routerLink]="localeService.localizedPath('register')">{{ locale() === 'de' ? 'Registrieren' : 'Create one' }}</a>
          </p>
        </form>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authRepository = inject(AUTH_REPOSITORY);
  private readonly seo = inject(SeoService);
  protected readonly localeService = inject(LocaleService);
  protected readonly locale = this.localeService.locale;
  protected readonly submitting = signal(false);
  protected readonly message = signal('');
  protected readonly hasSubmissionError = signal(false);
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    this.seo.setPage('Log in', 'Sign in to the localized Angular template application.');
  }

  protected hasError(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    this.message.set('');
    this.hasSubmissionError.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.form.disable();
    this.authRepository
      .login(this.form.getRawValue())
      .pipe(finalize(() => {
        this.submitting.set(false);
        this.form.enable();
      }))
      .subscribe((result) => {
        this.hasSubmissionError.set(!result.ok);
        this.message.set(result.message);
      });
  }
}
