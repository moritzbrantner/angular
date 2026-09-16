import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import {
  AUTH_REPOSITORY,
  NEWSLETTER_REPOSITORY,
  PROBLEM_REPORT_REPOSITORY,
} from '../../shared/data-access/content.repositories';
import { CommunicationPageComponent } from './communication.page';
import { RegisterPageComponent } from './register.page';
import { ReportProblemPageComponent } from './report-problem.page';

function setValue(control: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
}

function submit(form: HTMLFormElement): void {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('RegisterPageComponent request failures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideRouter([]),
        { provide: APP_ENVIRONMENT, useValue: environment },
        {
          provide: AUTH_REPOSITORY,
          useValue: {
            login: () => throwError(() => new Error('network unavailable')),
            register: () => throwError(() => new Error('network unavailable')),
            requestPasswordReset: () => throwError(() => new Error('network unavailable')),
          },
        },
      ],
    }).compileComponents();
  });

  it('surfaces account creation failures and restores the form', async () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    fixture.detectChanges();

    const forms = fixture.nativeElement.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    const inputs = forms[0].querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    setValue(inputs[0], 'Alex');
    setValue(inputs[1], 'alex@example.com');
    setValue(inputs[2], 'password123');
    setValue(inputs[3], 'password123');

    submit(forms[0]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(forms[0].querySelector('.status-copy--error')?.textContent).toContain(
      'Account creation failed. Check your connection and try again.',
    );
    expect(inputs[0].disabled).toBe(false);
  });

  it('surfaces password reset failures and restores the form', async () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    fixture.detectChanges();

    const forms = fixture.nativeElement.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    const email = forms[1].querySelector('input[type="email"]') as HTMLInputElement;
    setValue(email, 'alex@example.com');

    submit(forms[1]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(forms[1].querySelector('.status-copy--error')?.textContent).toContain(
      'Password reset failed. Check your connection and try again.',
    );
    expect(email.disabled).toBe(false);
  });
});

describe('CommunicationPageComponent request failures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationPageComponent],
      providers: [
        provideRouter([]),
        { provide: APP_ENVIRONMENT, useValue: environment },
        {
          provide: NEWSLETTER_REPOSITORY,
          useValue: {
            subscribe: () => throwError(() => new Error('network unavailable')),
          },
        },
      ],
    }).compileComponents();
  });

  it('surfaces newsletter request failures and restores the form', async () => {
    const fixture = TestBed.createComponent(CommunicationPageComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const email = form.querySelector('input[type="email"]') as HTMLInputElement;
    setValue(email, 'alex@example.com');

    submit(form);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(form.querySelector('.status-copy--error')?.textContent).toContain(
      'Newsletter subscription failed. Check your connection and try again.',
    );
    expect(email.disabled).toBe(false);
  });
});

describe('ReportProblemPageComponent request failures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportProblemPageComponent],
      providers: [
        provideRouter([]),
        { provide: APP_ENVIRONMENT, useValue: environment },
        {
          provide: PROBLEM_REPORT_REPOSITORY,
          useValue: {
            submit: () => throwError(() => new Error('network unavailable')),
          },
        },
      ],
    }).compileComponents();
  });

  it('surfaces problem-report request failures and restores the form', async () => {
    const fixture = TestBed.createComponent(ReportProblemPageComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const details = form.querySelector('textarea') as HTMLTextAreaElement;
    setValue(details, 'Saving changes closes the modal before confirmation is visible.');

    submit(form);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(form.querySelector('.status-copy--error')?.textContent).toContain(
      'Problem report failed to send. Check your connection and try again.',
    );
    expect(details.disabled).toBe(false);
  });
});
