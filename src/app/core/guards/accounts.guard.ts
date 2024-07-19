import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { AccessModes } from '../enums';

export const accountsGuard: CanActivateFn = async (route, state) => {
  const navigationService = inject(NavigationService);
  const router = inject(Router);
  const accessMode = await navigationService.resolveAccessToPath(state.url);
  if (accessMode === AccessModes.Authorized) {
    return true;
  } else if (accessMode === AccessModes.NotAuthorized) {
    return router.createUrlTree(['/error']);
  } else {
    return router.createUrlTree(['/login']);
  }
};
