import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <section class="table-shell">
      <div class="toolbar" *ngIf="showToolbar">
        <app-skeleton-loader width="34%" height="36px" borderRadius="18px" margin="0"></app-skeleton-loader>
        <app-skeleton-loader width="110px" height="36px" borderRadius="18px" margin="0"></app-skeleton-loader>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th *ngFor="let _ of columnIndexes; trackBy: trackByIndex">
                <app-skeleton-loader width="72%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let _ of rowIndexes; trackBy: trackByIndex">
              <td *ngFor="let _ of columnIndexes; trackBy: trackByIndex">
                <app-skeleton-loader width="88%" height="14px" borderRadius="999px" margin="0"></app-skeleton-loader>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .table-shell {
      display: grid;
      gap: var(--space-normal);
      padding: var(--space-normal);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 84%, transparent);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      gap: var(--space-normal);
    }

    .table-scroll {
      overflow: auto;
      border-radius: var(--radius-md);
    }

    table {
      width: 100%;
      min-width: 640px;
      border-collapse: collapse;
    }

    thead th,
    tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr {
      height: 52px;
    }

    td:last-child,
    th:last-child {
      text-align: right;
    }
  `],
})
export class SkeletonTableComponent implements OnChanges {
  @Input() rows = 6;
  @Input() columns = 5;
  @Input() showToolbar = true;

  rowIndexes: number[] = [];
  columnIndexes: number[] = [];

  ngOnChanges(): void {
    this.rowIndexes = Array.from({ length: Math.max(1, this.rows) }, (_, index) => index);
    this.columnIndexes = Array.from({ length: Math.max(1, this.columns) }, (_, index) => index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}