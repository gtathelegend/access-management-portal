import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import type { AdminUser, CreateUserRequest, UpdateUserRequest, UserRole, UserStatus } from '../../../../core/models/user-admin.model';

export type UserDialogMode = 'create' | 'edit';

export interface UserDialogData {
  mode: UserDialogMode;
  user?: AdminUser;
}

export type UserDialogResult =
  | { mode: 'create'; payload: CreateUserRequest }
  | { mode: 'edit'; id: string; payload: UpdateUserRequest };

import { AppButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AppButtonComponent,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent, UserDialogResult>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);

  readonly mode = this.data.mode;

  readonly form = new FormGroup({
    name: new FormControl<string>(this.data.user?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    }),
    email: new FormControl<string>(this.data.user?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    role: new FormControl<UserRole>(this.data.user?.role ?? 'user', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<UserStatus>(this.data.user?.status ?? 'active', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: this.mode === 'create' ? [Validators.required, Validators.minLength(8), Validators.maxLength(200)] : [],
    }),
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.mode === 'create') {
      const payload: CreateUserRequest = {
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        role: value.role,
        status: value.status,
      };
      this.dialogRef.close({ mode: 'create', payload });
      return;
    }

    if (!this.data.user) {
      return;
    }

    const payload: UpdateUserRequest = {
      name: value.name.trim(),
      email: value.email.trim(),
      role: value.role,
      status: value.status,
    };

    this.dialogRef.close({ mode: 'edit', id: this.data.user.id, payload });
  }
}
