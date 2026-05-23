import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { map } from 'rxjs/operators';

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

  readonly isHandset = isPlatformBrowser(this.platformId)
    ? toSignal(
        this.breakpointObserver
          .observe([Breakpoints.Handset])
          .pipe(map((state) => state.matches)),
        { initialValue: false },
      )
    : signal(false);

  readonly sidenavOpened = signal(true);

  constructor() {
    effect(
      () => {
        const handset = this.isHandset();
        this.sidenavOpened.set(!handset);
      },
      { allowSignalWrites: true },
    );
  }

  toggleSidenav(): void {
    if (this.isHandset()) {
      this.sidenavOpened.update((v) => !v);
    }
  }

  closeSidenavIfHandset(): void {
    if (this.isHandset()) {
      this.sidenavOpened.set(false);
    }
  }
}
