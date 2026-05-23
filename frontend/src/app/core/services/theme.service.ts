import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'amp.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mode = signal<ThemeMode>('light');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const saved = this.readFromStorage();
    this.setMode(saved ?? 'light');
  }

  toggle(): void {
    const next: ThemeMode = this.mode() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const body = this.document?.body;
    if (!body) {
      return;
    }

    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');

    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
  }

  private readFromStorage(): ThemeMode | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }
}
