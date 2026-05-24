import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-sidebar',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <aside class="sidebar-shell">
      <div class="brand-block">
        <app-skeleton-loader appearance="circle" width="36px" height="36px" borderRadius="12px" margin="0"></app-skeleton-loader>
        <div class="brand-copy">
          <app-skeleton-loader width="120px" height="14px" borderRadius="999px" margin="0"></app-skeleton-loader>
          <app-skeleton-loader width="88px" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        </div>
      </div>

      <div class="nav-list">
        <div class="nav-item" *ngFor="let _ of navIndexes; trackBy: trackByIndex">
          <app-skeleton-loader appearance="circle" width="18px" height="18px" borderRadius="999px" margin="0"></app-skeleton-loader>
          <app-skeleton-loader width="62%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        </div>
      </div>

      <div class="profile-block">
        <app-skeleton-loader appearance="circle" width="34px" height="34px" borderRadius="999px" margin="0"></app-skeleton-loader>
        <div class="profile-copy">
          <app-skeleton-loader width="68%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
          <app-skeleton-loader width="48%" height="10px" borderRadius="999px" margin="0"></app-skeleton-loader>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar-shell {
      display: grid;
      gap: var(--space-section);
      padding: var(--space-section) var(--space-normal);
      height: 100%;
      background: color-mix(in srgb, var(--bg-sidebar) 88%, transparent);
    }

    .brand-block,
    .profile-block,
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-copy,
    .profile-copy {
      display: grid;
      gap: 8px;
      min-width: 0;
      flex: 1;
    }

    .nav-list {
      display: grid;
      gap: 10px;
    }

    .nav-item {
      padding: 10px 12px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--bg-surface) 72%, transparent);
      border: 1px solid var(--border-subtle);
    }

    .profile-block {
      margin-top: auto;
      padding: 12px 14px;
      border-radius: 18px;
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 72%, transparent);
    }
  `],
})
export class SkeletonSidebarComponent {
  readonly navIndexes = [0, 1, 2, 3, 4];

  trackByIndex(index: number): number {
    return index;
  }
}