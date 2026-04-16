import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from '../../shared/data-access/content.repositories';
import { ContactRequest } from '../../shared/models/content.models';
import { ContactPageComponent } from './contact.page';

describe('ContactPage integration', () => {
  let submitSpy = vi.fn((request: ContactRequest) =>
    of({ ok: true, message: `Request received for ${request.projectType}. We will respond shortly.` }),
  );
  let repository: ContactRepository;

  beforeEach(async () => {
    submitSpy.mockReset();
    submitSpy.mockImplementation((request: ContactRequest) =>
      of({ ok: true, message: `Request received for ${request.projectType}. We will respond shortly.` }),
    );
    repository = {
      submit(request) {
        return submitSpy(request);
      },
    };

    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        { provide: APP_ENVIRONMENT, useValue: environment },
        {
          provide: CONTACT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compileComponents();
  });

  it('shows validation feedback when the form is submitted empty', () => {
    const fixture = TestBed.createComponent(ContactPageComponent);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const form = element.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submitSpy).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Name is required.');
    expect(element.textContent).toContain('Enter a valid email address.');
    expect(element.textContent).toContain('Share a few details about the site or migration you want.');
  });

  it('submits valid form data and resets the form after success', async () => {
    const fixture = TestBed.createComponent(ContactPageComponent);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const nameInput = element.querySelector('input[autocomplete="name"]') as HTMLInputElement;
    const emailInput = element.querySelector('input[autocomplete="email"]') as HTMLInputElement;
    const companyInput = element.querySelector('input[autocomplete="organization"]') as HTMLInputElement;
    const projectTypeSelect = element.querySelector('select') as HTMLSelectElement;
    const messageInput = element.querySelector('textarea') as HTMLTextAreaElement;
    const form = element.querySelector('form') as HTMLFormElement;

    nameInput.value = 'Alex';
    nameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'alex@example.com';
    emailInput.dispatchEvent(new Event('input'));

    companyInput.value = 'Foundry';
    companyInput.dispatchEvent(new Event('input'));

    projectTypeSelect.value = 'Migration';
    projectTypeSelect.dispatchEvent(new Event('change'));

    messageInput.value = 'We need a migration path that keeps the site deployable on static hosting.';
    messageInput.dispatchEvent(new Event('input'));

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      name: 'Alex',
      email: 'alex@example.com',
      company: 'Foundry',
      projectType: 'Migration',
      message: 'We need a migration path that keeps the site deployable on static hosting.',
    });
    expect(element.textContent).toContain('Request received for Migration. We will respond shortly.');
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(companyInput.value).toBe('');
    expect(projectTypeSelect.value).toBe('Template implementation');
    expect(messageInput.value).toBe('');
  });
});
