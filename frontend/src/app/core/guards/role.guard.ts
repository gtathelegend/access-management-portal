import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/auth.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];
  const role = authService.getRole();

  if (!role || (allowed.length > 0 && !allowed.includes(role))) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};