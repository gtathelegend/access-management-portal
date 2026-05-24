import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + variant" [class.badge--sm]="size === 'sm'" [class.badge--lg]="size === 'lg'">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      line-height: 1;
      border: 1px solid transparent;
      letter-spacing: 0.01em;
    }

    .badge-primary { background: color-mix(in srgb, var(--accent-primary) 12%, var(--bg-surface)); color: var(--accent-primary); border-color: color-mix(in srgb, var(--accent-primary) 18%, transparent); }
    .badge-success { background: color-mix(in srgb, var(--accent-success) 14%, var(--bg-surface)); color: color-mix(in srgb, var(--accent-success) 72%, black); border-color: color-mix(in srgb, var(--accent-success) 16%, transparent); }
    .badge-warning { background: color-mix(in srgb, var(--accent-warning) 14%, var(--bg-surface)); color: color-mix(in srgb, var(--accent-warning) 74%, black); border-color: color-mix(in srgb, var(--accent-warning) 16%, transparent); }
    .badge-danger { background: color-mix(in srgb, var(--accent-danger) 12%, var(--bg-surface)); color: var(--accent-danger); border-color: color-mix(in srgb, var(--accent-danger) 18%, transparent); }
    .badge-purple { background: color-mix(in srgb, var(--accent-purple) 12%, var(--bg-surface)); color: var(--accent-purple); border-color: color-mix(in srgb, var(--accent-purple) 18%, transparent); }
    .badge-gray { background: color-mix(in srgb, var(--bg-hover) 72%, var(--bg-surface)); color: var(--text-secondary); border-color: var(--border-subtle); }

    .badge--sm {
      padding: 3px 8px;
      font-size: 11px;
    }

    .badge--lg {
      padding: 6px 12px;
      font-size: 13px;
    }

    :host-context(.theme-dark) {
      .badge-primary { background: rgba(59, 130, 246, 0.18); color: #93c5fd; }
      .badge-success { background: rgba(34, 197, 94, 0.16); color: #86efac; }
      .badge-warning { background: rgba(245, 158, 11, 0.16); color: #fcd34d; }
      .badge-danger { background: rgba(239, 68, 68, 0.16); color: #fca5a5; }
      .badge-purple { background: rgba(139, 92, 246, 0.16); color: #d8b4fe; }
      .badge-gray { background: rgba(148, 163, 184, 0.16); color: #cbd5e1; }
    }
  `]
})
export class AppBadgeComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gray' = 'gray';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
