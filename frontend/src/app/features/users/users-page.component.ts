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
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { UsersService } from '../../core/services/users.service';
import type { DashboardStatsResponse } from '../../core/models/stats.model';
import type { AdminUser, ListUsersParams, UserRole, UserStatus } from '../../core/models/user-admin.model';
import { AppBadgeComponent } from '../../shared/ui/badge/badge.component';
import { AppButtonComponent } from '../../shared/ui/button/button.component';
import { AppCardComponent } from '../../shared/ui/card/card.component';
import { AppInputComponent } from '../../shared/ui/input/input.component';
import { AppTableComponent } from '../../shared/ui/table/table.component';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ErrorRetryComponent } from '../../shared/components/error-retry/error-retry.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { SkeletonTableComponent } from '../../shared/components/skeleton-table/skeleton-table.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { UserDialogComponent } from '../dashboard/admin-dashboard/user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-page',
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
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly authService = inject(AuthService);
  private readonly statsService = inject(StatsService);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly statsLoading = signal(false);
  readonly usersLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly roleControl = new FormControl<UserRole | ''>('', { nonNullable: true });
  readonly statusControl = new FormControl<UserStatus | ''>('', { nonNullable: true });
  readonly sortByControl = new FormControl<ListUsersParams['sortBy']>('createdAt', { nonNullable: true });
  readonly sortOrderControl = new FormControl<'asc' | 'desc'>('desc', { nonNullable: true });

  private readonly q = signal('');
  private readonly roleFilter = signal<UserRole | undefined>(undefined);
  private readonly statusFilter = signal<UserStatus | undefined>(undefined);
  private readonly sortBy = signal<ListUsersParams['sortBy']>('createdAt');
  private readonly sortOrder = signal<'asc' | 'desc'>('desc');

  private readonly users = signal<AdminUser[]>([]);
  readonly items = computed(() => this.users());

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

  readonly showEmptyState = computed(() => !this.usersLoading() && !this.errorMessage() && this.items().length === 0);

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(220), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.q.set(value.trim());
      this.pageIndex.set(0);
      this.loadUsers();
    });

    this.roleControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.roleFilter.set(value === '' ? undefined : value);
      this.pageIndex.set(0);
      this.loadUsers();
    });

    this.statusControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.statusFilter.set(value === '' ? undefined : value);
      this.pageIndex.set(0);
      this.loadUsers();
    });

    this.sortByControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.sortBy.set(value);
      this.pageIndex.set(0);
      this.loadUsers();
    });

    this.sortOrderControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.sortOrder.set(value);
      this.pageIndex.set(0);
      this.loadUsers();
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.refreshAll();
  }

  refreshAll(): void {
    this.loadStats();
    this.loadUsers();
  }

  onPage(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.loadUsers();
  }

  openCreateUser(): void {
    const ref = this.dialog.open(UserDialogComponent, {
      data: { mode: 'create' },
      width: this.dialogWidth(),
      maxWidth: '92vw',
      height: this.dialogHeight(),
      panelClass: ['amp-dialog-panel', 'amp-dialog-panel--form'],
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result || result.mode !== 'create') return;
      this.usersLoading.set(true);
      this.usersService.createUser(result.payload).subscribe({
        next: () => {
          this.usersLoading.set(false);
          this.snackBar.open('User created', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.usersLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to create user'), 'Dismiss', { duration: 4000 });
        },
      });
    });
  }

  openEditUser(user: AdminUser): void {
    const ref = this.dialog.open(UserDialogComponent, {
      data: { mode: 'edit', user },
      width: this.dialogWidth(),
      maxWidth: '92vw',
      height: this.dialogHeight(),
      panelClass: ['amp-dialog-panel', 'amp-dialog-panel--form'],
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result || result.mode !== 'edit') return;
      this.usersLoading.set(true);
      this.usersService.updateUser(result.id, result.payload).subscribe({
        next: () => {
          this.usersLoading.set(false);
          this.snackBar.open('User updated', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.usersLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to update user'), 'Dismiss', { duration: 4000 });
        },
      });
    });
  }

  toggleStatus(user: AdminUser): void {
    const nextStatus: UserStatus = user.status === 'active' ? 'disabled' : 'active';
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${nextStatus === 'disabled' ? 'Disable' : 'Enable'} user`,
        message: `${nextStatus === 'disabled' ? 'Disable' : 'Enable'} ${user.name} (${user.email})?`,
        confirmText: nextStatus === 'disabled' ? 'Disable' : 'Enable',
        danger: nextStatus === 'disabled',
      },
      width: '420px',
      maxWidth: '92vw',
      panelClass: ['amp-dialog-panel', 'amp-dialog-panel--confirm'],
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ok) => {
      if (!ok) return;
      this.usersLoading.set(true);
      this.usersService.updateUser(user.id, { status: nextStatus }).subscribe({
        next: () => {
          this.usersLoading.set(false);
          this.snackBar.open(`User ${nextStatus}`, 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.usersLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to update user'), 'Dismiss', { duration: 4000 });
        },
      });
    });
  }

  confirmDelete(user: AdminUser): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete user',
        message: `Delete ${user.name} (${user.email})? This cannot be undone.`,
        confirmText: 'Delete',
        danger: true,
      },
      width: '420px',
      maxWidth: '92vw',
      panelClass: ['amp-dialog-panel', 'amp-dialog-panel--confirm'],
    });

    ref.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ok) => {
      if (!ok) return;
      this.usersLoading.set(true);
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.usersLoading.set(false);
          this.snackBar.open('User deleted', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.usersLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to delete user'), 'Dismiss', { duration: 4000 });
        },
      });
    });
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

  private loadUsers(): void {
    this.usersLoading.set(true);
    this.errorMessage.set(null);

    const params: ListUsersParams = {
      page: this.pageIndex() + 1,
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
      q: this.q() || undefined,
      role: this.roleFilter(),
      status: this.statusFilter(),
      delay: environment.demoDelayMs,
    };

    this.usersService.listUsers(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.total.set(res.total);
        this.usersLoading.set(false);
      },
      error: (err: unknown) => {
        this.users.set([]);
        this.total.set(0);
        this.usersLoading.set(false);
        this.errorMessage.set(this.normalizeError(err, 'Unable to load users'));
      },
    });
  }

  private dialogWidth(): string {
    if (!isPlatformBrowser(this.platformId)) return '720px';
    return window.innerWidth <= 599 ? '100vw' : '720px';
  }

  private dialogHeight(): string | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;
    return window.innerWidth <= 599 ? '100dvh' : undefined;
  }

  private normalizeError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      return (typeof err.error?.message === 'string' && err.error.message) || (err.status === 0 ? 'Unable to reach server' : null) || fallback;
    }
    return err instanceof Error ? err.message : fallback;
  }
}
