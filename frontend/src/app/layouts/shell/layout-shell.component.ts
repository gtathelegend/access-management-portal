import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SidebarNavComponent } from '../sidebar/sidebar-nav.component';
import { TopNavbarComponent } from '../navbar/top-navbar.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [NgIf, RouterOutlet, MatSidenavModule, SidebarNavComponent, TopNavbarComponent],
  templateUrl: './layout-shell.component.html',
  styleUrl: './layout-shell.component.scss',
})
export class LayoutShellComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly isHandset = isPlatformBrowser(this.platformId)
    ? toSignal(
        this.breakpointObserver
          .observe([Breakpoints.Handset])
          .pipe(map((state) => state.matches)),
        { initialValue: false },
      )
    : signal(false);

  readonly isTablet = isPlatformBrowser(this.platformId)
    ? toSignal(
        this.breakpointObserver
          .observe([Breakpoints.Tablet])
          .pipe(map((state) => state.matches)),
        { initialValue: false },
      )
    : signal(false);

  readonly isCompactSidebar = computed(() => this.isHandset() || this.isTablet());

  readonly sidenavOpened = signal(true);
  readonly sidebarCollapsed = signal(false);

  constructor() {
    effect(
      () => {
        const handset = this.isHandset();
        const tablet = this.isTablet();

        if (handset) {
          this.sidenavOpened.set(false);
          this.sidebarCollapsed.set(false);
          return;
        }

        if (tablet) {
          this.sidenavOpened.set(true);
          this.sidebarCollapsed.set(true);
          return;
        }

        this.sidenavOpened.set(true);
        this.sidebarCollapsed.set(false);
      },
      { allowSignalWrites: true },
    );

    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.closeSidenavIfHandset());
    }
  }

  toggleSidenav(): void {
    if (this.isHandset()) {
      this.sidenavOpened.update((v) => !v);
      return;
    }

    if (this.isTablet()) {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  closeSidenavIfHandset(): void {
    if (this.isHandset()) {
      this.sidenavOpened.set(false);
    }
  }
}
