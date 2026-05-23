import { DatePipe, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, forkJoin, of, switchMap } from 'rxjs';

import { ErrorRetryComponent } from '../../../shared/components/error-retry/error-retry.component';
import { AppCardComponent } from '../../../shared/ui/card/card.component';
import { AppButtonComponent } from '../../../shared/ui/button/button.component';
import { AppBadgeComponent } from '../../../shared/ui/badge/badge.component';
import { AppTableComponent } from '../../../shared/ui/table/table.component';
import { AppInputComponent } from '../../../shared/ui/input/input.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { RecordsService } from '../../../core/services/records.service';
import { UsersService } from '../../../core/services/users.service';
import type { AdminUser, UserRole, UserStatus } from '../../../core/models/user-admin.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TitleCasePipe,

    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    
    AppCardComponent,
    AppButtonComponent,
    AppBadgeComponent,
    AppTableComponent,
    AppInputComponent,
    ErrorRetryComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly recordsService = inject(RecordsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly currentUser = this.authService.currentUser;

  readonly displayedColumns: Array<'name' | 'email' | 'role' | 'status' | 'createdAt' | 'actions'> = [
    'name',
    'email',
    'role',
    'status',
    'createdAt',
    'actions',
  ];

  readonly isLoading = signal(false);
  readonly statsLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly users = signal<AdminUser[]>([]);
  readonly items = computed(() => this.users());

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly roleControl = new FormControl<UserRole | ''>('', { nonNullable: true });
  readonly statusControl = new FormControl<UserStatus | ''>('', { nonNullable: true });

  private readonly q = signal<string>('');
  private readonly roleFilter = signal<UserRole | undefined>(undefined);
  private readonly statusFilter = signal<UserStatus | undefined>(undefined);

  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly total = signal<number>(0);

  readonly stats = signal({
    totalUsers: 0,
    activeUsers: 0,
    adminCount: 0,
    pendingVerifications: 0,
  });

  readonly showEmptyState = computed(() => {
    return !this.isLoading() && !this.errorMessage() && this.items().length === 0;
  });

  get welcomeName(): string {
    return this.currentUser()?.name ?? 'Admin';
  }

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
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
      width: '720px',
      maxWidth: '92vw',
    });

    ref
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((result) => {
          if (!result || result.mode !== 'create') {
            return of(null);
          }
          this.isLoading.set(true);
          return this.usersService.createUser(result.payload);
        }),
      )
      .subscribe({
        next: (user) => {
          if (!user) return;
          this.isLoading.set(false);
          this.snackBar.open('User created', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to create user'), 'Dismiss', { duration: 4000 });
        },
      });
  }

  openEditUser(user: AdminUser): void {
    const ref = this.dialog.open(UserDialogComponent, {
      data: { mode: 'edit', user },
      width: '720px',
      maxWidth: '92vw',
    });

    ref
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((result) => {
          if (!result || result.mode !== 'edit') {
            return of(null);
          }
          this.isLoading.set(true);
          return this.usersService.updateUser(result.id, result.payload);
        }),
      )
      .subscribe({
        next: (updated) => {
          if (!updated) return;
          this.isLoading.set(false);
          this.snackBar.open('User updated', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to update user'), 'Dismiss', { duration: 4000 });
        },
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
    });

    ref
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((ok) => {
          if (!ok) return of(null);
          this.isLoading.set(true);
          return this.usersService.deleteUser(user.id);
        }),
      )
      .subscribe({
        next: (result) => {
          if (result === null) return;
          this.isLoading.set(false);
          this.snackBar.open('User deleted', 'Dismiss', { duration: 2500 });
          this.refreshAll();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.snackBar.open(this.normalizeError(err, 'Unable to delete user'), 'Dismiss', { duration: 4000 });
        },
      });
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const page = this.pageIndex() + 1;
    const limit = this.pageSize();

    this.usersService
      .listUsers({
        page,
        limit,
        q: this.q() || undefined,
        role: this.roleFilter(),
        status: this.statusFilter(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.users.set(res.items);
          this.total.set(res.total);
          this.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.users.set([]);
          this.total.set(0);
          this.isLoading.set(false);
          this.errorMessage.set(this.normalizeError(err, 'Unable to load users'));
        },
      });
  }

  private loadStats(): void {
    this.statsLoading.set(true);

    forkJoin({
      totalUsers: this.usersService.listUsers({ page: 1, limit: 1 }),
      activeUsers: this.usersService.listUsers({ page: 1, limit: 1, status: 'active' }),
      adminCount: this.usersService.listUsers({ page: 1, limit: 1, role: 'admin' }),
      pendingVerifications: this.recordsService.listRecords({ page: 1, limit: 1, status: 'pending' }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.stats.set({
            totalUsers: res.totalUsers.total,
            activeUsers: res.activeUsers.total,
            adminCount: res.adminCount.total,
            pendingVerifications: res.pendingVerifications.total,
          });
          this.statsLoading.set(false);
        },
        error: () => {
          // Keep previous values; stats are non-critical.
          this.statsLoading.set(false);
        },
      });
  }

  private normalizeError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      return (
        (typeof err.error?.message === 'string' && err.error.message) ||
        (err.status === 0 ? 'Unable to reach server' : null) ||
        fallback
      );
    }
    return err instanceof Error ? err.message : fallback;
  }
}
