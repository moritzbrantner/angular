import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NAVIGATION } from '../../shared/content/next-template.content';

export const INPUT_BINDINGS_BUNDLE_URL =
  'https://moritzbrantner.github.io/input-bindings/input-bindings-browser.js';

const CONTEXT_ID = 'angularApp';
const DISMISS_ACTION = 'angular.dismissOverlays';
const RUNTIME_STATE_DATASET_KEY = 'inputBindingsState';

export interface AngularInputActions {
  navigate(path: string): void;
  dismissOverlays(): void;
}

interface RuntimeModule {
  InputRuntimeController: new (options: Record<string, unknown>) => unknown;
  attachKeyboardRuntime(
    controller: unknown,
    options: {
      keyTarget: Document;
      focusTarget: Window;
      visibilityTarget: Document;
      ignoreTextEntry: boolean;
      mode: 'logical';
    },
  ): () => void;
}

function navigationActionId(path: string): string {
  return `angular.navigate.${path.length === 0 ? 'home' : path.replaceAll('/', '.')}`;
}

const navigationEntries = NAVIGATION.en.flatMap((group) => group.entries);
const navigationActions = Object.freeze(
  navigationEntries.map((entry) => {
    const action = navigationActionId(entry.path);
    return {
      id: action,
      title: `Navigate to ${entry.label}`,
      categoryPath: ['Angular application', 'Navigation'],
      repeatPolicy: 'never',
      allowedDevices: ['keyboard'],
      defaults: [
        {
          id: `${action}.default`,
          action,
          sequence: [
            {
              key: { kind: 'logical', value: entry.hotkey.toLowerCase() },
              modifiers: { alt: true },
            },
          ],
          when: { op: 'context', id: CONTEXT_ID },
          priority: 0,
        },
      ],
      provenance: { source: 'angular', version: '1' },
    };
  }),
);
const dismissAction = Object.freeze({
  id: DISMISS_ACTION,
  title: 'Dismiss open navigation overlays',
  categoryPath: ['Angular application', 'Navigation'],
  repeatPolicy: 'never',
  allowedDevices: ['keyboard'],
  defaults: [
    {
      id: `${DISMISS_ACTION}.default`,
      action: DISMISS_ACTION,
      sequence: [{ key: { kind: 'logical', value: 'Escape' }, modifiers: {} }],
      when: { op: 'context', id: CONTEXT_ID },
      priority: 0,
    },
  ],
  provenance: { source: 'angular', version: '1' },
});

export const ANGULAR_NAVIGATION_PATH_BY_ACTION: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(navigationEntries.map((entry) => [navigationActionId(entry.path), entry.path])),
);

export const ANGULAR_INPUT_BINDINGS_REGISTRY = Object.freeze({
  actions: Object.freeze([...navigationActions, dismissAction]),
});

const NAVIGATION_RUNTIME_REGISTRY = Object.freeze({ actions: navigationActions });
const DISMISS_RUNTIME_REGISTRY = Object.freeze({ actions: Object.freeze([dismissAction]) });

@Injectable({
  providedIn: 'root',
})
export class InputBindingsService {
  private readonly platformId = inject(PLATFORM_ID);

  attach(actions: AngularInputActions): () => void {
    if (!isPlatformBrowser(this.platformId)) {
      return () => {};
    }

    let disposed = false;
    const detachments: Array<() => void> = [];
    const detachRuntime = () => {
      while (detachments.length > 0) {
        detachments.pop()?.();
      }
    };
    document.documentElement.dataset[RUNTIME_STATE_DATASET_KEY] = 'loading';

    const runtimePromise = import(/* @vite-ignore */ INPUT_BINDINGS_BUNDLE_URL) as Promise<RuntimeModule>;
    void runtimePromise
      .then(({ InputRuntimeController, attachKeyboardRuntime }) => {
        if (disposed) {
          return;
        }

        const navigationController = new InputRuntimeController({
          registry: NAVIGATION_RUNTIME_REGISTRY,
          getActiveContexts: () => new Set([CONTEXT_ID]),
          chordTimeoutMs: 900,
          consumePolicy: 'matched',
          onDispatch: (dispatch: { action: string; phase: string }) => {
            if (dispatch.phase !== 'press') {
              return;
            }

            const path = ANGULAR_NAVIGATION_PATH_BY_ACTION[dispatch.action];
            if (path !== undefined) {
              actions.navigate(path);
            }
          },
        });
        const dismissController = new InputRuntimeController({
          registry: DISMISS_RUNTIME_REGISTRY,
          getActiveContexts: () => new Set([CONTEXT_ID]),
          chordTimeoutMs: 900,
          consumePolicy: 'never',
          onDispatch: (dispatch: { action: string; phase: string }) => {
            if (dispatch.phase === 'press' && dispatch.action === DISMISS_ACTION) {
              actions.dismissOverlays();
            }
          },
        });

        detachments.push(
          attachKeyboardRuntime(navigationController, {
            keyTarget: document,
            focusTarget: window,
            visibilityTarget: document,
            ignoreTextEntry: true,
            mode: 'logical',
          }),
        );
        detachments.push(
          attachKeyboardRuntime(dismissController, {
            keyTarget: document,
            focusTarget: window,
            visibilityTarget: document,
            ignoreTextEntry: false,
            mode: 'logical',
          }),
        );
        document.documentElement.dataset[RUNTIME_STATE_DATASET_KEY] = 'ready';
      })
      .catch((error: unknown) => {
        detachRuntime();
        if (disposed) {
          return;
        }
        document.documentElement.dataset[RUNTIME_STATE_DATASET_KEY] = 'error';
        console.error('Failed to initialize shared input-bindings runtime', error);
      });

    return () => {
      disposed = true;
      detachRuntime();
      delete document.documentElement.dataset[RUNTIME_STATE_DATASET_KEY];
    };
  }
}
