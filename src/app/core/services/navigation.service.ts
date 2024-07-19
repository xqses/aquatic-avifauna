import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AccessModes } from '../enums';
import { firstValueFrom } from 'rxjs';

export const ERROR_ROUTE = 'error';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router, private userService: UserService) {}

  async goto(path: string) {
    this.router.navigate([path]);
    return;
  }

  async resolveAccessToPath(route: string): Promise<AccessModes> {
    // Do some logic here to determine if user is authed and privileged to access this route
    const isAuthenticated = await firstValueFrom(
      this.userService.isAuthenticated$
    );
    if (
      isAuthenticated &&
      this.userService
        .resolveAvailablePaths()
        .some((path) => path.route === route)
    ) {
      return AccessModes.Authorized;
    } else if (!isAuthenticated) {
      return AccessModes.NotLoggedIn;
    }
    return AccessModes.NotAuthorized;
  }
}
