import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + variant">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge-primary { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-gray { background: #f1f5f9; color: #475569; }

    :host-context(.theme-dark) {
      .badge-primary { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
      .badge-success { background: rgba(34, 197, 94, 0.2); color: #86efac; }
      .badge-warning { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
      .badge-danger { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
      .badge-purple { background: rgba(139, 92, 246, 0.2); color: #d8b4fe; }
      .badge-gray { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }
    }
  `]
})
export class AppBadgeComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gray' = 'gray';
}
