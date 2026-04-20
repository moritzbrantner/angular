import { Injectable } from '@angular/core';
import { NavigationEntry, NavigationGroup } from '../../shared/content/next-template.content';

@Injectable({
  providedIn: 'root',
})
export class HotkeyService {
  findEntry(groups: readonly NavigationGroup[], key: string): NavigationEntry | undefined {
    const normalizedKey = key.toUpperCase();
    return groups.flatMap((group) => group.entries).find((entry) => entry.hotkey === normalizedKey);
  }
}
