import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { AccessModes } from '../enums';

export const homeGuard: CanActivateFn = async (route, state) => {
  const navigationService = inject(NavigationService);
  const router = inject(Router);
  const accessMode = await navigationService.resolveAccessToPath(state.url);
  console.log('checking access mode', accessMode);
  if (accessMode === AccessModes.Authorized) {
    return true;
  } else if (accessMode === AccessModes.NotAuthorized) {
    return router.createUrlTree(['/error']);
  } else {
    console.log('redirecting to login');
    return router.createUrlTree(['/login']);
  }
};
