import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { App } from './app';
import { routes } from './app.routes';
import { APP_ENVIRONMENT } from './core/config/environment.token';
import { provideDataAccess } from './core/providers/data.providers';

describe('App integration', () => {
  beforeEach(async () => {
    window.localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideLocationMocks(),
        provideRouter(routes),
        { provide: APP_ENVIRONMENT, useValue: environment },
        provideDataAccess(),
      ],
    }).compileComponents();
  });

  async function renderAppAt(url: string): Promise<HTMLElement> {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await router.navigateByUrl(url);
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  }

  it('redirects to the localized home route and renders the Next Template shell', async () => {
    const element = await renderAppAt('/');

    expect(TestBed.inject(Router).url).toBe('/en');
    expect(element.querySelector('.brand__name')?.textContent).toContain('Next Template');
    expect(element.querySelector('.skip-link')?.textContent).toContain('Skip to main content');
    expect(element.querySelector('main h1')?.textContent).toContain(
      'One template, multiple production-ready starting points.',
    );
  });

  it('loads a localized form example route', async () => {
    const element = await renderAppAt('/en/examples/forms');

    expect(element.querySelector('main h1')?.textContent).toContain('Employee profile form');
    expect(element.textContent).toContain('Reactive Forms');
  });

  it('renders the localized not-found route for unknown paths', async () => {
    const element = await renderAppAt('/de/does-not-exist');

    expect(element.querySelector('main h1')?.textContent).toContain('Die Seite existiert nicht.');
  });
});
