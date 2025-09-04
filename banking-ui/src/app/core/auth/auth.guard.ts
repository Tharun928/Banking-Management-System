import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Checking authentication...');
  console.log('AuthGuard - isLoggedIn():', auth.isLoggedIn());
  console.log('AuthGuard - Token:', auth.getToken());
  console.log('AuthGuard - Username:', auth.getUsername());
  console.log('AuthGuard - Role:', auth.getRole());

  if (!auth.isLoggedIn()) {
    console.log('AuthGuard - User not logged in, redirecting to login');
    router.navigate(['/auth/login']);
    return false;
  }
  
  console.log('AuthGuard - User is authenticated, allowing access');
  return true;
};
