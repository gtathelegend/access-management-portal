import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" [class.hoverable]="hoverable" [class.compact]="compact">
      <header class="card-header" *ngIf="title || subtitle">
        <div class="card-heading" *ngIf="title || subtitle">
          <div class="card-eyebrow" *ngIf="eyebrow">{{ eyebrow }}</div>
          <h3 class="card-title" *ngIf="title">{{ title }}</h3>
          <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-actions">
          <ng-content select="[cardActions]"></ng-content>
        </div>
      </header>
      <div class="card-divider" *ngIf="(title || subtitle) && divider"></div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-premium);
      padding: var(--space-section);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-normal);
      min-width: 0;
      overflow: hidden;
    }

    .card.hoverable:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--border-strong);
    }

    @media (hover: none) {
      .card.hoverable:hover {
        transform: none;
      }
    }

    .card.compact {
      padding: var(--space-normal);
      gap: var(--space-small);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-normal);
      flex-wrap: wrap;
    }

    .card-heading {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .card-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-primary);
    }

    .card-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-subtitle {
      margin: var(--space-micro) 0 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .card-divider {
      height: 1px;
      background: var(--border-subtle);
    }

    .card-content {
      flex: 1;
      min-width: 0;
    }

    .card-footer {
      margin-top: var(--space-small);
      padding-top: var(--space-normal);
      border-top: 1px solid var(--border-subtle);
    }

    .card-actions:empty {
      display: none;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-left: auto;
    }

    @media (max-width: 599.98px) {
      .card {
        padding: 16px;
        border-radius: 18px;
      }

      .card-title {
        font-size: 17px;
      }

      .card-subtitle {
        font-size: 13px;
      }
    }
  `]
})
export class AppCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
  @Input() hoverable = false;
  @Input() compact = false;
  @Input() hasFooter = false;
  @Input() divider = false;
}
