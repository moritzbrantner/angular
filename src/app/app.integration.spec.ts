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
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  it('renders the shell navigation on the home route', async () => {
    const element = await renderAppAt('/');

    expect(element.querySelector('.brand__name')?.textContent).toContain('Foundry Stack');
    expect(element.querySelector('.skip-link')?.textContent).toContain('Skip to main content');
    expect(element.querySelector('main h1')?.textContent).toContain(
      'Build once for GitHub Pages, then grow into backend services without rewriting the UI.',
    );
  });

  it('loads a template detail route with related content and SEO metadata', async () => {
    const element = await renderAppAt('/templates/atlas-launch-kit');

    expect(element.querySelector('main h1')?.textContent).toContain('Atlas Launch Kit');
    expect(element.querySelector('main')?.textContent).toContain('Northstar Ops');
    expect(document.title).toBe('Atlas Launch Kit | Foundry Stack');
  });

  it('renders the not-found route for unknown paths', async () => {
    const element = await renderAppAt('/does-not-exist');

    expect(element.querySelector('main h1')?.textContent).toContain(
      'That page does not exist in this build.',
    );
  });
});
