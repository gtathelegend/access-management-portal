import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-profile',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <section class="profile-shell">
      <div class="profile-head">
        <app-skeleton-loader appearance="circle" width="52px" height="52px" borderRadius="18px" margin="0"></app-skeleton-loader>
        <div class="profile-copy">
          <app-skeleton-loader width="48%" height="16px" borderRadius="999px" margin="0"></app-skeleton-loader>
          <app-skeleton-loader width="68%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        </div>
      </div>

      <div class="profile-lines">
        <app-skeleton-loader width="54%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        <app-skeleton-loader width="72%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        <app-skeleton-loader width="62%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
      </div>

      <div class="profile-actions" *ngIf="showActions">
        <app-skeleton-loader width="104px" height="32px" borderRadius="999px" margin="0"></app-skeleton-loader>
        <app-skeleton-loader width="88px" height="32px" borderRadius="999px" margin="0"></app-skeleton-loader>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .profile-shell {
      display: grid;
      gap: var(--space-normal);
      padding: var(--space-section);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 84%, transparent);
    }

    .profile-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .profile-copy,
    .profile-lines {
      display: grid;
      gap: 10px;
    }

    .profile-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  `],
})
export class SkeletonProfileComponent {
  @Input() showActions = false;
}