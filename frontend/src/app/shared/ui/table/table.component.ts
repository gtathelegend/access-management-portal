import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <ng-content select="[appTableHeader]"></ng-content>
        </thead>
        <tbody>
          <ng-content select="[appTableBody]"></ng-content>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    :host ::ng-deep {
      th {
        padding: var(--space-normal);
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--border-subtle);
        background: var(--bg-hover);
      }

      td {
        padding: var(--space-normal);
        font-size: 14px;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-subtle);
        transition: background-color var(--transition-fast);
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover td {
        background: var(--bg-hover);
      }
    }
  `]
})
export class AppTableComponent {
}
