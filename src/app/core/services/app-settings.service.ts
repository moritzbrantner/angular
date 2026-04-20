import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { AppSettings } from '../../shared/models/content.models';

const STORAGE_KEY = 'app-settings';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'light',
  background: 'paper',
  dateFormat: 'localized',
  weekStartsOn: 1,
  showOutsideDays: true,
  compactSpacing: false,
  reducedMotion: false,
  showHotkeyHints: true,
  notifications: {
    enabled: true,
    type: 'instant',
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readSettings(value: string | null): AppSettings | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) {
      return null;
    }

    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed,
      theme: parsed['theme'] === 'dark' ? 'dark' : 'light',
      notifications: {
        ...DEFAULT_APP_SETTINGS.notifications,
        ...(isRecord(parsed['notifications']) ? parsed['notifications'] : {}),
      },
    };
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly settingsState = signal<AppSettings>(this.loadInitialSettings());

  readonly settings = this.settingsState.asReadonly();
  readonly isDark = computed(() => this.settings().theme === 'dark');

  constructor() {
    this.apply(this.settings());
  }

  toggleTheme(): void {
    this.update({
      theme: this.settings().theme === 'dark' ? 'light' : 'dark',
    });
  }

  update(partial: Partial<AppSettings>): void {
    this.settingsState.update((settings) => {
      const next: AppSettings = {
        ...settings,
        ...partial,
        notifications: {
          ...settings.notifications,
          ...(partial.notifications ?? {}),
        },
      };
      this.persist(next);
      this.apply(next);
      return next;
    });
  }

  private loadInitialSettings(): AppSettings {
    if (!this.isBrowser) {
      return DEFAULT_APP_SETTINGS;
    }

    const stored = readSettings(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      return stored;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return {
      ...DEFAULT_APP_SETTINGS,
      theme: prefersDark ? 'dark' : 'light',
    };
  }

  private persist(settings: AppSettings): void {
    if (!this.isBrowser) {
      return;
    }

    const value = JSON.stringify(settings);
    window.localStorage.setItem(STORAGE_KEY, value);
    this.document.cookie = `${STORAGE_KEY}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
    this.document.cookie = `theme=${settings.theme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  private apply(settings: AppSettings): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.classList.toggle('light', settings.theme === 'light');
    root.dataset['background'] = settings.background;
    root.dataset['density'] = settings.compactSpacing ? 'compact' : 'comfortable';
    root.dataset['motion'] = settings.reducedMotion ? 'reduced' : 'full';
    root.dataset['hotkeyHints'] = settings.showHotkeyHints ? 'visible' : 'hidden';
  }
}
