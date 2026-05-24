import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-shell">
      <div class="table-scroll">
        <table class="table">
        <thead>
          <ng-content select="[appTableHeader]"></ng-content>
        </thead>
        <tbody>
          <ng-content select="[appTableBody]"></ng-content>
        </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .table-shell {
      width: 100%;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 640px;
    }

    :host ::ng-deep {
      th {
        padding: 14px 16px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--border-subtle);
        background: color-mix(in srgb, var(--bg-hover) 68%, var(--bg-surface));
      }

      td {
        padding: 14px 16px;
        font-size: 14px;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-subtle);
        transition: background-color var(--transition-fast);
        vertical-align: middle;
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover td {
        background: color-mix(in srgb, var(--bg-hover) 76%, transparent);
      }
    }
  `]
})
export class AppTableComponent {
}
