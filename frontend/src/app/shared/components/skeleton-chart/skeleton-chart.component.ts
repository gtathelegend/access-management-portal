import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-chart',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <section class="chart-shell" [class.chart-shell--wide]="wide">
      <div class="chart-head">
        <app-skeleton-loader width="28%" height="16px" borderRadius="999px" margin="0"></app-skeleton-loader>
        <app-skeleton-loader width="88px" height="28px" borderRadius="999px" margin="0"></app-skeleton-loader>
      </div>

      <div class="chart-area" [class.chart-area--horizontal]="kind === 'bar'">
        @if (kind === 'pie') {
          <div class="pie-ring">
            <app-skeleton-loader appearance="circle" width="132px" height="132px" borderRadius="50%" margin="0"></app-skeleton-loader>
          </div>
        } @else if (kind === 'bar') {
          <div class="bars bars--horizontal">
            <div class="bar-row" *ngFor="let _ of rowIndexes; trackBy: trackByIndex">
              <app-skeleton-loader width="26%" height="12px" borderRadius="999px" margin="0"></app-skeleton-loader>
              <app-skeleton-loader width="62%" height="14px" borderRadius="999px" margin="0"></app-skeleton-loader>
            </div>
          </div>
        } @else {
          <div class="bars">
            <div class="bar-col" *ngFor="let _ of rowIndexes; trackBy: trackByIndex">
              <app-skeleton-loader width="100%" height="var(--height)" borderRadius="14px" margin="0"></app-skeleton-loader>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .chart-shell {
      display: grid;
      gap: var(--space-section);
      padding: var(--space-section);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 84%, transparent);
      min-height: 320px;
    }

    .chart-shell--wide {
      min-height: 360px;
    }

    .chart-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }

    .chart-area {
      display: grid;
      place-items: center;
      min-height: 220px;
    }

    .bars {
      width: 100%;
      display: grid;
      gap: 12px;
      align-items: end;
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    .bars--horizontal {
      grid-template-columns: 1fr;
      align-items: stretch;
      width: 100%;
    }

    .bar-row {
      display: grid;
      grid-template-columns: 88px 1fr;
      align-items: center;
      gap: 12px;
    }

    .bar-col {
      display: flex;
      align-items: flex-end;
      min-height: 180px;
      --height: 160px;
    }

    .bar-col:nth-child(2n) { --height: 96px; }
    .bar-col:nth-child(3n) { --height: 140px; }
    .bar-col:nth-child(4n) { --height: 116px; }
    .bar-col:nth-child(5n) { --height: 176px; }
    .bar-col:nth-child(6n) { --height: 132px; }

    .pie-ring {
      display: grid;
      place-items: center;
    }
  `],
})
export class SkeletonChartComponent {
  @Input() kind: 'pie' | 'bar' | 'column' = 'pie';
  @Input() wide = false;
  @Input() rows = 6;

  get rowIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.rows) }, (_, index) => index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}