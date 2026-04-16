import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { StaticContactRepository, StaticTemplatesRepository } from './content.repositories';

describe('Static content repositories', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('returns template records by slug', async () => {
    const repository = TestBed.inject(StaticTemplatesRepository);
    const template = await firstValueFrom(repository.getBySlug('atlas-launch-kit'));

    expect(template?.name).toBe('Atlas Launch Kit');
  });

  it('accepts contact submissions in static mode', async () => {
    const repository = TestBed.inject(StaticContactRepository);
    const result = await firstValueFrom(
      repository.submit({
        name: 'Alex',
        email: 'alex@example.com',
        company: 'Foundry',
        projectType: 'Showcase site',
        message: 'We need a static-first site that can later move behind APIs.',
      }),
    );

    expect(result.ok).toBe(true);
  });
});
