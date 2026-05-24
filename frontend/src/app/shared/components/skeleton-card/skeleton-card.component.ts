import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <section class="skeleton-card" [class.skeleton-card--compact]="compact">
      <div class="header" *ngIf="showHeader">
        <app-skeleton-loader appearance="circle" width="44px" height="44px" borderRadius="16px" margin="0"></app-skeleton-loader>
        <div class="copy">
          <app-skeleton-loader width="42%" height="14px" borderRadius="999px" margin="0"></app-skeleton-loader>
          <app-skeleton-loader width="68%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
        </div>
      </div>

      <div class="body">
        <app-skeleton-loader width="52%" height="26px" borderRadius="999px" margin="0 0 10px"></app-skeleton-loader>
        <app-skeleton-loader width="38%" height="14px" borderRadius="999px" margin="0 0 8px"></app-skeleton-loader>
        <app-skeleton-loader width="82%" height="14px" borderRadius="999px" margin="0 0 8px"></app-skeleton-loader>
        <app-skeleton-loader width="64%" height="14px" borderRadius="999px" margin="0"></app-skeleton-loader>
      </div>

      <div class="footer" *ngIf="showFooter">
        <app-skeleton-loader width="36%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .skeleton-card {
      display: grid;
      gap: var(--space-normal);
      padding: var(--space-section);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 84%, transparent);
      box-shadow: var(--shadow-sm);
      min-height: 180px;
    }

    .skeleton-card--compact {
      min-height: 116px;
      gap: var(--space-small);
      padding: 16px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .copy {
      display: grid;
      gap: 8px;
      flex: 1;
    }

    .body {
      display: grid;
      align-content: start;
    }

    .footer {
      display: flex;
      justify-content: flex-start;
    }
  `],
})
export class SkeletonCardComponent {
  @Input() compact = false;
  @Input() showHeader = true;
  @Input() showFooter = false;
}