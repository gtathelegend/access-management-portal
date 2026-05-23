import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

import { ErrorRetryComponent } from '../../shared/components/error-retry/error-retry.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { AnalyticsService, AnalyticsStats } from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
    ErrorRetryComponent,
    PageHeaderComponent
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
})
export class AnalyticsPageComponent implements OnInit {
  stats?: AnalyticsStats;
  errorMessage = signal<string | null>(null);
  loading = true;

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3f51b5', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#00bcd4']
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  refresh(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.errorMessage.set(null);

    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
        this.errorMessage.set('Unable to load analytics at the moment.');
        this.loading = false;
      }
    });
  }
}
