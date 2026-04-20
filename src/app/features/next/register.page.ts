import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { AUTH_REPOSITORY } from '../../shared/data-access/content.repositories';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Konto erstellen' : 'Create your account' }}</p>
        <h1>{{ locale() === 'de' ? 'Erstelle ein sicheres Konto und lege sofort los.' : 'Start with a secure account and get into the app immediately.' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Registriere dich mit einer gueltigen E-Mail-Adresse und einem starken Passwort.' : 'Register with a valid email and a strong password.' }}
        </p>
      </section>

      <section class="section auth-layout">
        <form class="content-card auth-form" [formGroup]="form" (ngSubmit)="submitRegistration()">
          <h2>{{ locale() === 'de' ? 'Registrieren' : 'Register' }}</h2>

          <label class="field">
            <span>{{ locale() === 'de' ? 'Anzeigename' : 'Display name' }}</span>
            <input type="text" autocomplete="name" formControlName="name" />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" autocomplete="email" formControlName="email" />
          </label>

          <label class="field">
            <span>{{ locale() === 'de' ? 'Passwort' : 'Password' }}</span>
            <input type="password" autocomplete="new-password" formControlName="password" />
          </label>

          <label class="field">
            <span>{{ locale() === 'de' ? 'Passwort bestaetigen' : 'Confirm password' }}</span>
            <input type="password" autocomplete="new-password" formControlName="confirmPassword" />
          </label>

          <button class="button button--primary" type="submit" [disabled]="submitting()">
            {{ locale() === 'de' ? 'Konto erstellen' : 'Create account' }}
          </button>

          @if (registrationMessage()) {
            <p class="status-copy" [class.status-copy--error]="registrationHasError()">{{ registrationMessage() }}</p>
          }

          <p class="muted-copy">
            {{ locale() === 'de' ? 'Bereits registriert?' : 'Already have an account?' }}
            <a [routerLink]="localeService.localizedPath('login')">{{ locale() === 'de' ? 'Anmelden' : 'Log in' }}</a>
          </p>
        </form>

        <form class="content-card auth-form" [formGroup]="resetForm" (ngSubmit)="submitReset()">
          <h2>{{ locale() === 'de' ? 'Passwort zuruecksetzen?' : 'Need to reset an existing password?' }}</h2>
          <p class="muted-copy">{{ locale() === 'de' ? 'Sende einen sicheren Reset-Link, ohne diese Seite zu verlassen.' : 'Send a secure reset link without leaving this page.' }}</p>

          <label class="field">
            <span>{{ locale() === 'de' ? 'Konto-E-Mail' : 'Account email' }}</span>
            <input type="email" autocomplete="email" formControlName="email" />
          </label>

          <button class="button button--secondary" type="submit" [disabled]="resetSubmitting()">
            {{ locale() === 'de' ? 'Reset-Link senden' : 'Send reset link' }}
          </button>

          @if (resetMessage()) {
            <p class="status-copy" [class.status-copy--error]="resetHasError()">{{ resetMessage() }}</p>
          }
        </form>
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authRepository = inject(AUTH_REPOSITORY);
  private readonly seo = inject(SeoService);
  protected readonly localeService = inject(LocaleService);
  protected readonly locale = this.localeService.locale;
  protected readonly submitting = signal(false);
  protected readonly resetSubmitting = signal(false);
  protected readonly registrationMessage = signal('');
  protected readonly resetMessage = signal('');
  protected readonly registrationHasError = signal(false);
  protected readonly resetHasError = signal(false);
  protected readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });
  protected readonly resetForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.seo.setPage('Register', 'Create an account or request a password reset.');
  }

  protected submitRegistration(): void {
    this.registrationMessage.set('');
    this.registrationHasError.set(false);

    if (this.form.invalid || this.form.controls.password.value !== this.form.controls.confirmPassword.value) {
      this.form.markAllAsTouched();
      this.registrationHasError.set(true);
      this.registrationMessage.set('Use a valid email and matching passwords of at least 8 characters.');
      return;
    }

    this.submitting.set(true);
    this.form.disable();
    this.authRepository
      .register(this.form.getRawValue())
      .pipe(finalize(() => {
        this.submitting.set(false);
        this.form.enable();
      }))
      .subscribe((result) => {
        this.registrationHasError.set(!result.ok);
        this.registrationMessage.set(result.message);
      });
  }

  protected submitReset(): void {
    this.resetMessage.set('');
    this.resetHasError.set(false);

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.resetSubmitting.set(true);
    this.resetForm.disable();
    this.authRepository
      .requestPasswordReset(this.resetForm.getRawValue())
      .pipe(finalize(() => {
        this.resetSubmitting.set(false);
        this.resetForm.enable();
      }))
      .subscribe((result) => {
        this.resetHasError.set(!result.ok);
        this.resetMessage.set(result.message);
      });
  }
}
