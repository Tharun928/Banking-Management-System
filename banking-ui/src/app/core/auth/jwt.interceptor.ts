import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  console.log('JWT Interceptor - Token:', token);
  console.log('JWT Interceptor - Request URL:', req.url);
  
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  console.log('JWT Interceptor - Headers:', cloned.headers);

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log('JWT Interceptor - Error:', err.status, err.message);
      if (err.status === 401 || err.status === 403) {
        console.log('JWT Interceptor - Unauthorized, logging out');
        auth.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
};
