import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, of, switchMap } from 'rxjs';

/**
 * If the user tries to navigate to login page while already logged in, we should probably not allow them to and instead redirect to home
 * @param route
 * @param state
 * @returns
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  return userService.isAuthenticated$.pipe(
    map((isAuthenticated) => !isAuthenticated)
  );
};
