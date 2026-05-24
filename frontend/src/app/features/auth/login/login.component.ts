import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';

import { AppCardComponent } from '../../../shared/ui/card/card.component';
import { AppButtonComponent } from '../../../shared/ui/button/button.component';
import type { LoginRoleOption, UserRole } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    AppCardComponent,
    AppButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  hidePassword = true;

  readonly roleOptions: LoginRoleOption[] = [
    { value: 'user', label: 'General User' },
    { value: 'admin', label: 'Admin' },
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', [Validators.required]],
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.redirectByRole();
    }
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const value = this.form.getRawValue();
    const payload = {
      email: value.email.trim(),
      password: value.password,
      role: value.role as UserRole,
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirectByRole();
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(err instanceof Error ? err.message : 'Login failed');
      },
    });
  }

  selectRole(role: UserRole): void {
    this.form.controls.role.setValue(role);
    this.form.controls.role.markAsTouched();
  }

  private redirectByRole(): void {
    const role = this.authService.getRole();
    void this.router.navigate([role === 'admin' ? '/dashboard/admin' : '/dashboard/user']);
  }
}
