import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
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
  private readonly hotkeyTrigger = viewChild<ElementRef<HTMLButtonElement>>('hotkeyTrigger');
  private readonly hotkeyDialog = viewChild<ElementRef<HTMLElement>>('hotkeyDialog');
  private readonly hotkeyClose = viewChild<ElementRef<HTMLButtonElement>>('hotkeyClose');

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
    if (this.hotkeysOpen()) {
      this.closeHotkeys();
      return;
    }

    this.hotkeysOpen.set(true);
    queueMicrotask(() => this.hotkeyClose()?.nativeElement.focus());
  }

  protected closeHotkeys(): void {
    if (!this.hotkeysOpen()) {
      return;
    }

    this.hotkeysOpen.set(false);
    queueMicrotask(() => this.hotkeyTrigger()?.nativeElement.focus());
  }

  protected handleHotkeyDialogKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const dialog = this.hotkeyDialog()?.nativeElement;
    if (!dialog) {
      return;
    }

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hasAttribute('hidden'));
    const first = focusable.at(0);
    const last = focusable.at(-1);

    if (!first || !last) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenus();
      this.closeHotkeys();
      return;
    }

    if (this.isEditableTarget(event.target)) {
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

  private isEditableTarget(target: EventTarget | null): boolean {
    return target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable);
  }
}
