import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppSettingsService } from './core/services/app-settings.service';
import { ConsentService } from './core/services/consent.service';
import { HotkeyService } from './core/services/hotkey.service';
import { LocaleService } from './core/services/locale.service';
import { NAVIGATION, NavigationEntry } from './shared/content/next-template.content';
import { Locale } from './shared/models/content.models';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-root',
    '(window:keydown)': 'handleKeydown($event)',
  },
})
export class App {
  private readonly router = inject(Router);
  protected readonly localeService = inject(LocaleService);
  protected readonly settingsService = inject(AppSettingsService);
  protected readonly consentService = inject(ConsentService);
  private readonly hotkeyService = inject(HotkeyService);

  protected readonly locale = this.localeService.locale;
  protected readonly groups = computed(() => NAVIGATION[this.locale()]);
  protected readonly discoverGroup = computed(() => this.groups()[0]);
  protected readonly workspaceGroup = computed(() => this.groups()[1]);
  protected readonly accountGroup = computed(() => this.groups()[2]);
  protected readonly openMenu = signal<'discover' | 'workspace' | null>(null);
  protected readonly hotkeysOpen = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  protected localized(path: string): string {
    return this.localeService.localizedPath(path);
  }

  protected switchLocale(locale: Locale): string {
    return this.localeService.currentPathFor(locale);
  }

  protected toggleMenu(menu: 'discover' | 'workspace'): void {
    this.openMenu.update((current) => (current === menu ? null : menu));
  }

  protected closeMenus(): void {
    this.openMenu.set(null);
  }

  protected toggleHotkeys(): void {
    this.hotkeysOpen.update((open) => !open);
  }

  protected closeHotkeys(): void {
    this.hotkeysOpen.set(false);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenus();
      this.closeHotkeys();
      return;
    }

    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const entry = this.hotkeyService.findEntry(this.groups(), event.key);
    if (!entry) {
      return;
    }

    event.preventDefault();
    void this.navigateTo(entry);
  }

  protected navigateTo(entry: NavigationEntry): void {
    this.closeMenus();
    this.closeHotkeys();
    void this.router.navigateByUrl(this.localized(entry.path));
  }
}
