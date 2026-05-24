import { DatePipe, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, type Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ErrorRetryComponent } from '../../../shared/components/error-retry/error-retry.component';
import { SkeletonProfileComponent } from '../../../shared/components/skeleton-profile/skeleton-profile.component';
import { SkeletonTableComponent } from '../../../shared/components/skeleton-table/skeleton-table.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { AppCardComponent } from '../../../shared/ui/card/card.component';
import { AppButtonComponent } from '../../../shared/ui/button/button.component';
import { AppBadgeComponent } from '../../../shared/ui/badge/badge.component';
import { AppTableComponent } from '../../../shared/ui/table/table.component';
import { AppInputComponent } from '../../../shared/ui/input/input.component';
import { AuthService } from '../../../core/services/auth.service';
import { RecordsService } from '../../../core/services/records.service';
import type { RecordSortBy, SortOrder, VerificationRecord } from '../../../core/models/record.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    ReactiveFormsModule,
    TitleCasePipe,

    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    
    AppCardComponent,
    AppButtonComponent,
    AppBadgeComponent,
    AppTableComponent,
    AppInputComponent,
    SkeletonProfileComponent,
    SkeletonTableComponent,
    ErrorRetryComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly user = this.authService.currentUser;

  readonly displayedColumns: Array<'createdAt' | 'verificationType' | 'accessLevel' | 'status' | 'approvedBy'> = [
    'createdAt',
    'verificationType',
    'accessLevel',
    'status',
    'approvedBy',
  ];

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly records = signal<VerificationRecord[]>([]);
  readonly filterControl = new FormControl<string>('', { nonNullable: true });
  readonly filterText = signal<string>('');

  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly total = signal<number>(0);

  private readonly sortBy = signal<RecordSortBy>('createdAt');
  private readonly sortOrder = signal<SortOrder>('desc');

  readonly filteredRecords = computed(() => {
    const items = this.records();
    const q = this.filterText().trim().toLowerCase();
    if (!q) return items;

    return items.filter((r) => {
      const approvedBy = r.approvedBy ?? '';
      return (
        r.verificationType.toLowerCase().includes(q) ||
        r.accessLevel.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        approvedBy.toLowerCase().includes(q) ||
        new Date(r.createdAt).toLocaleString().toLowerCase().includes(q)
      );
    });
  });

  readonly showEmptyState = computed(() => {
    return !this.isLoading() && !this.errorMessage() && this.filteredRecords().length === 0;
  });

  constructor() {
    this.filterControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.filterText.set(value);
      });

    // Avoid server-side API calls during SSR/prerender.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.refresh();
  }

  refresh(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.loadRecords();
  }

  goToRecords(): void {
    this.router.navigate(['/records']);
  }

  onPage(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.loadRecords();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sortBy.set('createdAt');
      this.sortOrder.set('desc');
    } else {
      this.sortBy.set(sort.active as RecordSortBy);
      this.sortOrder.set(sort.direction as SortOrder);
    }

    this.pageIndex.set(0);
    this.loadRecords();
  }

  private loadRecords(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const page = this.pageIndex() + 1;
    const limit = this.pageSize();

    this.recordsService
      .listRecords({
        page,
        limit,
        sortBy: this.sortBy(),
        sortOrder: this.sortOrder(),
      })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          this.records.set(res.items);
          this.total.set(res.total);
          this.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.records.set([]);
          this.total.set(0);
          this.errorMessage.set(this.normalizeError(err));
        },
      });
  }

  private normalizeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return (
        (typeof err.error?.message === 'string' && err.error.message) ||
        (err.status === 0 ? 'Unable to reach server' : null) ||
        'Unable to load records'
      );
    }
    return err instanceof Error ? err.message : 'Unable to load records';
  }
}
