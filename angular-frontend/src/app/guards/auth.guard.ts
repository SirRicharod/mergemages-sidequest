import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs/operators';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth check to complete before deciding
  return toObservable(authService.authCheckComplete).pipe(
    filter(complete => complete === true),
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }
      // Redirect to login if not authenticated
      router.navigate(['/login']);
      return false;
    })
  );
};

/**
 * Guard to prevent authenticated users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth check to complete before deciding
  return toObservable(authService.authCheckComplete).pipe(
    filter(complete => complete === true),
    take(1),
    map(() => {
      if (!authService.isAuthenticated()) {
        return true;
      }
      // Redirect to home if already authenticated
      router.navigate(['/']);
      return false;
    })
  );
};
