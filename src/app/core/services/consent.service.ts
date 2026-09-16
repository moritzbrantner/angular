import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { ConsentState } from '../../shared/models/content.models';

const STORAGE_KEY = 'app-consent';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly state = signal<ConsentState>(this.load());

  readonly consent = this.state.asReadonly();

  acceptAll(): void {
    this.set({ decided: true, analytics: true });
  }

  necessaryOnly(): void {
    this.set({ decided: true, analytics: false });
  }

  private set(state: ConsentState): void {
    this.state.set(state);
    if (this.isBrowser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  private load(): ConsentState {
    if (!this.isBrowser) {
      return { decided: true, analytics: false };
    }

    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (stored && typeof stored === 'object' && 'decided' in stored && 'analytics' in stored) {
        return stored as ConsentState;
      }
    } catch {
      return { decided: false, analytics: false };
    }

    return { decided: false, analytics: false };
  }
}
