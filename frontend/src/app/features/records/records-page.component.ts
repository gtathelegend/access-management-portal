import { DatePipe, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { RecordsService } from '../../core/services/records.service';
import { StatsService } from '../../core/services/stats.service';
import { UsersService } from '../../core/services/users.service';
import type { DashboardStatsResponse } from '../../core/models/stats.model';
import type { ListRecordsParams, RecordSortBy, RecordStatus, SortOrder, VerificationRecord } from '../../core/models/record.model';
import type { AdminUser } from '../../core/models/user-admin.model';
import { AppBadgeComponent } from '../../shared/ui/badge/badge.component';
import { AppButtonComponent } from '../../shared/ui/button/button.component';
import { AppCardComponent } from '../../shared/ui/card/card.component';
import { AppInputComponent } from '../../shared/ui/input/input.component';
import { AppTableComponent } from '../../shared/ui/table/table.component';
import { ErrorRetryComponent } from '../../shared/components/error-retry/error-retry.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { SkeletonTableComponent } from '../../shared/components/skeleton-table/skeleton-table.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RecordDetailsDialogComponent } from './record-details-dialog/record-details-dialog.component';

@Component({
  selector: 'app-records-page',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TitleCasePipe,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    AppBadgeComponent,
    AppButtonComponent,
    AppCardComponent,
    AppInputComponent,
    AppTableComponent,
    ErrorRetryComponent,
    SkeletonCardComponent,
    SkeletonTableComponent,
    PageHeaderComponent,
  ],
  templateUrl: './records-page.component.html',
  styleUrl: './records-page.component.scss',
})
export class RecordsPageComponent {
  private readonly authService = inject(AuthService);
  private readonly recordsService = inject(RecordsService);
  private readonly statsService = inject(StatsService);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly statsLoading = signal(false);
  readonly recordsLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly statusControl = new FormControl<RecordStatus | ''>('', { nonNullable: true });
  readonly accessLevelControl = new FormControl<string>('', { nonNullable: true });
  readonly fromControl = new FormControl<string>('', { nonNullable: true });
  readonly toControl = new FormControl<string>('', { nonNullable: true });
  readonly sortByControl = new FormControl<RecordSortBy>('createdAt', { nonNullable: true });
  readonly sortOrderControl = new FormControl<SortOrder>('desc', { nonNullable: true });

  private readonly q = signal('');
  private readonly statusFilter = signal<RecordStatus | undefined>(undefined);
  private readonly accessLevelFilter = signal('');
  private readonly createdFromFilter = signal('');
  private readonly createdToFilter = signal('');
  private readonly sortBy = signal<RecordSortBy>('createdAt');
  private readonly sortOrder = signal<SortOrder>('desc');

  private readonly records = signal<VerificationRecord[]>([]);
  readonly items = computed(() => this.records());
  readonly userLookup = signal<Map<string, string>>(new Map());

  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly total = signal(0);

  readonly stats = signal<DashboardStatsResponse>({
    totalUsers: 0,
    activeUsers: 0,
    adminCount: 0,
    pendingVerifications: 0,
    disabledUsers: 0,
    recentActivityCount: 0,
    verificationStats: { roleDistribution: [], statusBreakdown: [], verificationTrends: [] },
  });

  readonly filteredRecords = computed(() => {
    const q = this.q().trim().toLowerCase();
    if (!q) return this.items();

    return this.items().filter((record) => {
      return (
        record._id.toLowerCase().includes(q) ||
        record.verificationType.toLowerCase().includes(q) ||
        record.accessLevel.toLowerCase().includes(q) ||
        record.status.toLowerCase().includes(q) ||
        (record.approvedBy ?? '').toLowerCase().includes(q) ||
        this.getUserLabel(record.userId).toLowerCase().includes(q)
      );
    });
  });

  readonly showEmptyState = computed(() => !this.recordsLoading() && !this.errorMessage() && this.filteredRecords().length === 0);

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(220), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.q.set(value.trim());
    });

    this.statusControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.statusFilter.set(value === '' ? undefined : value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    this.accessLevelControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.accessLevelFilter.set(value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    this.fromControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.createdFromFilter.set(value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    this.toControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.createdToFilter.set(value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    this.sortByControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.sortBy.set(value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    this.sortOrderControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.sortOrder.set(value);
      this.pageIndex.set(0);
      this.loadRecords();
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.refreshAll();
  }

  refreshAll(): void {
    this.loadStats();
    this.loadUserLookup();
    this.loadRecords();
  }

  onPage(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.loadRecords();
  }

  openRecordDetails(record: VerificationRecord): void {
    const label = this.getUserLabel(record.userId);
    this.dialog.open(RecordDetailsDialogComponent, {
      data: { record, userLabel: label },
      width: this.dialogWidth(),
      maxWidth: '92vw',
      height: this.dialogHeight(),
      panelClass: ['amp-dialog-panel', 'amp-dialog-panel--form'],
    });
  }

  statusCount(status: RecordStatus): number {
    return this.stats().verificationStats.statusBreakdown.find((item) => item.name === status)?.value ?? 0;
  }

  private loadStats(): void {
    this.statsLoading.set(true);
    this.statsService.getDashboardStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.statsLoading.set(false);
      },
      error: () => this.statsLoading.set(false),
    });
  }

  private loadUserLookup(): void {
    const map = new Map<string, string>();
    const currentUser = this.authService.currentUser();
    if (currentUser?.id) {
      map.set(currentUser.id, 'You');
    }

    if (this.currentRole() !== 'admin') {
      this.userLookup.set(map);
      return;
    }

    this.usersService.listUsers({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        for (const user of res.items) {
          map.set(user.id, user.name);
        }
        this.userLookup.set(map);
      },
      error: () => this.userLookup.set(map),
    });
  }

  private loadRecords(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.recordsLoading.set(true);
    this.errorMessage.set(null);

    const params: ListRecordsParams = {
      page: this.pageIndex() + 1,
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
      status: this.statusFilter(),
      accessLevel: this.accessLevelFilter() || undefined,
      createdFrom: this.createdFromFilter() || undefined,
      createdTo: this.createdToFilter() || undefined,
      delay: environment.demoDelayMs,
    };

    const currentUser = this.authService.currentUser();
    if (this.currentRole() !== 'admin' && currentUser?.id) {
      params.userId = currentUser.id;
    }

    this.recordsService.listRecords(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.records.set(res.items);
        this.total.set(res.total);
        this.recordsLoading.set(false);
      },
      error: (err: unknown) => {
        this.records.set([]);
        this.total.set(0);
        this.recordsLoading.set(false);
        this.errorMessage.set(this.normalizeError(err));
      },
    });
  }

  private currentRole(): 'admin' | 'user' {
    return this.authService.currentUser()?.role ?? 'user';
  }

  getUserLabel(userId: string): string {
    const currentUser = this.authService.currentUser();
    if (currentUser?.id === userId) return 'You';
    return this.userLookup().get(userId) ?? `${userId.slice(0, 8)}…`;
  }

  private dialogWidth(): string {
    if (!isPlatformBrowser(this.platformId)) return '720px';
    return window.innerWidth <= 599 ? '100vw' : '720px';
  }

  private dialogHeight(): string | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;
    return window.innerWidth <= 599 ? '100dvh' : undefined;
  }

  private normalizeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return (typeof err.error?.message === 'string' && err.error.message) || (err.status === 0 ? 'Unable to reach server' : null) || 'Unable to load records';
    }
    return err instanceof Error ? err.message : 'Unable to load records';
  }
}
