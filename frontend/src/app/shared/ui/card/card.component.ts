import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.hoverable]="hoverable" [class.compact]="compact">
      <div class="card-header" *ngIf="title">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-premium);
      padding: var(--space-section);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card.hoverable:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--border-strong);
    }

    .card.compact {
      padding: var(--space-normal);
    }

    .card-header {
      margin-bottom: var(--space-normal);
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

    .card-content {
      flex: 1;
    }

    .card-footer {
      margin-top: var(--space-normal);
      padding-top: var(--space-normal);
      border-top: 1px solid var(--border-subtle);
    }
  `]
})
export class AppCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() hoverable = false;
  @Input() compact = false;
  @Input() hasFooter = false;
}
