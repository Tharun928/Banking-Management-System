import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from './auth.models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as UserRole[]) || [];

  if (!auth.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  if (roles.length && !auth.hasRole(...roles)) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
