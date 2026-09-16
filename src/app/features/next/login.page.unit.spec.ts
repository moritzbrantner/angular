import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { AUTH_REPOSITORY } from '../../shared/data-access/content.repositories';
import { LoginPageComponent } from './login.page';

describe('LoginPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: APP_ENVIRONMENT, useValue: environment },
        {
          provide: AUTH_REPOSITORY,
          useValue: {
            login: () => throwError(() => new Error('network unavailable')),
          },
        },
      ],
    }).compileComponents();
  });

  it('surfaces request failures and restores the form', async () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();

    const email = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    email.value = 'alex@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'password';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.status-copy--error')?.textContent).toContain(
      'Sign in failed. Check your connection and try again.',
    );
    expect(email.disabled).toBe(false);
    expect(password.disabled).toBe(false);
  });
});
