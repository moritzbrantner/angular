import { TestBed } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { ConsentService } from './consent.service';
import {
  ANGULAR_INPUT_BINDINGS_REGISTRY,
  ANGULAR_NAVIGATION_PATH_BY_ACTION,
} from './input-bindings.service';
import { UploadClassifierService } from './upload-classifier.service';

describe('App template services unit', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
    TestBed.configureTestingModule({});
  });

  it('classifies upload items by MIME type and extension', () => {
    const service = TestBed.inject(UploadClassifierService);
    const image = new File(['x'], 'preview.png', { type: 'image/png' });
    const data = new File(['{}'], 'records.json', { type: 'application/octet-stream' });

    expect(service.classify(image).kind).toBe('Image');
    expect(service.classify(image).strategy).toBe('Preview and optimize');
    expect(service.classify(data).kind).toBe('Data file');
    expect(service.classify(data).strategy).toBe('Validate schema');
  });

  it('persists theme settings and applies document classes', () => {
    const service = TestBed.inject(AppSettingsService);

    service.update({ theme: 'dark', compactSpacing: true, reducedMotion: true });

    expect(service.settings().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset['density']).toBe('compact');
    expect(document.documentElement.dataset['motion']).toBe('reduced');
    expect(window.localStorage.getItem('app-settings')).toContain('"theme":"dark"');
  });

  it('stores analytics consent decisions', () => {
    const service = TestBed.inject(ConsentService);

    service.acceptAll();

    expect(service.consent()).toEqual({ decided: true, analytics: true });
    expect(window.localStorage.getItem('app-consent')).toContain('"analytics":true');
  });

  it('declares navigation hotkeys in the shared input-bindings registry', () => {
    const formAction = ANGULAR_INPUT_BINDINGS_REGISTRY.actions.find(
      (action) => action.id === 'angular.navigate.examples.forms',
    );
    const dismissAction = ANGULAR_INPUT_BINDINGS_REGISTRY.actions.find(
      (action) => action.id === 'angular.dismissOverlays',
    );

    expect(ANGULAR_NAVIGATION_PATH_BY_ACTION['angular.navigate.examples.forms']).toBe('examples/forms');
    expect(formAction?.defaults[0].sequence[0]).toEqual({
      key: { kind: 'logical', value: 'f' },
      modifiers: { alt: true },
    });
    expect(dismissAction?.defaults[0].sequence[0]).toEqual({
      key: { kind: 'logical', value: 'Escape' },
      modifiers: {},
    });
  });
});
